/**
 * DevSecOps & Security Hardening Knowledge Module
 */

export const DEVSECOPS_TOPICS = {
  shift_left: {
    patterns: [
      'what is devsecops', 'shift-left security', 'shift left', 'devsecops meaning',
      'devsecops definition'
    ],
    title: "DevSecOps: Shift-Left Security Principles",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[DEVSECOPS] The "Shift-Left" Security Philosophy:</div>
  <p>Traditionally, security audits happened at the very end of the release cycle, creating release bottlenecks and expensive emergency patches. <strong>DevSecOps embeds security checks into every phase of development:</strong></p>

  <ul style="margin-left: 1.2rem; font-size: 0.84rem; color: #cbd5e1;">
    <li><strong>Code (Pre-Commit):</strong> Local Git hooks scan for hardcoded secrets, API keys, and syntax errors (Gitleaks, TruffleHog).</li>
    <li><strong>Build (SAST & SCA):</strong> SonarQube analyzes source code for SQLi/XSS; Trivy/Snyk checks dependencies for known CVEs.</li>
    <li><strong>Package (Container Scanning):</strong> Trivy scans Docker container base images and filesystem binaries for vulnerabilities.</li>
    <li><strong>Deploy (Policy as Code):</strong> Kyverno or OPA Gatekeeper blocks root containers and enforces strict resource limits.</li>
    <li><strong>Runtime (DAST & Observability):</strong> Falco monitors kernel system calls in real-time to detect anomalous container activity.</li>
  </ul>
</div>
`
  },

  secure_kubernetes: {
    patterns: [
      'how do i secure a kubernetes cluster', 'secure kubernetes', 'k8s security hardening',
      'kubernetes security best practices'
    ],
    title: "Enterprise Kubernetes Security Hardening Checklist",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[K8s HARDENING] Securing Production Kubernetes Clusters:</div>
  
  <ol style="margin-left: 1.2rem; font-size: 0.84rem; color: #cbd5e1;">
    <li><strong>Non-Root Containers (SecurityContext):</strong> Mandate <code>runAsNonRoot: true</code>, <code>readOnlyRootFilesystem: true</code>, and drop all Linux capabilities (<code>drop: ["ALL"]</code>).</li>
    <li><strong>NetworkPolicies:</strong> Kubernetes defaults to open, flat networking where any Pod can talk to any Pod. Implement default-deny NetworkPolicies and whitelist only required microservice traffic.</li>
    <li><strong>Strict RBAC:</strong> Grant least-privilege permissions. Never bind <code>cluster-admin</code> to application ServiceAccounts.</li>
    <li><strong>Private Control Plane & Nodes:</strong> Keep the kube-apiserver endpoint private and restrict API access to trusted CIDR blocks/VPNs.</li>
    <li><strong>etcd Encryption at Rest:</strong> Enable <code>EncryptionConfiguration</code> for Kubernetes Secrets in etcd with KMS keys.</li>
    <li><strong>Runtime Intrusion Detection:</strong> Deploy Falco on worker nodes to monitor anomalous shell spawns (e.g. <code>exec bash</code> inside a container).</li>
  </ol>
</div>
`
  },

  scan_docker_images: {
    patterns: [
      'how do i scan docker images', 'scan docker images', 'trivy scan',
      'vulnerability scanning', 'image scanning'
    ],
    title: "Automated Container Image Vulnerability Scanning (Trivy)",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[CONTAINER SECURITY] Scanning Images with Trivy in CI/CD:</div>
  <p>Trivy scans container images for OS package vulnerabilities (Debian, Alpine) and application dependencies (npm, pip, Maven).</p>

  <div style="margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #030712; border-left: 3px solid #ef4444; font-family: monospace; font-size: 0.8rem; color: #34d399;">
    # CI/CD Gate: Fail build if CRITICAL or HIGH vulnerabilities exist<br />
    trivy image --exit-code 1 --severity CRITICAL,HIGH --ignore-unfixed myapp:v1.2<br /><br />
    # Generate Software Bill of Materials (SBOM) in CycloneDX format<br />
    trivy image --format cyclonedx --output sbom.json myapp:v1.2
  </div>

  <div style="color: #cbd5e1; font-size: 0.82rem;">
    The <code>--ignore-unfixed</code> flag ensures you don't break developer builds for CVEs that have no vendor patch available yet.
  </div>
</div>
`
  },

  prevent_secrets_git: {
    patterns: [
      'prevent secrets from entering git', 'prevent secrets git', 'secrets in git',
      'gitleaks', 'pre commit secrets', 'accidental commit api key'
    ],
    title: "Preventing Secret Leaks in Git Repositories",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[SECRETS DEFENSE] 3-Layer Protection Against Leaking Secrets:</div>
  
  <div style="color: #cbd5e1; font-size: 0.84rem;">
    1. <strong>Layer 1 (Pre-Commit Hooks on Laptop):</strong> Install <code>pre-commit</code> with Gitleaks or TruffleHog. Scans regex patterns and Shannon entropy before allowing a commit to be created.<br />
    2. <strong>Layer 2 (GitHub Secret Scanning / Push Protection):</strong> GitHub actively scans incoming pushes and blocks commits containing known API keys (AWS, Stripe, OpenAI).<br />
    3. <strong>Layer 3 (Centralized Secret Stores):</strong> Never store secrets in config files. Pull secrets dynamically at runtime using <strong>AWS Secrets Manager</strong>, <strong>HashiCorp Vault</strong>, or Kubernetes External Secrets Operator (ESO).
  </div>

  <div style="color: #ef4444; font-size: 0.8rem; margin-top: 0.4rem;">
    <strong>Emergency Incident Action:</strong> If an AWS key was pushed to GitHub: <strong>Do not simply delete the commit or make the repo private!</strong> Bots scrape GitHub public commits in under 2 seconds. You must IMMEDIATELY deactivate and rotate the key in IAM console.
  </div>
</div>
`
  }
};
