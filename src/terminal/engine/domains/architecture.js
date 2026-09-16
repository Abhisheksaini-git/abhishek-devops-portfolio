/**
 * Cloud & DevOps Architecture Blueprints (with ASCII visual topologies)
 */

export const architectureKnowledge = {
  domain: 'architecture',
  topics: [
    {
      id: 'aws-ha-3tier',
      title: 'AWS Enterprise High-Availability 3-Tier Architecture',
      keywords: ['aws architecture', '3 tier', 'three tier', 'high availability architecture', 'vpc architecture', 'cloud architecture', 'ha architecture'],
      summary: 'Production-ready, multi-AZ, fault-tolerant 3-tier web architecture with public, private, and database subnets.',
      content: `### 🏗️ AWS High-Availability 3-Tier Production Architecture

Designed for **99.99% availability**, zero single points of failure (SPOF), and defense-in-depth isolation.

\`\`\`text
                 [ Route 53 (DNS / Latency / Failover) ]
                                   │
                                   ▼
                 [ AWS WAF + CloudFront CDN (Global Edge) ]
                                   │
═══════════════════════════════════╪═══════════════════════════════════════════════
 AWS Region: us-east-1             │ (HTTPS :443)
───────────────────────────────────┼───────────────────────────────────────────────
 [ Public Subnet - AZ-1a ]         │         [ Public Subnet - AZ-1b ]
   ┌───────────────────────────────▼──────────────────────────────┐
   │         Application Load Balancer (ALB) - Multi-AZ           │
   └───────────────────────────────┬──────────────────────────────┘
   [ NAT Gateway A ]               │         [ NAT Gateway B ]
═══════════════════════════════════╪═══════════════════════════════════════════════
 [ Private App Subnet - AZ-1a ]    │         [ Private App Subnet - AZ-1b ]
   ┌───────────────────────────────▼──────────────────────────────┐
   │ Auto Scaling Group (EC2 / EKS Fargate / ECS)                 │
   │  - App Server Pod 1                       - App Server Pod 2 │
   │  - Target Tracking CPU 70%                - Zero direct SSH  │
   └───────────────────────────────┬──────────────────────────────┘
                                   │ (Port 5432 / 6379)
═══════════════════════════════════╪═══════════════════════════════════════════════
 [ Isolated Database Subnet - AZ-1a ]       [ Isolated Database Subnet - AZ-1b ]
   ┌───────────────────────────────┐         ┌──────────────────────────────┐
   │ Amazon Aurora PostgreSQL (Primary) ──(Sync Replication)──> Aurora (Read Replica) │
   └───────────────────────────────┘         └──────────────────────────────┘
   ┌────────────────────────────────────────────────────────────────────────┐
   │ Amazon ElastiCache Redis Cluster (Multi-AZ with Auto-Failover)         │
   └────────────────────────────────────────────────────────────────────────┘
\`\`\`

---

### 🛡️ Core Security & Resilience Pillars:
1. **Zero Public IPs in Application Layer**: App nodes live in private subnets with egress via dual multi-AZ NAT Gateways.
2. **Database Isolation**: Database subnets have **no internet route** (no IGW or NAT route).
3. **Security Group Cascading**:
   - ALB SG allows \`0.0.0.0/0:443\`.
   - App SG allows traffic **ONLY from ALB Security Group ID** on port 8080.
   - DB SG allows traffic **ONLY from App Security Group ID** on port 5432.
4. **Auto-Recovery**: Health checks trigger automatic replacement of unhealthy EC2 instances or K8s pods within 60 seconds.`
    },
    {
      id: 'devsecops-pipeline-architecture',
      title: 'End-to-End DevSecOps CI/CD Pipeline Architecture',
      keywords: ['devsecops architecture', 'pipeline architecture', 'gitops', 'ci cd architecture', 'security pipeline'],
      summary: 'Shift-Left continuous integration, automated container security scanning, SAST, DAST, and ArgoCD GitOps delivery.',
      content: `### 🚀 Enterprise DevSecOps CI/CD Pipeline Architecture

Fully automated **Shift-Left security** lifecycle from developer IDE to Kubernetes cluster.

\`\`\`text
  [ Developer IDE ]
        │  (git commit)
        ├─► [ Pre-commit Hook: Gitleaks / detect-secrets ]
        ▼
  [ GitHub Enterprise / GitLab ]
        │  (Pull Request webhook)
        ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 1. CI Orchestrator (GitHub Actions / Jenkins K8s Agent) │
  │    ├── Linting & Unit Tests (Jest, PyTest, Go test)    │
  │    ├── SAST (SonarQube / Semgrep code security)         │
  │    └── Dependency Audit (Snyk / OWASP Dependency Check) │
  └─────────────────────────────┬───────────────────────────┘
                                │ (Passes all quality gates)
                                ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 2. Artifact & Container Security                        │
  │    ├── Multi-Stage Docker Build (Distroless / Alpine)   │
  │    ├── Container CVE Scan (Trivy / Aqua / Clair)       │
  │    ├── Sign Image (Cosign / Sigstore)                   │
  │    └── Push to Registry (AWS ECR / Harbor)              │
  └─────────────────────────────┬───────────────────────────┘
                                │ (Update deployment manifest)
                                ▼
  [ GitOps Repo (Helm Charts / Kustomize) ]
        │
        │ (Poll / Webhook 3-minute reconciliation)
        ▼
  ┌─────────────────────────────────────────────────────────┐
  │ 3. Continuous Delivery & Runtime (ArgoCD / Flux)        │
  │    ├── Target: AWS EKS / Production Kubernetes Cluster  │
  │    ├── Rolling Update / Canary Deploy (Argo Rollouts)   │
  │    ├── Runtime Security (Falco / AWS GuardDuty)         │
  │    └── Observability Feedback (Prometheus & Datadog)    │
  └─────────────────────────────────────────────────────────┘
\`\`\`

---

### 🔑 Security Gates (Zero Compromise):
- **Fail Pipeline immediately** if any \`CRITICAL\` or \`HIGH\` severity CVE with a known fix is found.
- **Image Provenance**: K8s admission controller (Kyverno / OPA Gatekeeper) blocks any unsigned image.`
    },
    {
      id: 'kubernetes-production-architecture',
      title: 'Production Kubernetes (EKS) Ingress & Compute Architecture',
      keywords: ['kubernetes architecture', 'eks architecture', 'k8s production', 'ingress controller', 'karpenter'],
      summary: 'Multi-tenant, highly scalable EKS cluster architecture with Karpenter autoscaling, AWS Load Balancer Controller, and ExternalDNS.',
      content: `### ☸️ Production AWS EKS Ingress & Compute Architecture

\`\`\`text
  [ Internet Clients ]
          │ (HTTPS :443)
          ▼
  [ AWS Route 53 (Managed by ExternalDNS) ]
          │
          ▼
  [ AWS Network / Application Load Balancer ]
          │ (Created automatically via AWS Load Balancer Controller)
          ▼
  [ Ingress Controller (ingress-nginx / Envoy Gateway) ]
          │ (ClusterIP Service routing)
          ▼
  ┌───────────────────────────────────────────────────────────────┐
  │ EKS Cluster Worker Nodes (Managed by Karpenter Autoscaler)   │
  │                                                               │
  │  [ Pod 1 (Frontend) ] ──► [ Pod 2 (Backend API) ]            │
  │      ▲                        ▲                               │
  │      │                        │                               │
  │   (HPA: CPU > 75%)        (HPA: In-flight requests)           │
  │                                                               │
  │  [ DaemonSets: FluentBit, Cilium/AWS-VPC-CNI, node-exporter ] │
  └───────────────────────────────────────────────────────────────┘
\`\`\`

---

### ⚡ Why Karpenter Over Standard Cluster Autoscaler?
1. **Direct Provisioning**: Karpenter talks directly to AWS EC2 fleet APIs without ASGs (Auto Scaling Groups).
2. **Speed**: Spins up new instances in **45 seconds** instead of 5–8 minutes.
3. **Cost Optimization**: Bin-packs pods onto the cheapest spot/graviton instances dynamically.`
    }
  ]
};
