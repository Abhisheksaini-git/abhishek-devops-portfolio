/**
 * AWS & Cloud Infrastructure Engineering Knowledge Module
 */

export const AWS_TOPICS = {
  deploy_prod_app: {
    patterns: [
      'deploy a production web application on aws', 'deploy web app aws',
      'production aws setup', 'how to deploy on aws'
    ],
    title: "Deploying a Production Web Application on AWS (Architecture)",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[CLOUD ARCHITECTURE] Enterprise Production Web Application Blueprint:</div>
  
  <div style="font-size: 0.84rem; color: #cbd5e1;">
    1. <strong>Edge & DNS:</strong> Route 53 (DNS) with latency routing &rarr; CloudFront CDN (caching static assets + AWS WAF protecting against DDoS & SQLi).<br />
    2. <strong>Public Subnet Layer:</strong> Application Load Balancer (ALB) across 2+ Availability Zones with ACM TLS/SSL termination.<br />
    3. <strong>Private Subnet Layer (Compute):</strong> Auto Scaling Group (ASG) of EC2 instances or Amazon EKS container nodes running in isolated private subnets.<br />
    4. <strong>Isolated Database Layer:</strong> Multi-AZ Amazon RDS (PostgreSQL/MySQL) with automatic cross-AZ failover and encrypted EBS storage.<br />
    5. <strong>Outbound Internet:</strong> Highly available NAT Gateways in each public subnet to allow instances to pull security patches without exposing public IPs.<br />
    6. <strong>Observability & Audit:</strong> CloudWatch Metrics/Alarms, CloudTrail for audit logs, and AWS Secrets Manager for database credentials.
  </div>
</div>
`
  },

  secure_ec2: {
    patterns: [
      'secure an ec2 instance', 'secure ec2', 'ec2 hardening', 'ec2 security best practices',
      'protect ec2'
    ],
    title: "Production EC2 Security Hardening Playbook",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[AWS SECURITY] Hardening EC2 Instances for Production:</div>
  
  <ul style="margin-left: 1.2rem; font-size: 0.84rem; color: #cbd5e1;">
    <li><strong>Private Subnets Only:</strong> Never assign Public IP addresses to application compute. Keep instances in private subnets behind an ALB.</li>
    <li><strong>Zero Open SSH Ports (Use AWS Systems Manager SSM):</strong> Eliminate port 22 entirely! Use <strong>AWS Systems Manager Session Manager</strong> for secure, audited browser-based shell access via IAM roles.</li>
    <li><strong>IAM Roles Instead of Access Keys:</strong> Never store <code>AWS_ACCESS_KEY_ID</code> on an EC2 instance. Attach an IAM Instance Profile.</li>
    <li><strong>Enforce IMDSv2:</strong> Disable legacy Instance Metadata Service v1 to prevent SSRF vulnerabilities:
      <br /><code>aws ec2 modify-instance-metadata-options --http-tokens required</code>.</li>
    <li><strong>Encrypt EBS Volumes:</strong> Mandate KMS customer-managed keys (CMK) for root and data EBS volumes.</li>
    <li><strong>Security Group Least Privilege:</strong> Inbound allowed ONLY from ALB Security Group on target application port.</li>
  </ul>
</div>
`
  },

  alb_vs_nlb: {
    patterns: [
      'alb vs nlb', 'nlb vs alb', 'application load balancer vs network load balancer',
      'when to use alb or nlb'
    ],
    title: "AWS ALB vs NLB Comparison & Selection Guide",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[NETWORKING] Application Load Balancer (ALB) vs Network Load Balancer (NLB):</div>
  
  <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin: 0.4rem 0;">
    <tr style="color: #00f0ff; border-bottom: 1px solid rgba(255,255,255,0.1);"><th style="text-align: left; padding: 4px;">Metric</th><th style="text-align: left; padding: 4px;">ALB (Layer 7)</th><th style="text-align: left; padding: 4px;">NLB (Layer 4)</th></tr>
    <tr><td style="color:#38bdf8;"><strong>OSI Layer</strong></td><td>HTTP, HTTPS, gRPC, WebSocket (L7)</td><td>TCP, UDP, TLS (L4)</td></tr>
    <tr><td style="color:#38bdf8;"><strong>Routing Smarts</strong></td><td>Path-based, host-based, query string routing</td><td>High-throughput connection hashing</td></tr>
    <tr><td style="color:#38bdf8;"><strong>Performance</strong></td><td>High; handles complex TLS inspection</td><td><strong>Ultra-low latency</strong> (millions of RPS)</td></tr>
    <tr><td style="color:#38bdf8;"><strong>Static IP</strong></td><td>Dynamic DNS names (No static IP)</td><td><strong>Static Elastic IP per AZ</strong></td></tr>
    <tr><td style="color:#38bdf8;"><strong>Best For</strong></td><td>Microservices, REST APIs, Web apps</td><td>Gaming, financial streaming, IoT, VPNs</td></tr>
  </table>
</div>
`
  },

  sg_vs_nacl: {
    patterns: [
      'security group vs nacl', 'nacl vs security group', 'difference between sg and nacl',
      'sg vs nacl'
    ],
    title: "Security Groups vs Network ACLs (NACL) Deep Dive",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[VPC FIREWALLS] Security Groups vs Network ACLs (NACL):</div>
  
  <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin: 0.4rem 0;">
    <tr style="color: #00f0ff; border-bottom: 1px solid rgba(255,255,255,0.1);"><th style="text-align: left; padding: 4px;">Property</th><th style="text-align: left; padding: 4px;">Security Group (SG)</th><th style="text-align: left; padding: 4px;">Network ACL (NACL)</th></tr>
    <tr><td style="color:#38bdf8;"><strong>Scope</strong></td><td>Instance / ENI Network Interface level</td><td>Subnet boundary level</td></tr>
    <tr><td style="color:#38bdf8;"><strong>Statefulness</strong></td><td><strong>Stateful:</strong> Return traffic automatically allowed</td><td><strong>Stateless:</strong> Return traffic requires explicit ephemeral port rule</td></tr>
    <tr><td style="color:#38bdf8;"><strong>Rules</strong></td><td>Allow rules ONLY (implicit deny all)</td><td>Allow AND Deny rules in numbered order</td></tr>
    <tr><td style="color:#38bdf8;"><strong>Evaluation</strong></td><td>All rules evaluated before decision</td><td>Evaluated sequentially in numerical rule order</td></tr>
  </table>

  <div style="color: #94a3b8; font-size: 0.8rem; margin-top: 0.4rem;">
    <span style="color: #34d399;">Architectural Best Practice:</span> Use Security Groups for 95% of traffic control. Use NACLs primarily to block specific malicious IP addresses or subnets (e.g. Rule 100 DENY 198.51.100.0/24).
  </div>
</div>
`
  },

  private_subnet_internet: {
    patterns: [
      'private subnets access the internet', 'nat gateway', 'nat vs internet gateway',
      'how do private subnets access internet'
    ],
    title: "NAT Gateway Architecture for Private Subnets",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[VPC NETWORKING] How Private Subnets Access the Internet:</div>
  <p>Instances in private subnets have <strong>no public IP addresses</strong> and cannot receive unsolicited inbound connections from the web.</p>
  
  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong>Data Flow for Outbound Requests (e.g. <code>yum update</code>):</strong>
    <ol style="margin-left: 1.2rem; margin-top: 0.2rem;">
      <li>Private EC2 sends packet to destination with Private IP source.</li>
      <li>Private Subnet Route Table routes <code>0.0.0.0/0</code> to the <strong>NAT Gateway</strong> in the Public Subnet.</li>
      <li>The NAT Gateway translates the private source IP to its allocated Elastic IP (Public IP).</li>
      <li>Public Subnet Route Table routes <code>0.0.0.0/0</code> to the <strong>Internet Gateway (IGW)</strong>.</li>
      <li>Response traffic returns through the NAT Gateway, which maps the connection back to the private instance.</li>
    </ol>
  </div>

  <div style="color: #f59e0b; font-size: 0.8rem; margin-top: 0.4rem;">
    <strong>High Availability Caution:</strong> NAT Gateways are AZ-specific. In production, deploy 1 NAT Gateway per Availability Zone to prevent cross-AZ failure dependencies.
  </div>
</div>
`
  }
};
