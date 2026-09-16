/**
 * CI/CD & Jenkins Production Delivery Knowledge Module
 */

export const CICD_JENKINS_TOPICS = {
  prod_pipeline_design: {
    patterns: [
      'design a production ci/cd pipeline', 'design a cicd pipeline',
      'production ci cd pipeline', 'how to design a cicd pipeline', 'cicd architecture'
    ],
    title: "Production Enterprise CI/CD Pipeline Architecture",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[CI/CD ARCHITECTURE] Production Enterprise Delivery Pipeline:</div>
  
  <div style="margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #030712; border-left: 3px solid #00f0ff; font-family: monospace; font-size: 0.76rem; color: #34d399;">
    [GitHub Push / PR]<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&darr; (Webhook with HMAC SHA256 signature)<br />
    [CI Server: Jenkins / GitHub Actions]<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&darr;<br />
    [Stage 1: Lint & Static Code Analysis (SonarQube)]<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&darr;<br />
    [Stage 2: Fast Unit Tests & Code Coverage (&gt;80% threshold)]<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&darr;<br />
    [Stage 3: Multi-Stage Docker Build & Caching]<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&darr;<br />
    [Stage 4: DevSecOps Gate (Trivy / Snyk Scan for CVEs)] &rarr; Fail build on CRITICAL/HIGH<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&darr;<br />
    [Stage 5: Push Immutable Tagged Image to Container Registry (ECR)]<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&darr;<br />
    [Stage 6: Deploy to Staging Cluster + Automated Integration Tests]<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&darr;<br />
    [Stage 7: Production Release (Canary / Blue-Green Rollout)]<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&darr;<br />
    [Stage 8: Observability Telemetry & Automated Rollback Check]
  </div>

  <div style="color: #cbd5e1; font-size: 0.82rem;">
    <strong style="color: #00f0ff;">Security Principle:</strong> Build the container image ONCE in the pipeline. Test that identical binary/image through Staging and promote it directly to Production without rebuilding.
  </div>
</div>
`
  },

  jenkins_controller_agent: {
    patterns: [
      'jenkins agent vs controller', 'jenkins controller vs agent',
      'jenkins architecture', 'jenkins ephemeral agents'
    ],
    title: "Jenkins Controller & Distributed Kubernetes Agent Architecture",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[JENKINS SCALING] Controller vs Distributed Agent Architecture:</div>
  
  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <p><strong>Jenkins Controller (Master):</strong> Manages the web UI, configuration, credentials, scheduling, and orchestrates pipeline dispatch. <em>Never execute builds on the controller!</em></p>
    <p><strong>Jenkins Agents (Slaves):</strong> Worker processes that execute the actual build steps, Maven compiles, Docker builds, and tests.</p>
  </div>

  <div style="margin: 0.4rem 0; padding: 0.5rem; background: #030712; border-left: 3px solid #a855f7; font-family: monospace; font-size: 0.8rem; color: #34d399;">
    # Modern Senior Pattern: Ephemeral Kubernetes Pod Agents<br />
    # Jenkins dynamically launches a dedicated Pod in K8s for each build,<br />
    # executes the stages, and destroys the Pod immediately.<br />
    # Result: Infinite scaling, zero idle VM cost, perfect clean-room builds!
  </div>
</div>
`
  },

  reduce_deployment_time: {
    patterns: [
      'reduce deployment time', 'speed up cicd', 'slow build', 'faster pipeline',
      'optimize pipeline'
    ],
    title: "Techniques to Cut Pipeline Deployment Time by 70%",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[PERFORMANCE] Accelerating CI/CD Pipeline Speed:</div>
  
  <ol style="margin-left: 1.2rem; font-size: 0.84rem; color: #cbd5e1;">
    <li><strong>Parallel Stage Execution:</strong> Run unit tests, linting, and security static scans simultaneously in parallel stages.</li>
    <li><strong>Package Cache Mounts:</strong> Cache package directories (<code>~/.m2</code> for Maven, <code>~/.npm</code>, or Go modules) between pipeline runs instead of re-downloading thousands of packages.</li>
    <li><strong>Docker Layer Cache (BuildKit / Registry Caching):</strong> Use <code>--cache-from</code> pointing to registry images to avoid re-executing unchanged layers.</li>
    <li><strong>Fast-Fail Ordering:</strong> Place fast lint checks and unit tests first so bad builds fail in 30 seconds rather than after a 10-minute Docker build.</li>
  </ol>
</div>
`
  },

  automated_rollback: {
    patterns: [
      'implement rollback', 'automated rollback', 'pipeline rollback', 'rollback kubernetes',
      'zero downtime rollback'
    ],
    title: "Implementing Automated Safe Rollbacks",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[RESILIENCE] Automated Production Rollbacks:</div>
  
  <div style="font-size: 0.84rem; color: #cbd5e1;">
    1. <strong>Kubernetes Native:</strong> <code>kubectl rollout undo deployment/&lt;app&gt;</code> immediately re-points the ReplicaSet to the previous stable revision.<br />
    2. <strong>Metrics-Driven Rollback:</strong> Monitoring (Prometheus/DataDog) continuously evaluates error rate and HTTP 5xx spikes post-deploy. If error rate exceeds 1% for 3 minutes, automated webhook triggers rollback.<br />
    3. <strong>Database Compatibility Rule:</strong> Application code updates must always support N-1 database schema versions (Expand and Contract pattern). Never deploy breaking DB schema changes in the same step!
  </div>
</div>
`
  }
};
