/**
 * Terraform & Infrastructure as Code (IaC) Engineering Knowledge Module
 */

export const TERRAFORM_TOPICS = {
  state_management: {
    patterns: [
      'terraform state', 'what is terraform state', 'manage terraform state in a team',
      'remote state', 'state locking', 's3 dynamodb backend'
    ],
    title: "Terraform State Management & Team Concurrency",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[TERRAFORM INTERNALS] State Architecture & Remote Backends:</div>
  <p><code>terraform.tfstate</code> is the single source of truth mapping your declared HCL code to real-world cloud resource IDs and attributes.</p>

  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong style="color: #f59e0b;">Production Team Best Practices:</strong>
    <ol style="margin-left: 1.2rem; margin-top: 0.2rem;">
      <li><strong>Never commit state to Git:</strong> State contains unencrypted secrets (passwords, private keys, connection strings) in plain JSON.</li>
      <li><strong>Remote Backend (AWS S3 + DynamoDB):</strong> Store state in an encrypted, versioned S3 bucket with DynamoDB table locking to prevent two engineers or CI pipelines from applying concurrent updates.</li>
      <li><strong>State Partitioning:</strong> Don't keep your entire infrastructure in one state file. Split state by layer (Networking/VPC &rarr; Compute/EKS &rarr; Database/RDS) to limit blast radius.</li>
    </ol>
  </div>

  <div style="margin: 0.4rem 0; padding: 0.5rem; background: #030712; border-left: 3px solid #10b981; font-family: monospace; font-size: 0.78rem; color: #34d399;">
    terraform {<br />
    &nbsp;&nbsp;backend "s3" {<br />
    &nbsp;&nbsp;&nbsp;&nbsp;bucket&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= "abhishek-corp-tfstate"<br />
    &nbsp;&nbsp;&nbsp;&nbsp;key&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= "prod/vpc/terraform.tfstate"<br />
    &nbsp;&nbsp;&nbsp;&nbsp;region&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= "us-east-1"<br />
    &nbsp;&nbsp;&nbsp;&nbsp;dynamodb_table = "terraform-locks"<br />
    &nbsp;&nbsp;&nbsp;&nbsp;encrypt&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= true<br />
    &nbsp;&nbsp;}<br />
    }
  </div>
</div>
`
  },

  plan_internals: {
    patterns: [
      'what happens during terraform plan', 'terraform plan mechanics',
      'terraform plan explained'
    ],
    title: "Terraform Plan: Execution Graph & Drift Detection",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[EXECUTION LIFECYCLE] What Happens During 'terraform plan':</div>
  
  <ol style="margin-left: 1.2rem; font-size: 0.84rem; color: #cbd5e1;">
    <li><strong>Provider Initialization:</strong> Connects to provider plugins (AWS, GCP, etc.) defined in configuration.</li>
    <li><strong>State Refresh (Drift Detection):</strong> Queries cloud provider APIs to fetch the real-time state of existing resources, comparing them against the cached <code>.tfstate</code>.</li>
    <li><strong>Dependency Graph Generation:</strong> Constructs a Directed Acyclic Graph (DAG) of all resources, dependencies, and data blocks.</li>
    <li><strong>Diff Computation:</strong> Compares the refreshed real-world state against the target configuration in <code>.tf</code> files.</li>
    <li><strong>Action Formulation:</strong> Emits an execution plan categorized into:
      <br /><span style="color: #34d399;">+ Create</span>, <span style="color: #f59e0b;">~ Update in-place</span>, <span style="color: #ef4444;">- Destroy</span>, or <span style="color: #f87171;">-/+ Destroy and Recreate (replacement)</span>.
    </li>
  </ol>
</div>
`
  },

  count_vs_foreach: {
    patterns: [
      'count vs for_each', 'for_each vs count', 'difference between count and for_each',
      'when to use count or for_each'
    ],
    title: "Terraform: count vs for_each Comparison",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[HCL PATTERNS] count vs for_each: The Indexing Trap:</div>
  
  <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin: 0.4rem 0;">
    <tr style="color: #00f0ff; border-bottom: 1px solid rgba(255,255,255,0.1);"><th style="text-align: left; padding: 4px;">Feature</th><th style="text-align: left; padding: 4px;">count</th><th style="text-align: left; padding: 4px;">for_each</th></tr>
    <tr><td style="color:#38bdf8;"><strong>Identifier</strong></td><td>Integer index (<code>aws_subnet.sub[0]</code>)</td><td>Map or set key (<code>aws_subnet.sub["us-east-1a"]</code>)</td></tr>
    <tr><td style="color:#38bdf8;"><strong>Item Deletion</strong></td><td><strong style="color: #ef4444;">Dangerous:</strong> Removing index 0 causes all subsequent resources to shift and recreate!</td><td><strong style="color: #34d399;">Safe:</strong> Removing a key only destroys that specific single resource.</td></tr>
    <tr><td style="color:#38bdf8;"><strong>Best Use</strong></td><td>Simple conditional toggle (<code>count = var.enabled ? 1 : 0</code>)</td><td>Multiple unique resources from maps/sets</td></tr>
  </table>

  <div style="color: #34d399; font-size: 0.8rem; margin-top: 0.3rem;">
    <strong>Senior Guideline:</strong> Almost always prefer <code>for_each</code> over <code>count</code> when iterating over a collection of resources.
  </div>
</div>
`
  },

  drift_detection: {
    patterns: [
      'detect infrastructure drift', 'terraform drift', 'infrastructure drift',
      'terraform refresh'
    ],
    title: "Detecting & Resolving Infrastructure Drift in Production",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[DRIFT REMEDIATION] Detecting Out-of-Band Changes:</div>
  <p><strong>Infrastructure Drift</strong> happens when resources are modified outside of Terraform (e.g. an engineer manually edited a security group rule in the AWS console).</p>

  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong>Automated Drift Workflow:</strong>
    <ul style="margin-left: 1.2rem; margin-top: 0.2rem;">
      <li><strong>Detect:</strong> Run scheduled CI/CD jobs (e.g. nightly cron) with <code>terraform plan -detailed-exitcode</code>. Exit code 2 indicates drift detected!</li>
      <li><strong>Inspect:</strong> <code>terraform plan -refresh-only</code> inspects real-world state and shows drift without proposing infrastructure modifications.</li>
      <li><strong>Remediate:</strong> Running <code>terraform apply</code> reconciles cloud infrastructure back to the declared configuration, overriding manual changes.</li>
    </ul>
  </div>
</div>
`
  }
};
