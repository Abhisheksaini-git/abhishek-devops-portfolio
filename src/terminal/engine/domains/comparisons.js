/**
 * Architectural Comparisons & Trade-off Matrices
 */

export const comparisonMatrices = [
  {
    id: 'docker-vs-kubernetes',
    title: 'Docker vs Kubernetes (K8s)',
    keywords: ['docker vs k8s', 'docker vs kubernetes', 'kubernetes vs docker', 'container vs orchestrator'],
    summary: 'Docker packages applications into containers; Kubernetes orchestrates, scales, and manages container clusters.',
    content: `### ⚖️ Docker vs Kubernetes: The Fundamental Difference

**Docker and Kubernetes are not competitors; they complement each other in modern cloud infrastructure.**

---

| Dimension | Docker (Containerization) | Kubernetes (Orchestration) |
| :--- | :--- | :--- |
| **Role** | Creates, packages, and runs individual containers on a single OS kernel | Orchestrates, schedules, and manages thousands of containers across a cluster of nodes |
| **Scope** | Single host runtime & image building tool | Multi-node distributed system platform |
| **Self-Healing** | If a container crashes, Docker daemon can restart it; but if the host crashes, all containers die | Detects failed worker nodes and automatically reschedules pods onto healthy nodes |
| **Autoscaling** | No native autoscaling across traffic spikes | Dynamic Horizontal Pod Autoscaling (HPA) and cluster node provisioning (Karpenter) |
| **Service Discovery & LB** | Basic single-host container bridge network | Built-in CoreDNS, ClusterIP, NodePort, LoadBalancer services, and Ingress routing |
| **Storage Management** | Local bind mounts and volumes | CSI (Container Storage Interface) managing dynamic EBS, EFS, Ceph, and NFS provisioning |

---

### 💡 Analogy:
- **Docker** is the individual shipping container standard.
- **Kubernetes** is the automated cargo ship, gantry crane fleet, and seaport logistics manager.`
  },
  {
    id: 'vm-vs-container',
    title: 'Virtual Machines (VM) vs Containers',
    keywords: ['vm vs container', 'virtual machine vs docker', 'hypervisor vs container', 'containers vs vms'],
    summary: 'VMs virtualize the hardware layer with a complete guest OS; containers share the host OS kernel for lightweight isolation.',
    content: `### ⚖️ Virtual Machines vs Containers: Architectural Trade-offs

---

| Feature | Virtual Machines (VMs) | Containers (Docker / containerd) |
| :--- | :--- | :--- |
| **Virtualization Layer** | Hardware Level (Type-1 or Type-2 Hypervisors like KVM, ESXi, Hyper-V) | Operating System Kernel Level (Linux cgroups, namespaces, seccomp) |
| **Guest OS** | Complete Guest OS per VM (Ubuntu, RedHat, Windows) including its own kernel | **No Guest OS**; all containers share the host Linux kernel |
| **Boot Time** | Minutes (boots BIOS, kernel, systemd services) | **Milliseconds to seconds** (spawns an isolated process) |
| **Resource Overhead** | Heavy (requires several GBs of dedicated RAM and storage per VM) | Ultra-lightweight (megabytes; only application binary and dependencies) |
| **Security Isolation** | **Strongest isolation**: Hardware boundary; kernel exploit in one VM does not compromise host | **Process-level isolation**: Shared kernel means kernel vulnerabilities require defense-in-depth |
| **Portability** | Heavy VM images (10GB - 50GB VHD/VMDK files) | Lightweight container images (5MB - 300MB OCI images) |`
  },
  {
    id: 'git-rebase-vs-merge',
    title: 'Git Rebase vs Git Merge',
    keywords: ['rebase vs merge', 'git merge vs rebase', 'git rebase vs merge', 'merge vs rebase'],
    summary: 'Merge preserves exact historical chronology; Rebase rewrites history to create a clean, linear commit log.',
    content: `### ⚖️ Git Rebase vs Git Merge: Architectural Analysis

---

| Metric | \`git merge\` | \`git rebase\` |
| :--- | :--- | :--- |
| **Commit History** | Preserves exact chronological order with explicit merge commit nodes | Rewrites commit SHAs to create a completely linear, branchless history |
| **Merge Commit** | Creates a 2-parent merge commit (e.g. \`Merge branch 'feature'\`) | **No extra merge commit** created |
| **Traceability** | Easy to see when a feature branch was integrated into main | Clean, readable \`git log\` without tangled criss-cross merge branches |
| **Safety on Shared Branches** | **100% safe**: Never rewrites published commits | **Dangerous if pushed**: Rewrites SHAs; never rebase a shared remote branch |

---

### 🛡️ Golden DevOps Rule:
- **Use \`rebase\` locally** on your private feature branch to keep up-to-date with \`main\` before opening a Pull Request.
- **Use \`Squash & Merge\`** in GitHub/GitLab to fold 20 small work-in-progress commits into 1 atomic, clean commit on \`main\`.`
  },
  {
    id: 'terraform-vs-ansible',
    title: 'Terraform vs Ansible: IaC vs Configuration Management',
    keywords: ['terraform vs ansible', 'ansible vs terraform', 'iac vs cm', 'provisioning vs configuration'],
    summary: 'Terraform provisions cloud infrastructure (declarative, state-managed); Ansible configures operating systems and software (push-based, agentless).',
    content: `### ⚖️ Terraform vs Ansible: Provisioning vs Configuration

---

| Attribute | Terraform (HashiCorp) | Ansible (Red Hat) |
| :--- | :--- | :--- |
| **Primary Domain** | **Infrastructure Provisioning (IaC)**: Creates VPCs, Subnets, EC2, EKS, RDS, S3 | **Configuration Management (CM)**: Installs packages, configures \`/etc/nginx.conf\`, manages users |
| **Philosophy** | **Declarative**: You declare WHAT the end state should look like; Terraform figures out API calls | **Declarative & Procedural Hybrid**: YAML playbooks executed in sequential order |
| **State Management** | **State-Driven**: Maintains a central \`terraform.tfstate\` database | **Stateless**: Reads current system state live over SSH during playbook execution |
| **Protocol** | Cloud Provider REST APIs (HTTPS) | SSH (Linux) / WinRM (Windows) — **Agentless** |
| **Lifecycle** | Immutable Infrastructure: Replaces servers rather than patching in-place | Mutable or Immutable: Can patch, reconfigure, or update existing long-running servers |

---

### 💡 Production Synergy (How Senior Teams Combine Both):
1. **Terraform** provisions the cloud foundation (VPC, IAM, Security Groups, EKS, RDS).
2. **Packer + Ansible** bakes hardened, golden AMI images pre-installed with security tools and monitoring agents.
3. **Terraform** deploys the Auto Scaling Group using those pre-baked golden AMIs.`
  }
];
