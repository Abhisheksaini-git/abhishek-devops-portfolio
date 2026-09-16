export const portfolioData = {
  personal: {
    name: "Abhishek Saini",
    title: "DevOps Engineer | Cloud & DevOps Enthusiast",
    subtitle: "B.Tech Computer Science | SRE & Cloud Automation",
    tagline: "Building scalable cloud infrastructure, automated CI/CD pipelines, and reliable DevOps solutions.",
    bio: "B.Tech CS student & passionate DevOps Engineer based in India. Specialized in architecting scalable cloud infrastructure with AWS, building resilient CI/CD pipelines (Jenkins, GitHub Actions), declarative Infrastructure as Code (Terraform), container orchestration (Docker, Kubernetes), DevSecOps vulnerability scanning (Trivy), and comprehensive Linux system administration.",
    location: "India",
    status: "Open for DevOps & Cloud Engineering Roles",
    email: "abhishek.sainiii@outlook.com",
    altEmail: "abhisheksaini.devops@gmail.com",
    resumeUrl: "#resume-modal",
    stats: [
      { label: "Cloud Platforms & Tools", value: "15+" },
      { label: "CI/CD Pipeline Success", value: "100%" },
      { label: "Active Repositories", value: "4+" },
      { label: "Container Orchestration", value: "Docker / K8s" }
    ]
  },
  socials: {
    linkedin: "https://www.linkedin.com/in/abhisheksaini-devops/",
    github: "https://github.com/Abhisheksaini-git",
    x: "https://x.com/AbhishekSa74719",
    twitter: "https://x.com/AbhishekSa74719",
    xHandle: "@AbhishekSa74719",
    instagram: "https://www.instagram.com/abhisheksaiini/",
    email: "mailto:abhishek.sainiii@outlook.com"
  },
  skills: {
    devopsCloud: [
      { name: "Docker", icon: "box", level: "Expert", desc: "Multi-stage builds, Alpine base optimization, Compose networking" },
      { name: "Kubernetes", icon: "boxes", level: "Advanced", desc: "Deployments, Services, Cluster orchestration, Kubeconfig management" },
      { name: "Jenkins", icon: "play-circle", level: "Advanced", desc: "Declarative Jenkinsfiles, Webhooks, Multi-stage automated pipelines" },
      { name: "Terraform", icon: "layers", level: "Advanced", desc: "Infrastructure as Code (IaC), Declarative cloud provisioning" },
      { name: "CI / CD Pipelines", icon: "repeat", level: "Expert", desc: "GitHub Actions & Jenkins automation, Automated testing & delivery" },
      { name: "DevSecOps (Trivy)", icon: "shield", level: "Advanced", desc: "Filesystem & container image vulnerability scanning in CI/CD" },
      { name: "Linux (Ubuntu)", icon: "terminal", level: "Expert", desc: "Shell scripting, Systemd, Process tuning, Permissions & Networking" },
      { name: "Git & GitHub", icon: "git-branch", level: "Expert", desc: "Branching workflows, GitOps, Pull Request automation" },
      { name: "Ansible", icon: "settings", level: "Intermediate", desc: "Playbooks, Automated configuration & server state management" },
      { name: "Prometheus & Grafana", icon: "activity", level: "Intermediate", desc: "Metrics harvesting, Alertmanager rules, Observability dashboards" },
      { name: "Networking", icon: "wifi", level: "Advanced", desc: "TCP/IP, DNS, HTTP/HTTPS, Reverse Proxies, Load Balancing" }
    ],
    awsServices: [
      { name: "Amazon EC2", category: "Compute", desc: "Virtual compute instances, Security groups, Key pairs, User-data automation" },
      { name: "Amazon VPC", category: "Networking", desc: "Custom CIDR, Public/Private subnets, Internet Gateways, Route tables" },
      { name: "AWS IAM", category: "Security", desc: "Least-privilege policies, Roles, MFA enforcement, User credentials" },
      { name: "Amazon S3", category: "Storage", desc: "Object storage, Versioning, Lifecycle policies, Static hosting" },
      { name: "Elastic Load Balancer (ELB/ALB)", category: "Traffic", desc: "Application Load Balancing, Path routing, Health checks" },
      { name: "Auto Scaling Groups (ASG)", category: "Scalability", desc: "Dynamic scaling policies, Launch templates, Self-healing compute" },
      { name: "Amazon CloudWatch", category: "Monitoring", desc: "Metrics logging, Alarms, Real-time infrastructure telemetry" }
    ],
    frontend3D: [
      { name: "Three.js", category: "3D WebGL", desc: "Interactive 3D scenes, Dynamic shaders, Particle cloud constellations" },
      { name: "React.js", category: "Frontend", desc: "Component architecture, State management, 3-Tier application frontend" },
      { name: "JavaScript (ES6+)", category: "Language", desc: "Async/await, Modular development, DOM APIs, Canvas animation" },
      { name: "HTML5 & CSS3", category: "Core Web", desc: "Semantic markup, Glassmorphism, CSS Grid, Responsive design" },
      { name: "Tailwind CSS", category: "Styling", desc: "Utility-first modern interface layouts & design systems" },
      { name: "Python", category: "Scripting", desc: "Automation scripts, CLI tooling, System utilities" }
    ]
  },
  projects: [
    {
      id: "enterprise-ci-cd",
      title: "Enterprise End-to-End CI/CD Pipeline",
      subtitle: "Java Spring Boot • Jenkins • Trivy Security • Docker • Kubernetes",
      description: "Industry-standard automated software delivery pipeline. Whenever new code is pushed to GitHub, webhooks trigger a multi-stage Jenkins pipeline that performs Maven builds, runs unit tests, scans filesystem and container images with Trivy for vulnerabilities, builds and pushes Docker images, and executes rolling zero-downtime deployments to a Kubernetes cluster.",
      tags: ["Jenkins", "Kubernetes", "Docker", "Trivy DevSecOps", "Maven", "Java", "GitHub Webhooks"],
      highlights: [
        "Automated GitHub Webhook trigger on code push / PRs",
        "DevSecOps Integration: Trivy filesystem & image security scanning",
        "Zero-downtime rolling update deployment onto Kubernetes cluster via Kubeconfig"
      ],
      github: "https://github.com/Abhisheksaini-git/Enterprise-ci-cd-pipeline-jenkins-docker-kubernetes",
      demo: "https://github.com/Abhisheksaini-git/Enterprise-ci-cd-pipeline-jenkins-docker-kubernetes",
      featured: true,
      badge: "Flagship DevSecOps",
      architectureType: "k8s"
    },
    {
      id: "three-tier-app",
      title: "3-Tier Application Deployment",
      subtitle: "Docker Compose • React.js • Node.js • Express • MySQL",
      description: "Production-style multi-container architecture isolating the client-facing React frontend, Node.js/Express backend API, and persistent MySQL database layer. Features custom Docker bridge networks, environment variable injection, database auto-initialization via SQL scripts, and persistent Docker volume mounts.",
      tags: ["Docker", "Docker Compose", "React", "Node.js", "MySQL", "Networking"],
      highlights: [
        "Network Isolation: Frontend cannot directly connect to MySQL DB layer",
        "Persistent Docker volumes ensuring complete database durability across restarts",
        "One-command cluster orchestration via 'docker compose up -d'"
      ],
      github: "https://github.com/Abhisheksaini-git/3tier-docker-compose-app",
      demo: "https://github.com/Abhisheksaini-git/3tier-docker-compose-app",
      featured: true,
      badge: "Container Orchestration",
      architectureType: "compose"
    },
    {
      id: "docker-nginx",
      title: "Dockerized Nginx Web Application",
      subtitle: "Docker • Nginx • Alpine Linux • Reverse Proxy",
      description: "Lightweight, highly optimized containerized web application demonstrating Docker image creation, container lifecycle management, port forwarding, custom Nginx server configuration, and Alpine Linux minimal base image footprint.",
      tags: ["Docker", "Nginx", "Linux", "Alpine", "Web Server"],
      highlights: [
        "Minimal Alpine base image minimizing attack surface and image size",
        "Custom Nginx web server routing, static asset serving and caching",
        "Docker container management, volume mounting and port forwarding"
      ],
      github: "https://github.com/Abhisheksaini-git/docker-nginx-project",
      demo: "https://github.com/Abhisheksaini-git/docker-nginx-project",
      featured: true,
      badge: "Lightweight Web Service",
      architectureType: "docker"
    },
    {
      id: "cloud-iac-aws",
      title: "Cloud Infrastructure as Code (IaC)",
      subtitle: "Terraform • AWS Multi-AZ High Availability Architecture",
      description: "Declarative Infrastructure as Code defining an enterprise AWS VPC architecture across multiple availability zones. Features public and private subnets, NAT Gateways, EC2 Auto Scaling groups behind an Application Load Balancer (ALB), and automated CloudWatch alarms.",
      tags: ["Terraform", "AWS VPC", "EC2", "ALB", "Auto Scaling", "IAM", "CloudWatch"],
      highlights: [
        "Zero configuration drift via declarative Terraform HCL code",
        "Multi-AZ redundancy with automatic failover and load balancing",
        "IAM least-privilege security controls and S3 remote state storage"
      ],
      github: "https://github.com/Abhisheksaini-git",
      demo: "https://github.com/Abhisheksaini-git",
      featured: true,
      badge: "Cloud Infrastructure",
      architectureType: "terraform"
    }
  ],
  terminalLogs: [
    { type: "info", text: "Connecting to Abhishek Saini's Cloud Infrastructure..." },
    { type: "command", text: "$ git clone https://github.com/Abhisheksaini-git/Enterprise-ci-cd-pipeline-jenkins-docker-kubernetes" },
    { type: "output", text: "Cloning into 'Enterprise-ci-cd-pipeline'..." },
    { type: "command", text: "$ trivy fs --severity HIGH,CRITICAL ." },
    { type: "success", text: "✓ Trivy Vulnerability Scan Passed: 0 High / 0 Critical vulnerabilities detected" },
    { type: "command", text: "$ docker compose -f 3tier-docker-compose-app/docker-compose.yml up -d" },
    { type: "output", text: "[+] Running 3/3: Container react-frontend Started, Container node-api Started, Container mysql-db Started" },
    { type: "command", text: "$ kubectl apply -f kubernetes/deployment.yaml" },
    { type: "success", text: "✓ Deployment 'enterprise-app' created | 3/3 Pods Ready | Zero-Downtime Rollout Complete" },
    { type: "highlight", text: "STATUS: Abhishek Saini's DevOps Systems ONLINE & 100% HEALTHY" }
  ]
};
