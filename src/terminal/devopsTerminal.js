/**
 * Interactive DevOps Portfolio Simulation Terminal
 * Features:
 * - 100% Functional Frontend Simulator & Local Knowledge Engine
 * - Real Event-Driven Execution (Execute Button, Enter Key, Suggestion Chips)
 * - Command History Navigation (Arrow Up / Down)
 * - Natural Language & Hinglish DevOps Question Parser
 * - DevOps CLI Command Explanations & Real-Time Simulations
 * - Architectural Comparisons & DevOps Interview Q&A
 * - Real Abhishek Saini Portfolio Data Integration
 * - Resilient Error Boundary & Debounce Protection
 */

import { portfolioData } from '../data/portfolioData.js';
import { sound } from '../utils/audio.js';
import { processDevOpsQuery } from './engine/parser.js';
import { renderMarkdownToHTML } from './engine/formatter.js';

// =========================================================================
// 1. Core DevOps Knowledge Base (Concepts, Architecture & Interview Q&A)
// =========================================================================
const DEVOPS_KNOWLEDGE_BASE = {
  // Kubernetes Concepts
  kubernetes: {
    title: "Kubernetes (K8s)",
    description: "Kubernetes is an open-source container orchestration platform designed to automate deploying, scaling, and managing containerized applications across compute clusters.",
    details: "Control Plane: kube-apiserver, etcd, kube-scheduler, kube-controller-manager.<br />Worker Nodes: kubelet, kube-proxy, container runtime (containerd/CRI-O)."
  },
  pod: {
    title: "Kubernetes Pod",
    description: "A Pod is the smallest execution unit in Kubernetes. It encapsulates one or more co-located containers that share the same network namespace (IP address & port space), IPC, and shared storage volumes."
  },
  deployment: {
    title: "Kubernetes Deployment",
    description: "A Deployment provides declarative updates for Pods and ReplicaSets. It enables automated zero-downtime rolling updates, rollbacks, self-healing, and dynamic replica scaling."
  },
  replicaset: {
    title: "Kubernetes ReplicaSet",
    description: "A ReplicaSet ensures that a specified number of Pod replicas are running at any given time. Deployments manage ReplicaSets automatically to orchestrate rolling releases."
  },
  namespace: {
    title: "Kubernetes Namespace",
    description: "Namespaces provide virtual cluster partitioning within a single physical Kubernetes cluster. They provide scope for names, resource quotas, and RBAC isolation for multi-tenant teams or environments (dev, staging, prod)."
  },
  service: {
    title: "Kubernetes Service",
    description: "A Service is an abstraction defining a logical set of Pods and a policy to access them. Types: ClusterIP (internal default), NodePort (static port on worker nodes), LoadBalancer (cloud provider load balancer), and ExternalName (DNS alias)."
  },
  ingress: {
    title: "Kubernetes Ingress",
    description: "Ingress manages external HTTP/HTTPS access to cluster services, providing URL routing rules, SSL/TLS certificate termination, load balancing, and name-based virtual hosting (via controllers like NGINX Ingress Controller)."
  },
  configmap: {
    title: "Kubernetes ConfigMap",
    description: "ConfigMaps store non-confidential configuration data as key-value pairs. Pods consume ConfigMaps as environment variables, command-line arguments, or mounted volume files."
  },
  secret: {
    title: "Kubernetes Secret",
    description: "Secrets store sensitive data such as passwords, API tokens, and SSH keys. They are base64-encoded by default and mounted as tmpfs volumes or injected into environment variables."
  },
  hpa: {
    title: "Horizontal Pod Autoscaler (HPA)",
    description: "HPA automatically scales the number of Pod replicas in a deployment or stateful set based on observed CPU utilization, memory thresholds, or custom application metrics."
  },

  // Docker Concepts
  docker: {
    title: "Docker",
    description: "Docker is an open-source containerization platform that packages software and all its runtime dependencies into portable, isolated containers that run reliably in any computing environment."
  },
  container: {
    title: "Docker Container",
    description: "A container is a lightweight, standalone, executable package of software including code, runtime, system tools, and libraries. Containers share the host OS kernel while providing process-level isolation."
  },
  image: {
    title: "Docker Image",
    description: "A Docker image is a read-only, layered template containing instructions and filesystem snapshots to instantiate Docker containers. Built using Dockerfiles."
  },
  dockerfile: {
    title: "Dockerfile",
    description: "A text script containing sequential directives (FROM, WORKDIR, COPY, RUN, EXPOSE, CMD, ENTRYPOINT) used by the Docker daemon to assemble a container image."
  },
  compose: {
    title: "Docker Compose",
    description: "A tool for defining and orchestrating multi-container Docker applications via declarative docker-compose.yml files, configuring services, networks, and persistent storage volumes."
  },

  // Terraform & IaC
  terraform: {
    title: "Terraform",
    description: "Terraform is an open-source Infrastructure as Code (IaC) tool by HashiCorp. It provisions, updates, and versions cloud infrastructure declaratively using HashiCorp Configuration Language (HCL)."
  },
  state: {
    title: "Terraform State",
    description: "Terraform state tracks managed infrastructure metadata and resource bindings. It maps declared configuration to real-world cloud resources, prevents drift, and enables team concurrency via remote backend locking (e.g. AWS S3 + DynamoDB)."
  },
  iac: {
    title: "Infrastructure as Code (IaC)",
    description: "Infrastructure as Code is the practice of managing and provisioning computing infrastructure through version-controlled, machine-readable definition files rather than interactive configuration or manual human intervention."
  },
  immutable: {
    title: "Immutable Infrastructure",
    description: "An infrastructure paradigm where servers and compute nodes are never modified in place. Instead, any update, patch, or change results in building and deploying completely new instances and destroying the old ones."
  },

  // CI/CD & Delivery
  cicd: {
    title: "CI/CD (Continuous Integration & Continuous Delivery/Deployment)",
    description: "CI/CD is a software engineering practice. Continuous Integration automates code building, testing, and linting on every commit. Continuous Delivery/Deployment automates releasing validated artifacts to staging and production environments with zero downtime."
  },
  jenkins: {
    title: "Jenkins",
    description: "Jenkins is an open-source automation server supporting automated build, test, and deployment workflows through scripted or declarative pipelines (Jenkinsfiles) triggered by webhooks."
  },
  git: {
    title: "Git & Version Control",
    description: "Git is a distributed version control system that tracks revisions in source code, facilitating collaborative branching, pull requests, semantic tagging, and GitOps automated deployments."
  },

  // Cloud & AWS
  aws: {
    title: "Amazon Web Services (AWS)",
    description: "AWS is a cloud computing platform providing on-demand compute (EC2), scalable storage (S3), software-defined networking (VPC), identity & access management (IAM), load balancing (ALB), and observability (CloudWatch)."
  },
  ec2: {
    title: "Amazon EC2 (Elastic Compute Cloud)",
    description: "EC2 provides secure, resizable compute capacity in the cloud. It enables launching virtual machine instances with customizable CPU, memory, storage volumes, and security group firewall rules."
  },
  s3: {
    title: "Amazon S3 (Simple Storage Service)",
    description: "S3 is scalable object storage designed for 99.999999999% (11 9's) durability. Used for backup archives, static web assets, Docker artifacts, and Terraform remote state backends."
  },
  vpc: {
    title: "Amazon VPC (Virtual Private Cloud)",
    description: "Amazon VPC lets you launch AWS resources in a logically isolated virtual network that you define, including public/private subnets, Internet Gateways, NAT Gateways, route tables, and Network ACLs."
  },
  iam: {
    title: "AWS IAM (Identity & Access Management)",
    description: "IAM controls secure authentication and authorization across AWS services using least-privilege principles, IAM Users, Groups, Roles, Policies, and MFA."
  },
  loadbalancing: {
    title: "Load Balancing (ALB / ELB)",
    description: "Load balancing distributes incoming application traffic across multiple backend targets (EC2 instances, containers, IP addresses) in multiple Availability Zones to ensure high availability and fault tolerance."
  },
  servicediscovery: {
    title: "Service Discovery",
    description: "Service discovery enables microservices and containerized applications to automatically locate and communicate with each other dynamically over a network without hardcoded IP addresses."
  },

  // Observability & Security
  monitoring: {
    title: "Monitoring & Observability",
    description: "Monitoring tracks whether a system is running properly by collecting metrics. Observability allows understanding the internal state of systems through metrics (Prometheus), logs (Loki/ELK), and distributed traces (Jaeger)."
  },
  observability: {
    title: "Observability",
    description: "Observability is the ability to measure a system's internal state by examining its external outputs: Metrics (what is happening), Logs (why did it happen), and Traces (where did the request travel)."
  },
  prometheus: {
    title: "Prometheus",
    description: "An open-source systems monitoring and alerting toolkit featuring a multi-dimensional time-series data model, PromQL query language, and pull-based metrics scraping."
  },
  grafana: {
    title: "Grafana",
    description: "An open-source visualization and analytics platform used to build interactive, real-time telemetry dashboards from datasources like Prometheus, CloudWatch, and Elasticsearch."
  },
  devsecops: {
    title: "DevSecOps & Trivy",
    description: "DevSecOps integrates automated security practices throughout the software delivery lifecycle. Trivy scans container images, filesystems, and Git repositories for CVE vulnerabilities and misconfigurations."
  },
  linux: {
    title: "Linux & System Administration",
    description: "Linux is the cornerstone operating system for cloud servers and container runtimes. Key disciplines include Bash scripting, systemd service management, permissions, and network socket tuning."
  }
};

// =========================================================================
// 2. DevOps Comparisons
// =========================================================================
const COMPARISONS = {
  "docker vs kubernetes": `
<div style="font-weight: 600; color: #38bdf8; margin-bottom: 0.3rem;">Docker vs Kubernetes:</div>
Docker is a <strong>containerization platform</strong> used to package and run individual containers on a host.
Kubernetes is a <strong>container orchestration platform</strong> used to manage, scale, network, and automate clusters containing thousands of Docker containers across multiple servers.
<em>Summary: Docker builds and runs the containers; Kubernetes orchestrates and scales them.</em>
`,
  "jenkins vs github actions": `
<div style="font-weight: 600; color: #38bdf8; margin-bottom: 0.3rem;">Jenkins vs GitHub Actions:</div>
<strong>Jenkins:</strong> Self-hosted, highly extensible automation server with 1,800+ plugins, requiring dedicated server maintenance and configuration.
<strong>GitHub Actions:</strong> Cloud-native, fully managed CI/CD built directly into GitHub repositories with declarative YAML workflows and marketplace actions.
`,
  "terraform vs ansible": `
<div style="font-weight: 600; color: #38bdf8; margin-bottom: 0.3rem;">Terraform vs Ansible:</div>
<strong>Terraform:</strong> Declarative Infrastructure as Code (IaC) optimized for <em>provisioning</em> cloud infrastructure (VPCs, EC2, S3, Kubernetes clusters).
<strong>Ansible:</strong> Configuration management and automation tool optimized for <em>configuring</em> operating systems, installing software, and managing server state via SSH.
`,
  "prometheus vs grafana": `
<div style="font-weight: 600; color: #38bdf8; margin-bottom: 0.3rem;">Prometheus vs Grafana:</div>
<strong>Prometheus:</strong> Scrapes, aggregates, stores, and evaluates time-series metrics using PromQL and triggers alerts.
<strong>Grafana:</strong> The visualization dashboard layer that connects to Prometheus (and other data stores) to display rich, real-time graphical dashboards.
`,
  "docker image vs container": `
<div style="font-weight: 600; color: #38bdf8; margin-bottom: 0.3rem;">Docker Image vs Container:</div>
<strong>Docker Image:</strong> A read-only, immutable blueprint/template containing the application code, libraries, and runtime dependencies.
<strong>Container:</strong> A live, runnable, stateful instance of a Docker image with an active process and an isolated writable filesystem layer.
`,
  "ci vs cd": `
<div style="font-weight: 600; color: #38bdf8; margin-bottom: 0.3rem;">Continuous Integration (CI) vs Continuous Delivery/Deployment (CD):</div>
<strong>CI (Continuous Integration):</strong> Developers frequently commit code to a shared repository; every commit is automatically built, linted, and tested.
<strong>CD (Continuous Delivery):</strong> Code that passes CI is automatically prepared and packaged for a release to staging/production.
<strong>CD (Continuous Deployment):</strong> Every validated change is automatically released to live production environments with zero human intervention.
`,
  "continuous delivery vs continuous deployment": `
<div style="font-weight: 600; color: #38bdf8; margin-bottom: 0.3rem;">Continuous Delivery vs Continuous Deployment:</div>
<strong>Continuous Delivery:</strong> Code changes are automatically built, tested, and packaged into a deployable artifact, but deployment to production requires manual sign-off/approval.
<strong>Continuous Deployment:</strong> Every change passing the automated test pipeline is immediately deployed directly into production without manual gates.
`,
  "ec2 vs docker": `
<div style="font-weight: 600; color: #38bdf8; margin-bottom: 0.3rem;">Amazon EC2 vs Docker:</div>
<strong>Amazon EC2:</strong> Provides full virtual machines (VMs) with dedicated virtual hardware and guest OS running on cloud hypervisors.
<strong>Docker:</strong> Operates at the OS level; containers share the host Linux kernel, booting in milliseconds with minimal CPU/memory overhead.
`,
  "vm vs container": `
<div style="font-weight: 600; color: #38bdf8; margin-bottom: 0.3rem;">Virtual Machines (VM) vs Containers:</div>
<strong>Virtual Machine:</strong> Includes a full guest OS, virtual drivers, and virtual memory managed by a Hypervisor. Slower startup, larger footprint (GBs).
<strong>Container:</strong> Shares the host OS kernel and isolates processes using Linux namespaces and cgroups. Starts instantly with lightweight footprint (MBs).
`
};

// =========================================================================
// 3. DevOps CLI Command Explanations & Simulated Outputs
// =========================================================================
const COMMAND_EXPLANATIONS = {
  "docker ps": {
    cmd: "docker ps",
    desc: "Lists currently running Docker containers.",
    simulation: `
CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS         PORTS                    NAMES
8f9a2b1c4e7d   abhishek/portfolio    "node server.js"         2 hours ago     Up 2 hours     0.0.0.0:8080->80/tcp     portfolio-web
5a3d7e8b9c0f   prom/prometheus       "/bin/prometheus --c…"   5 hours ago     Up 5 hours     0.0.0.0:9090->9090/tcp   prometheus-agent
`
  },
  "docker images": {
    cmd: "docker images",
    desc: "Lists Docker images available locally.",
    simulation: `
REPOSITORY                       TAG       IMAGE ID       CREATED        SIZE
abhishek/portfolio-web           latest    a1b2c3d4e5f6   2 hours ago    142MB
abhishek/enterprise-ci-cd-demo   v2.4      f7e6d5c4b3a2   3 days ago     210MB
nginx                            alpine    9b8a7c6d5e4f   2 weeks ago    23.5MB
`
  },
  "docker build -t myapp .": {
    cmd: "docker build -t myapp .",
    desc: "Builds a Docker image using the Dockerfile in the current directory and assigns the tag 'myapp'."
  },
  "docker run -p 8080:80 myapp": {
    cmd: "docker run -p 8080:80 myapp",
    desc: "Runs the myapp container and maps host port 8080 to container port 80."
  },
  "kubectl get pods": {
    cmd: "kubectl get pods",
    desc: "Lists Pods in the current Kubernetes namespace.",
    simulation: `
NAME                             READY   STATUS    RESTARTS   AGE
portfolio-api-7b8f9c-2x9la       1/1     Running   0          4d12h
frontend-deploy-5c7d8-pl98q      1/1     Running   0          4d12h
monitoring-prometheus-server-0   1/1     Running   0          18d
ingress-nginx-controller-m8z91   1/1     Running   0          25d
`
  },
  "kubectl get pods -a": {
    cmd: "kubectl get pods -A",
    desc: "Lists Pods across all namespaces in the Kubernetes cluster (including kube-system).",
    simulation: `
NAMESPACE     NAME                               READY   STATUS    RESTARTS   AGE
kube-system   coredns-78fcd69978-4j9q2           1/1     Running   0          30d
kube-system   etcd-control-plane                 1/1     Running   0          30d
kube-system   kube-apiserver-control-plane       1/1     Running   0          30d
default       portfolio-api-7b8f9c-2x9la         1/1     Running   0          4d
`
  },
  "kubectl apply -f deployment.yaml": {
    cmd: "kubectl apply -f deployment.yaml",
    desc: "Creates or updates Kubernetes resources defined in deployment.yaml."
  },
  "kubectl describe pod": {
    cmd: "kubectl describe pod <pod-name>",
    desc: "Displays detailed information about a Kubernetes Pod, including events, container state, volumes, and IP assignments."
  },
  "terraform init": {
    cmd: "terraform init",
    desc: "Initializes a Terraform working directory and downloads required providers and modules."
  },
  "terraform plan": {
    cmd: "terraform plan",
    desc: "Shows the infrastructure changes Terraform intends to make by comparing current state with desired configuration."
  },
  "terraform apply": {
    cmd: "terraform apply",
    desc: "Applies the Terraform configuration to provision or modify managed infrastructure."
  },
  "git status": {
    cmd: "git status",
    desc: "Shows modified, staged, and untracked files in the Git working tree."
  },
  "git add .": {
    cmd: "git add .",
    desc: "Stages all changes in the current repository."
  },
  "git commit -m \"message\"": {
    cmd: "git commit -m \"message\"",
    desc: "Creates a Git commit containing staged changes."
  },
  "git push": {
    cmd: "git push",
    desc: "Pushes local commits to the configured remote repository."
  }
};

// =========================================================================
// 4. DevOps Interactive Terminal Controller Class
// =========================================================================
export class DevOpsTerminal {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.outputBody = this.container.querySelector('#terminal-stream-content');
    this.inputField = this.container.querySelector('#terminal-cli-input');
    this.runBtn = this.container.querySelector('#terminal-cli-run-btn');
    this.clearBtn = this.container.querySelector('#terminal-clear-btn');
    this.suggestionsContainer = document.getElementById('terminal-suggestions');

    this.history = [];
    this.historyIndex = -1;
    this.isProcessing = false;
    this.chatHistory = []; // Conversational memory for multi-turn AI chat

    this.init();
  }

  init() {
    // 1. Initial greeting banner
    this.showInitialBanner();

    // 2. Input key listener (Enter and Arrow Up/Down history)
    if (this.inputField) {
      this.inputField.addEventListener('keydown', (e) => this.handleKeyDown(e));

      // Container click focuses input (unless clicking a button)
      this.container.addEventListener('click', (e) => {
        if (!e.target.closest('button') && this.inputField) {
          this.inputField.focus();
        }
      });
    }

    // 3. Execute Run Button event listener
    if (this.runBtn) {
      this.runBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.submitCommand();
      });
    }

    // 4. Clear Button in terminal header
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.clearTerminal();
      });
    }

    // 5. Suggested questions click handler
    if (this.suggestionsContainer) {
      this.suggestionsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.suggestion-chip');
        if (btn) {
          e.preventDefault();
          const query = btn.dataset.query || btn.textContent.trim();
          this.executeSuggestedQuery(query);
        }
      });
    }
  }

  showInitialBanner() {
    if (!this.outputBody) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    this.outputBody.innerHTML = `
      <div class="term-line term-output" style="color: #64748b;">[${timeStr}] SYSTEM: Initializing Abhishek Saini DevOps AI Cloud Console...</div>
      <div class="term-line term-success">✓ ChatGPT for DevOps Intelligence Engine ONLINE</div>
      <div class="term-line term-output">Hello! 👋 Welcome to Abhishek's interactive DevOps terminal. I can answer any technical DevOps question, write production configs, troubleshoot incidents, and analyze architectures. Type <span class="term-highlight">help</span> for examples or start asking!</div>
    `;
    this.scrollToBottom();
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.submitCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0) {
        if (this.historyIndex === -1) {
          this.historyIndex = this.history.length - 1;
        } else if (this.historyIndex > 0) {
          this.historyIndex--;
        }
        if (this.inputField) {
          this.inputField.value = this.history[this.historyIndex] || '';
          // Move cursor to end of input
          const len = this.inputField.value.length;
          this.inputField.setSelectionRange(len, len);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex !== -1) {
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          if (this.inputField) {
            this.inputField.value = this.history[this.historyIndex] || '';
            const len = this.inputField.value.length;
            this.inputField.setSelectionRange(len, len);
          }
        } else {
          this.historyIndex = -1;
          if (this.inputField) this.inputField.value = '';
        }
      }
    }
  }

  async submitCommand() {
    if (!this.inputField) return;
    const rawInput = this.inputField.value;
    const trimmed = rawInput.trim();

    // Section 5: Empty input handling
    if (!trimmed) {
      this.renderEmptyNotice();
      if (this.inputField) {
        this.inputField.value = '';
        this.inputField.focus();
      }
      return;
    }

    // Debounce / double-execution prevention
    if (this.isProcessing) return;
    this.isProcessing = true;

    // Push into command history
    this.history.push(trimmed);
    this.historyIndex = -1;

    // Clear input field immediately
    this.inputField.value = '';

    // Execute
    try {
      await this.executeCommand(trimmed);
    } catch (err) {
      console.error('Terminal execution error:', err);
      this.renderErrorNotice();
    } finally {
      this.isProcessing = false;
      if (this.inputField) this.inputField.focus();
    }
  }

  executeSuggestedQuery(query) {
    if (!query) return;
    if (this.inputField) {
      this.inputField.value = query;
    }
    // Small timeout ensures visual typing feedback before execution
    setTimeout(() => {
      this.submitCommand();
    }, 40);
  }

  renderEmptyNotice() {
    if (!this.outputBody) return;
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'term-line term-output';
    emptyDiv.style.color = '#64748b';
    emptyDiv.innerHTML = `<span style="color: var(--neon-cyan); opacity: 0.8;">abhishek@cloud-orchestrator:~$</span><br /><span style="color: #94a3b8;">[system] Type a command or question. Try <span class="term-highlight">help</span>.</span>`;
    this.outputBody.appendChild(emptyDiv);
    this.scrollToBottom();
  }

  renderErrorNotice() {
    if (!this.outputBody) return;
    const errDiv = document.createElement('div');
    errDiv.className = 'term-line term-output';
    errDiv.style.color = '#f87171';
    errDiv.textContent = `[system] Unable to process that request.`;
    this.outputBody.appendChild(errDiv);
    this.scrollToBottom();
  }

  clearTerminal() {
    if (!this.outputBody) return;
    this.safePlaySound();
    this.outputBody.innerHTML = `
      <div class="term-line" style="color: var(--neon-cyan); opacity: 0.8;">abhishek@cloud-orchestrator:~$</div>
    `;
    this.scrollToBottom();
    if (this.inputField) this.inputField.focus();
  }

  scrollToBottom() {
    if (this.outputBody) {
      this.outputBody.scrollTop = this.outputBody.scrollHeight;
    }
  }

  safePlaySound() {
    try {
      if (sound && typeof sound.playClick === 'function') {
        sound.playClick();
      }
    } catch (e) {
      // Audio errors must never interrupt execution
    }
  }

  async executeCommand(commandText) {
    this.safePlaySound();

    // 1. Append user command to history output
    const cmdDiv = document.createElement('div');
    cmdDiv.className = 'term-line term-cmd';
    cmdDiv.innerHTML = `<span style="color: var(--neon-cyan); opacity: 0.8;">abhishek@cloud-orchestrator:~$</span> ${this.escapeHTML(commandText)}`;
    this.outputBody.appendChild(cmdDiv);
    this.scrollToBottom();

    // Check for clear command
    const normalized = commandText.toLowerCase().trim();
    if (normalized === 'clear' || normalized === 'cls') {
      this.clearTerminal();
      return;
    }

    // Check for status command
    if (normalized === 'status') {
      const resDiv = document.createElement('div');
      resDiv.className = 'term-line term-output';
      resDiv.style.margin = '0.35rem 0 0.75rem 0';
      resDiv.innerHTML = this.formatStatusOutput();
      this.outputBody.appendChild(resDiv);
      this.scrollToBottom();
      return;
    }

    // 2. Display Cyberpunk AI Loading Indicator
    const loaderId = `term-loader-${Date.now()}`;
    const loaderDiv = document.createElement('div');
    loaderDiv.id = loaderId;
    loaderDiv.className = 'term-line';
    loaderDiv.style.color = 'var(--neon-cyan)';
    loaderDiv.style.margin = '0.35rem 0';
    loaderDiv.innerHTML = `
      <span class="hud-pulse" style="margin-right: 0.4rem;"></span>
      <span>[AI ASSISTANT] Analyzing DevOps query...</span>
      <span class="term-cursor"></span>
    `;
    this.outputBody.appendChild(loaderDiv);
    this.scrollToBottom();

    // Temporarily update run button text
    if (this.runBtn) {
      this.runBtn.disabled = true;
      this.runBtn.innerHTML = `<span>Thinking...</span>`;
    }

    let finalHTML = '';
    let aiSucceeded = false;

    // 3. Connect to Backend /api/chat
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: commandText,
          history: this.chatHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.reply) {
          aiSucceeded = true;
          const providerBadge = data.provider
            ? `⚡ Senior DevOps AI (${data.provider})`
            : '⚡ Senior DevOps AI';

          finalHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.45rem;">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #34d399; background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); padding: 0.15rem 0.55rem; border-radius: 4px;">
                ${providerBadge}
              </span>
            </div>
            ${renderMarkdownToHTML(data.reply)}
          `;

          // Maintain conversational context memory
          this.chatHistory.push({ role: 'user', content: commandText });
          this.chatHistory.push({ role: 'assistant', content: data.reply });
          if (this.chatHistory.length > 10) {
            this.chatHistory = this.chatHistory.slice(-10);
          }
        }
      }
    } catch (fetchErr) {
      console.warn('DevOps AI Backend unreachable, engaging local engine fallback:', fetchErr);
    }

    // 4. Fallback to Local Senior DevOps Knowledge Engine if AI was offline or no key
    if (!aiSucceeded) {
      const localResult = this.parseQuery(commandText);
      finalHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.45rem;">
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #38bdf8; background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.3); padding: 0.15rem 0.55rem; border-radius: 4px;">
            ⚡ Local DevOps Knowledge Engine (Offline Mode)
          </span>
        </div>
        ${localResult}
      `;
    }

    // 5. Remove Loader & Render Output
    const activeLoader = document.getElementById(loaderId);
    if (activeLoader && activeLoader.parentNode) {
      activeLoader.parentNode.removeChild(activeLoader);
    }

    const resDiv = document.createElement('div');
    resDiv.className = 'term-line term-output';
    resDiv.style.margin = '0.35rem 0 0.85rem 0';
    resDiv.innerHTML = finalHTML;
    this.outputBody.appendChild(resDiv);

    // Restore Execute button
    if (this.runBtn) {
      this.runBtn.disabled = false;
      this.runBtn.innerHTML = `
        <span>Execute</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      `;
    }

    this.scrollToBottom();
  }

  escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 5. Intelligent Senior DevOps Query Parser & Knowledge Matcher
  // =========================================================================
  parseQuery(rawQuery) {
    const original = rawQuery.trim();
    const q = original.toLowerCase().replace(/[?!.,;:`"']/g, '').replace(/\s+/g, ' ').trim();
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    // Status Command
    if (q === 'status') {
      return this.formatStatusOutput();
    }

    // Greetings
    const greetings = ['hi', 'hello', 'hey', 'hii', 'hiii', 'hy', 'namaste', 'hola', 'greetings'];
    if (greetings.includes(q)) {
      return `
        <div style="line-height: 1.5;">
          <div style="color: #64748b; font-size: 0.8rem; margin-bottom: 0.2rem;">[${timeStr}] SYSTEM</div>
          <div style="color: #38bdf8; font-weight: 600; margin-bottom: 0.3rem;">Hello! 👋</div>
          <div style="color: #e2e8f0; margin-bottom: 0.5rem;">I am Abhishek's Senior DevOps Engineer & Cloud Knowledge Assistant.</div>
          <div style="color: #94a3b8; font-size: 0.85rem;">
            Ask me anything about:<br />
            &bull; <strong>Production Troubleshooting:</strong> <em>"502 bad gateway"</em>, <em>"crashloopbackoff"</em>, <em>"oomkilled"</em>, <em>"cpu 100%"</em><br />
            &bull; <strong>Cloud Architecture:</strong> <em>"aws 3 tier architecture"</em>, <em>"devsecops pipeline"</em>, <em>"k8s topology"</em><br />
            &bull; <strong>Technical Comparisons:</strong> <em>"docker vs kubernetes"</em>, <em>"rebase vs merge"</em>, <em>"vm vs container"</em><br />
            &bull; <strong>Interview Simulator:</strong> <em>"interview"</em>, <em>"interview k8s"</em>, <em>"interview aws"</em><br />
            &bull; <strong>Abhishek's Profile:</strong> <em>"skills"</em>, <em>"projects"</em>, <em>"experience"</em>, <em>"certifications"</em>
          </div>
          <div style="margin-top: 0.5rem; color: #c084fc;">Try typing: <span class="term-highlight">help</span> or <span class="term-highlight">troubleshoot</span></div>
        </div>
      `;
    }

    // Process via unified Senior DevOps Knowledge Engine
    try {
      const result = processDevOpsQuery(rawQuery);
      if (result && result.text) {
        return renderMarkdownToHTML(result.text);
      }
    } catch (err) {
      console.warn('DevOps Engine processing fallback:', err);
    }

    // Fallback if not handled
    return `
      <div style="line-height: 1.5;">
        <div style="color: #f59e0b; font-weight: 600; margin-bottom: 0.2rem;">[DEVOPS TERMINAL]</div>
        <div style="color: #e2e8f0; margin-bottom: 0.4rem;">
          I'm optimized for DevOps, Cloud, Troubleshooting, Architecture, and Abhishek's portfolio.
        </div>
        <div style="color: #94a3b8; font-size: 0.82rem;">
          Try typing <span class="term-highlight">help</span> or ask about:<br />
          &gt; crashloopbackoff<br />
          &gt; 502 bad gateway<br />
          &gt; docker vs kubernetes<br />
          &gt; aws architecture<br />
          &gt; interview
        </div>
      </div>
    `;
  }

  formatConceptResponse(concept) {
    if (!concept) return '';
    return `
      <div style="line-height: 1.5;">
        <div style="color: #38bdf8; font-weight: 600; margin-bottom: 0.2rem;">${concept.title}:</div>
        <div style="color: #e2e8f0;">${concept.description}</div>
        ${concept.details ? `<div style="color: #94a3b8; font-size: 0.82rem; margin-top: 0.35rem;">${concept.details}</div>` : ''}
      </div>
    `;
  }

  formatStatusOutput() {
    return `
      <div style="font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.5;">
        <div style="color: var(--neon-cyan); font-weight: 600; margin-bottom: 0.2rem;">SYSTEM STATUS</div>
        <div style="color: #64748b; margin-bottom: 0.4rem;">────────────────────────────────────────</div>
        <div><span style="color:#34d399;">✓</span> DevOps AI Endpoint ..... <span style="color:#38bdf8;">ACTIVE (/api/chat)</span></div>
        <div><span style="color:#34d399;">✓</span> Local Knowledge Engine .. <span style="color:#38bdf8;">READY (Fallback)</span></div>
        <div><span style="color:#34d399;">✓</span> 3D Architecture Stage .. <span style="color:#38bdf8;">ONLINE</span></div>
        <div><span style="color:#34d399;">✓</span> Conversational Memory .. <span style="color:#34d399;">READY</span></div>
        <br />
        <div style="color: #c084fc; font-weight: 600;">ChatGPT for DevOps Capabilities:</div>
        <div style="color: #94a3b8; font-size: 0.78rem;">Ask any custom DevOps question, generate production YAML/Dockerfiles, review scripts, troubleshoot CrashLoopBackOff/502 errors, or simulate interviews.</div>
      </div>
    `;
  }
}

export function initInteractiveTerminal() {
  const terminal = new DevOpsTerminal('devops-interactive-terminal');
  return terminal;
}
