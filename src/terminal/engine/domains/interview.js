/**
 * Senior DevOps / Cloud Architect / SRE Interview Questions & Answers
 */

export const interviewQuestions = [
  {
    id: 'k8s-statefulset-vs-deployment',
    category: 'kubernetes',
    question: 'What is the exact difference between a Kubernetes Deployment and a StatefulSet, and when MUST you use a StatefulSet?',
    hint: 'Think about network identity (DNS hostname), persistent storage binding, and ordered graceful deployment/scaling.',
    answer: `### 🎯 Kubernetes Deployment vs StatefulSet

In Kubernetes, **Deployments** manage stateless workloads, while **StatefulSets** manage stateful applications (e.g. Kafka, Elasticsearch, Cassandra, PostgreSQL primary-replica).

---

| Dimension | Deployment (Stateless) | StatefulSet (Stateful) |
| :--- | :--- | :--- |
| **Pod Identity** | Random hash names (\`web-698b7f8c4-xk2l9\`) | Stable, ordinal index (\`kafka-0\`, \`kafka-1\`, \`kafka-2\`) |
| **DNS Hostname** | Shared service virtual IP / random endpoint | Stable network DNS via Headless Service (\`kafka-0.kafka-headless.ns.svc.cluster.local\`) |
| **Storage (PVC)** | Shared PVC or ephemeral ephemeral-storage | **VolumeClaimTemplates**: Each pod gets its own dedicated, persistent EBS/PV volume that re-attaches even if rescheduled on another node |
| **Startup / Teardown Order** | Concurrent / arbitrary parallel scaling | Strict sequential order: Pod 0 ➔ Pod 1 ➔ Pod 2; teardown is reverse: Pod 2 ➔ Pod 1 ➔ Pod 0 |

---

### 💡 When You MUST Use StatefulSet:
1. **Master-Worker or Clustered Databases**: When nodes must discover each other via fixed hostnames (e.g., Kafka broker IDs, Zookeeper quorum, MongoDB replica set).
2. **Dedicated Persistent Volume per Replica**: When each replica requires its own independent persistent disk that persists across pod restarts and node migrations.`
  },
  {
    id: 'aws-vpc-peering-vs-transit-gateway',
    category: 'aws',
    question: 'When should an enterprise choose AWS Transit Gateway over VPC Peering?',
    hint: 'Think about mesh complexity ($N(N-1)/2$), transitive routing limitations, centralized inspection firewalls, and AWS billing costs.',
    answer: `### 🎯 AWS VPC Peering vs AWS Transit Gateway (TGW)

---

### 1. VPC Peering
* **Topology**: 1-to-1 point-to-point connections.
* **Non-Transitive**: If VPC A is peered with VPC B, and B is peered with C, **A CANNOT talk to C through B**.
* **Complexity**: Connecting $N$ VPCs requires $\\frac{N(N-1)}{2}$ peering connections. At 20 VPCs, that is **190 peering links**—a routing table nightmare.
* **Cost**: No hourly charge; you pay standard intra-region data transfer rates ($0.01/GB).

---

### 2. AWS Transit Gateway (Hub-and-Spoke)
* **Topology**: Centralized regional virtual router (Hub-and-Spoke).
* **Transitive Routing**: Every connected VPC, VPN, and Direct Connect can route traffic to every other attachment via centralized route tables.
* **Centralized Egress & Inspection**: Enables a centralized "Inspection VPC" with Palo Alto / Fortinet or AWS Network Firewall where all egress and inter-VPC traffic is inspected in one place.
* **Cost**: $0.05/hour per attachment + $0.02/GB data processing charge.

---

### 💡 Recommendation:
- Use **VPC Peering** for simple 2–3 VPC setups with high-volume data transfer (saves TGW processing fees).
- Use **Transit Gateway** for enterprise multi-account / multi-VPC organizations (10+ VPCs) requiring centralized compliance, security inspection, and hybrid VPN/Direct Connect routing.`
  },
  {
    id: 'terraform-drift-detection',
    category: 'terraform',
    question: 'How does Terraform detect configuration drift, and how do you handle out-of-band changes made via the AWS Console?',
    hint: 'Explain the 3 states: Desired (code), Prior State (.tfstate), and Real Infrastructure (read via cloud API during refresh).',
    answer: `### 🎯 Terraform Drift Detection & Resolution

Configuration drift happens when resources managed by Terraform are modified outside of code (e.g. an engineer manually opens port 22 in AWS Console).

---

### 🔍 How Terraform Detects Drift:
When you run \`terraform plan\` or \`terraform apply\`:
1. **Refresh Phase**: Terraform queries the cloud provider APIs (AWS EC2, S3, RDS) to fetch the actual, live state of every resource recorded in \`terraform.tfstate\`.
2. **Comparison Matrix**: It compares **Live Cloud State** vs **Prior State File** vs **Desired Code (.tf files)**.
3. If Live State differs from Desired Code, Terraform plans an update or recreation to force live infrastructure back into compliance with your Git code.

---

### 🛠️ Production Workflow to Handle Drift:
- **Case 1: The manual change was unauthorized/accidental:**
  - Run \`terraform apply\` to overwrite the manual change and restore infrastructure to the declared Git state.
- **Case 2: The manual emergency hotfix is valid and must be kept:**
  - Update your \`.tf\` code to reflect the new desired settings.
  - Run \`terraform plan\` to verify \`0 to add, 0 to change, 0 to destroy\`.
  - Commit the updated code to Git.
- **Continuous Detection**: Run daily automated CI/CD jobs (\`terraform plan -detailed-exitcode\`) that alert Slack if drift is detected (exit code 2).`
  },
  {
    id: 'linux-zombie-vs-orphan',
    category: 'linux',
    question: 'Explain the difference between a Zombie process and an Orphan process in Linux. How do you clean up a Zombie process?',
    hint: 'Can you kill a Zombie with `kill -9`? Why or why not? Who is PID 1 in process reaping?',
    answer: `### 🎯 Linux Internals: Zombie vs Orphan Processes

---

### 1. Orphan Process
* **What**: A child process whose parent died or exited before the child finished executing.
* **What happens**: The Linux kernel automatically re-parents the orphan process to **PID 1 (init / systemd)**.
* **Impact**: Harmless. PID 1 continuously monitors and waits on child processes, cleanly reaping them upon completion.

---

### 2. Zombie Process (Defunct Process - State \`Z\`)
* **What**: A process that has finished execution (called \`exit()\`), but its entry still exists in the process table (\`/proc\`) because its parent has **not yet called \`wait()\` or \`waitpid()\`** to read the child's exit status code.
* **Can you kill a Zombie with \`kill -9 <PID>\`?**
  - **NO!** The process is **already dead**. It consumes zero CPU and zero memory. It is just an entry in the kernel process table.
* **When is it dangerous?**
  - If a buggy parent spawns thousands of zombies, it will exhaust the OS process ID table (\`/proc/sys/kernel/pid_max\`), preventing the system from spawning ANY new processes!

---

### 🧹 How to Clean Up a Zombie Process:
1. Signal the parent process to call \`wait()\`: \`kill -s SIGCHLD <Parent_PID>\`.
2. If the parent is stuck or uncooperative, kill the **parent process**: \`kill -15 <Parent_PID>\` or \`kill -9 <Parent_PID>\`.
3. The zombie child becomes an orphan, is instantly adopted by PID 1 (\`systemd\`), and PID 1 immediately calls \`wait()\` to purge it from the process table.`
  }
];
