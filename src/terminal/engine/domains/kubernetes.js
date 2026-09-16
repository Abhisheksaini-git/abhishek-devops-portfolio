/**
 * Kubernetes Production Orchestration Knowledge Module
 */

export const KUBERNETES_TOPICS = {
  architecture: {
    patterns: [
      'kubernetes', 'k8s', 'what is kubernetes', 'explain kubernetes',
      'kubernetes architecture', 'k8s architecture', 'control plane', 'worker node',
      'kube-apiserver', 'etcd', 'kubelet', 'kube-proxy'
    ],
    title: "Kubernetes Production Cluster Architecture",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[KUBERNETES INTERNALS] Control Plane vs Worker Node Architecture:</div>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; font-size: 0.82rem; margin: 0.4rem 0;">
    <div style="background: rgba(0,240,255,0.05); padding: 0.5rem; border: 1px solid rgba(0,240,255,0.2); border-radius: 4px;">
      <strong style="color: #00f0ff;">Control Plane Components:</strong>
      <ul style="margin-left: 1rem; margin-top: 0.2rem;">
        <li><strong>kube-apiserver:</strong> REST gateway; only component directly talking to etcd.</li>
        <li><strong>etcd:</strong> Consistent, HA distributed key-value store for all cluster state.</li>
        <li><strong>kube-scheduler:</strong> Assigns newly created Pods to nodes based on affinity/taints/resources.</li>
        <li><strong>kube-controller-manager:</strong> Node, replication, endpoint, and namespace lifecycle loops.</li>
      </ul>
    </div>
    <div style="background: rgba(168,85,247,0.05); padding: 0.5rem; border: 1px solid rgba(168,85,247,0.2); border-radius: 4px;">
      <strong style="color: #c084fc;">Worker Node Components:</strong>
      <ul style="margin-left: 1rem; margin-top: 0.2rem;">
        <li><strong>kubelet:</strong> Node agent; ensures containers described in PodSpecs are running and healthy.</li>
        <li><strong>kube-proxy:</strong> Maintains host network packet filtering (iptables/IPVS) for Service virtual IPs.</li>
        <li><strong>Container Runtime (CRI):</strong> containerd or CRI-O executing container images.</li>
        <li><strong>CoreDNS:</strong> Cluster-internal DNS service resolution.</li>
      </ul>
    </div>
  </div>
</div>
`
  },

  zero_downtime: {
    patterns: [
      'zero downtime deployment', 'zero-downtime deployment', 'rolling update kubernetes',
      'maxsurge maxunavailable', 'rolling update strategy'
    ],
    title: "Zero-Downtime Deployments in Kubernetes",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[PRODUCTION SRE] Achieving True Zero-Downtime Rolling Deployments:</div>
  <p>To prevent 502/504 errors during Kubernetes rollouts, three pillars are mandatory:</p>

  <ol style="margin-left: 1.2rem; font-size: 0.84rem; color: #cbd5e1;">
    <li><strong>Configuring RollingUpdate Strategy:</strong>
      <br /><code>maxSurge: 25%</code> (allow extra pods during rollout)
      <br /><code>maxUnavailable: 0</code> (guarantee existing capacity is never dropped below desired replica count).
    </li>
    <li><strong>Accurate Readiness Probes:</strong>
      <br />Kubernetes must NOT route user traffic to a newly created Pod until its <strong>Readiness Probe</strong> succeeds. Without readiness probes, K8s immediately routes traffic to cold containers.
    </li>
    <li><strong>Graceful Shutdown (SIGTERM handling) & preStop Hook:</strong>
      <br />When terminating an old Pod, endpoint removal is asynchronous. Add a <code>preStop: exec: command: ["sleep", "5"]</code> hook to ensure kube-proxy has updated iptables before the app closes connections.
    </li>
  </ol>
</div>
`
  },

  hpa_autoscaling: {
    patterns: [
      'horizontal pod autoscaler', 'hpa', 'vpa', 'cluster autoscaler',
      'pod autoscaling', 'k8s autoscaling'
    ],
    title: "Kubernetes Autoscaling Tiers: HPA, VPA & Cluster Autoscaler",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[AUTOSCALING] Kubernetes 3-Tier Production Autoscaling:</div>
  
  <div style="font-size: 0.82rem; color: #cbd5e1;">
    <p><strong>1. Horizontal Pod Autoscaler (HPA):</strong> Scales the number of Pod replicas (e.g. 3 &rarr; 15) horizontally based on CPU utilization, memory thresholds, or custom Prometheus metrics (via KEDA).</p>
    <p><strong>2. Vertical Pod Autoscaler (VPA):</strong> Adjusts the CPU and memory requests/limits of existing containers over time based on historical usage analysis.</p>
    <p><strong>3. Cluster Autoscaler (or Karpenter):</strong> Provisions or terminates physical/cloud worker nodes (e.g. AWS EC2) when Pods are stuck in <code>Pending</code> due to insufficient cluster compute.</p>
  </div>
  
  <div style="color: #f59e0b; font-size: 0.8rem; margin-top: 0.3rem;">
    <strong>Senior Rule:</strong> Never use HPA and VPA simultaneously on the exact same CPU/memory metrics to avoid fighting feedback loops. Use HPA for scaling and VPA in "Recommendation" mode.
  </div>
</div>
`
  },

  probes: {
    patterns: [
      'readiness probe', 'liveness probe', 'startup probe', 'k8s probes',
      'difference between liveness and readiness'
    ],
    title: "Kubernetes Probes: Liveness vs Readiness vs Startup",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[HEALTH CHECKING] Liveness vs Readiness vs Startup Probes:</div>
  
  <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin: 0.4rem 0;">
    <tr style="color: #00f0ff; border-bottom: 1px solid rgba(255,255,255,0.1);"><th style="text-align: left; padding: 3px;">Probe</th><th style="text-align: left; padding: 3px;">Purpose</th><th style="text-align: left; padding: 3px;">Failure Action</th></tr>
    <tr><td style="color:#38bdf8;"><strong>Startup</strong></td><td>Checks if slow-booting application (e.g. Java Spring) has finished initialization.</td><td>Kills container & restarts. Disables Liveness/Readiness until passed.</td></tr>
    <tr><td style="color:#34d399;"><strong>Readiness</strong></td><td>Checks if the container is ready to accept incoming client network traffic.</td><td><strong>Removes Pod IP from Service Endpoints.</strong> Does NOT kill the pod!</td></tr>
    <tr><td style="color:#ef4444;"><strong>Liveness</strong></td><td>Detects deadlocks where app is running but frozen/unrecoverable.</td><td><strong>Kills and restarts</strong> the container.</td></tr>
  </table>

  <div style="color: #ef4444; font-size: 0.8rem; margin-top: 0.3rem;">
    <strong>Common Anti-Pattern:</strong> Making Liveness probes check external database connectivity. If the DB goes down, ALL pods will restart repeatedly in a devastating cascade! Liveness must only check local process health.
  </div>
</div>
`
  },

  scheduling_affinity: {
    patterns: [
      'k8s scheduling', 'taints and tolerations', 'node affinity',
      'pod anti affinity', 'pod disruption budget', 'pdb'
    ],
    title: "Advanced Scheduling: Taints, Tolerations & Affinity",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[SCHEDULING] Advanced Workload Placement & High Availability:</div>
  
  <div style="font-size: 0.82rem; color: #cbd5e1;">
    &bull; <strong>Taints & Tolerations:</strong> Nodes <em>taint</em> themselves to repel certain workloads (e.g. GPU nodes, master nodes). Only Pods with matching <em>tolerations</em> can schedule there.<br />
    &bull; <strong>Node Affinity:</strong> Constrains Pods to nodes with specific labels (e.g. <code>topology.kubernetes.io/zone: us-east-1a</code>).<br />
    &bull; <strong>Pod Anti-Affinity:</strong> Prevents multiple replicas of the same service from running on the same node or Availability Zone (crucial for multi-AZ disaster recovery!).<br />
    &bull; <strong>PodDisruptionBudget (PDB):</strong> Guarantees minimum available replicas during voluntary node drains and cluster upgrades.
  </div>
</div>
`
  }
};
