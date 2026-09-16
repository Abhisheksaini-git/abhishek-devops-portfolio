/**
 * Docker & Containerization Engineering Knowledge Module
 */

export const DOCKER_TOPICS = {
  image_optimization: {
    patterns: [
      'docker', 'what is docker', 'docker image optimize', 'optimize docker image', 'optimize docker', 'docker optimize',
      'why is my docker image huge', 'optimize a dockerfile', 'docker image size',
      'reduce docker image size', 'multi-stage build', 'dockerfile best practices',
      'docker layer caching'
    ],
    title: "Docker Image Optimization & Multi-Stage Builds",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[DOCKER OPTIMIZATION] Reducing Container Image Size from 1.2GB to 35MB:</div>
  <p>Bloated container images cause slow CI/CD deployments, high storage costs, and a massive vulnerability attack surface.</p>

  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong style="color: #f59e0b;">5 Senior Optimization Techniques:</strong>
    <ol style="margin-left: 1.2rem; margin-top: 0.2rem;">
      <li><strong>Multi-Stage Builds:</strong> Separate build SDK tools from production runtime. Only copy the compiled artifact.</li>
      <li><strong>Minimal Base Images:</strong> Use <code>alpine</code> or Google <code>distroless</code> instead of full Ubuntu/Debian.</li>
      <li><strong>Combine RUN Commands:</strong> Each <code>RUN</code> adds a layer. Chain commands with <code>&&</code> and clean package caches in the same layer:
        <br /><code>RUN apt-get update && apt-get install -y --no-install-recommends app && rm -rf /var/lib/apt/lists/*</code>
      </li>
      <li><strong>Order Layers by Frequency of Change:</strong> Put dependency manifests (<code>package.json</code>, <code>pom.xml</code>) before source code (<code>COPY . .</code>) to maximize Docker build layer cache hits.</li>
      <li><strong>Use <code>.dockerignore</code>:</strong> Exclude <code>node_modules</code>, <code>.git</code>, test reports, and local build files.</li>
    </ol>
  </div>

  <div style="margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #030712; border-left: 3px solid #10b981; font-family: monospace; font-size: 0.76rem; color: #34d399;">
    # Multi-Stage Example (Node.js/Go)<br />
    FROM golang:1.22-alpine AS builder<br />
    WORKDIR /app<br />
    COPY go.mod go.sum ./<br />
    RUN go mod download<br />
    COPY . .<br />
    RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o server .<br /><br />
    # Production Stage: Zero build tools, tiny image<br />
    FROM gcr.io/distroless/static-debian12<br />
    COPY --from=builder /app/server /server<br />
    USER nonroot:nonroot<br />
    ENTRYPOINT ["/server"]
  </div>
</div>
`
  },

  container_exit_immediately: {
    patterns: [
      'container exit immediately', 'docker container stops immediately', 'exited 0',
      'docker exit 0', 'why does docker container exit', 'container exits right away'
    ],
    title: "Why Docker Containers Exit Immediately (PID 1 Mechanics)",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[DOCKER LIFECYCLE] Root Cause of Immediate Container Exits:</div>
  <p>A Docker container exists only as long as its <strong>PID 1 process is actively running in the foreground</strong>. As soon as the primary process terminates, the container halts.</p>

  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong style="color: #f59e0b;">Common Causes & Fixes:</strong>
    <ul style="margin-left: 1.2rem; margin-top: 0.2rem;">
      <li><strong>Service Running in Background (Daemonized):</strong> Running <code>nginx</code> or <code>apache2ctl start</code> forks a background process and exits PID 1.
        <br />&rarr; Fix: Run in foreground: <code>CMD ["nginx", "-g", "daemon off;"]</code>.</li>
      <li><strong>Shell Script Missing Wait / Exec:</strong> Script ends without holding execution open.
        <br />&rarr; Fix: End entrypoint scripts with <code>exec "$@"</code>.</li>
      <li><strong>Syntax/Configuration Error:</strong> The app crashed upon boot due to missing environment variables or DB connection failure.
        <br />&rarr; Check: <code>docker logs &lt;container_id&gt;</code>.</li>
      <li><strong>Shell / Terminal Need:</strong> Trying to run interactive bash container without TTY.
        <br />&rarr; Run with: <code>docker run -it &lt;image&gt; sh</code>.</li>
    </ul>
  </div>
</div>
`
  },

  docker_networking: {
    patterns: [
      'docker networking', 'bridge networking', 'containers communicate',
      'why cant my containers communicate', 'docker network connect'
    ],
    title: "Docker Networking Architecture (Bridge, Host, Overlay)",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[NETWORKING] How Docker Container Networking Works:</div>
  
  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong style="color: #00f0ff;">Network Drivers:</strong>
    <ul style="margin-left: 1.2rem; margin-top: 0.2rem;">
      <li><strong>Bridge (Default):</strong> Creates a private virtual Ethernet bridge (<code>docker0</code>) with NAT. Custom user-defined bridge networks enable <strong>built-in automatic DNS service discovery</strong> by container name!</li>
      <li><strong>Host:</strong> Bypasses network namespace isolation; container binds directly to host interfaces (maximum throughput, no port mapping).</li>
      <li><strong>Overlay:</strong> Multi-host networking across swarm or cluster nodes with VXLAN encapsulation.</li>
      <li><strong>None:</strong> Complete network isolation (no network interface except loopback).</li>
    </ul>
  </div>

  <div style="margin: 0.4rem 0; padding: 0.5rem; background: #030712; border-left: 3px solid #f59e0b; font-family: monospace; font-size: 0.8rem; color: #34d399;">
    # Why containers fail to talk to each other:<br />
    # Default 'bridge' network DOES NOT support DNS by container name!<br />
    # Always create a user-defined network:<br />
    docker network create app-net<br />
    docker run -d --name db --net app-net postgres<br />
    docker run -d --name backend --net app-net my-api # Can now curl 'http://db:5432'!
  </div>
</div>
`
  },

  volume_vs_bind_mount: {
    patterns: [
      'volume vs bind mount', 'bind mount vs volume', 'docker volume',
      'persistent storage docker'
    ],
    title: "Docker Volumes vs Bind Mounts vs tmpfs",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[STORAGE] Docker Volumes vs Bind Mounts:</div>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; margin: 0.4rem 0;">
    <tr style="color: #00f0ff; border-bottom: 1px solid rgba(255,255,255,0.1);"><th style="text-align: left; padding: 3px;">Feature</th><th style="text-align: left; padding: 3px;">Docker Volumes</th><th style="text-align: left; padding: 3px;">Bind Mounts</th></tr>
    <tr><td style="color:#38bdf8;">Host Path</td><td>Managed by Docker (<code>/var/lib/docker/volumes/</code>)</td><td>Explicit host directory (e.g. <code>/home/user/app</code>)</td></tr>
    <tr><td style="color:#38bdf8;">Portability</td><td>100% portable; platform-independent</td><td>Tied to host filesystem structure</td></tr>
    <tr><td style="color:#38bdf8;">Security</td><td>Protected from external OS user tampering</td><td>Container can overwrite sensitive host files</td></tr>
    <tr><td style="color:#38bdf8;">Use Case</td><td><strong>Databases & Production Data</strong></td><td><strong>Local code hot-reloading in dev</strong></td></tr>
  </table>
</div>
`
  }
};
