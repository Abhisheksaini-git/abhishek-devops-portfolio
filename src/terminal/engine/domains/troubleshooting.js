/**
 * Production Troubleshooting Playbooks
 * Format: PROBLEM → Possible Causes → Diagnostic Checks → Commands → Fix → Prevention
 */

export const troubleshootingKnowledge = {
  domain: 'troubleshooting',
  scenarios: [
    {
      id: 'crashloopbackoff',
      title: 'Kubernetes CrashLoopBackOff Resolution Playbook',
      keywords: ['crashloopbackoff', 'crashloop', 'pod crashing', 'pod restart', 'exit code 1', 'exit code 143'],
      problem: 'Kubernetes Pod repeatedly starts, fails, and restarts with exponential backoff delay.',
      causes: [
        'Application configuration error or missing environment variables / ConfigMap / Secret',
        'Database or dependent downstream service connection failure on startup',
        'Out Of Memory (OOMKilled - Exit code 137)',
        'Liveness probe failing prematurely before application finishes boot sequence',
        'Application PID 1 exiting because process terminated or ran in background'
      ],
      diagnostics: [
        'Inspect Pod status and exit code via `kubectl describe pod <pod_name>`',
        'Check container logs (including previous failed container instance with `--previous`)',
        'Verify Liveness/Readiness probe thresholds and timeouts',
        'Check Events section in describe output for OOM or failed mount warnings'
      ],
      commands: [
        'kubectl get pods -n <namespace> -o wide',
        'kubectl describe pod <pod-name> -n <namespace> | grep -A 10 "Last State"',
        'kubectl logs <pod-name> -n <namespace> --previous --tail=100',
        'kubectl logs <pod-name> -n <namespace> -c <container-name>',
        'kubectl get events -n <namespace> --sort-by=".metadata.creationTimestamp"'
      ],
      fix: [
        'If Exit Code 137 (OOMKilled): Increase `resources.limits.memory` in Pod spec.',
        'If Liveness probe failing too early: Add a `startupProbe` with `failureThreshold: 30` and `periodSeconds: 10` to give the app up to 300s to initialize.',
        'If missing config/secret: Run `kubectl get configmap,secret` and verify key names match `envFrom` or `valueFrom`.',
        'If entrypoint exit: Ensure Docker CMD runs in foreground (e.g. `nginx -g "daemon off;"`).'
      ],
      prevention: [
        'Always configure `startupProbe` alongside `livenessProbe` for JVM or heavy boot apps.',
        'Set sensible resource requests and limits determined from Grafana saturation metrics.',
        'Enforce health check readiness before traffic routing.'
      ]
    },
    {
      id: '502-bad-gateway',
      title: '502 Bad Gateway (Nginx / ALB / Kubernetes Ingress) Resolution Playbook',
      keywords: ['502', '502 bad gateway', 'bad gateway', 'nginx 502', 'alb 502', 'upstream error', 'gateway timeout'],
      problem: 'HTTP 502 Bad Gateway: The reverse proxy (Nginx / ALB / Ingress) received an invalid or null response from the upstream backend service.',
      causes: [
        'Upstream application process is dead, crashed, or not running on the target port',
        'Backend connection pool exhausted or thread starvation refusing new TCP connections',
        'Security group or firewall blocking traffic between Load Balancer and backend nodes',
        'Keep-Alive timeout mismatch (ALB keep-alive < backend keep-alive causes race conditions)',
        'Kubernetes Service selector does not match any running Pod labels (zero endpoints)'
      ],
      diagnostics: [
        'Check reverse proxy error logs (e.g. `/var/log/nginx/error.log` or ALB access logs)',
        'Test backend port locally with `curl -Iv http://127.0.0.1:<port>/health`',
        'Check Kubernetes Service endpoints with `kubectl get endpoints <service_name>`',
        'Verify backend process status and listen socket with `ss -tulpn`'
      ],
      commands: [
        '# 1. On Nginx host: check error log for upstream connection refused',
        'sudo tail -n 50 /var/log/nginx/error.log | grep -E "connect\\(\\) failed|upstream"',
        '# 2. In Kubernetes: verify endpoints are mapped to healthy pods',
        'kubectl get endpoints <service-name> -n <namespace>',
        'kubectl get pods -l app=<service-label> -o wide',
        '# 3. Direct health check against backend container/port',
        'curl -Iv http://<upstream-ip>:<upstream-port>/healthz'
      ],
      fix: [
        'If "Connection Refused": Restart backend daemon or fix container crash.',
        'If "No Endpoints": Verify `service.spec.selector` exactly matches `pod.metadata.labels`.',
        'If AWS ALB 502: Set backend application Keep-Alive timeout to **greater than ALB idle timeout** (e.g., ALB = 60s, Backend = 65s) to eliminate TCP RST race conditions.',
        'If AWS Target Group Unhealthy: Check EC2 Security Group allows inbound traffic from ALB SG on the target port.'
      ],
      prevention: [
        'Implement standardized health check endpoints (`/healthz` or `/readyz`) returning 200 OK.',
        'Configure connection draining and graceful termination signals (SIGTERM handling).',
        'Set up synthetic canary probes to test end-to-end user path continuously.'
      ]
    },
    {
      id: 'cpu-100-percent',
      title: 'Linux / Production 100% CPU Spike Resolution Playbook',
      keywords: ['100 cpu', 'cpu spike', 'high cpu', 'load average', 'cpu bottleneck', 'top cpu', 'threads'],
      problem: 'Server or container CPU utilization spikes to 100%, causing degraded response times or service unavailability.',
      causes: [
        'Application infinite loop, regex catastrophic backtracking, or unindexed database queries',
        'Sudden legitimate organic traffic spike or Distributed Denial of Service (DDoS) attack',
        'Garbage collection thrashing (e.g. JVM Full GC loop due to memory pressure)',
        'Misconfigured background cron job or runaway script'
      ],
      diagnostics: [
        'Check overall system load and identify top offending process with `top` or `htop`',
        'Inspect individual threads of the offending process with `top -H -p <pid>`',
        'Capture application thread dump or profiling snapshot (e.g., `jstack`, `pprof`, `py-spy`)',
        'Check access logs for unusual IP request volume'
      ],
      commands: [
        '# View system metrics sorted by CPU',
        'top -b -n 1 -o +%CPU | head -n 20',
        '# View per-thread CPU consumption',
        'top -H -p <PID>',
        '# If Java app: capture thread dump to find spinning method',
        'jstack <PID> > /tmp/threaddump_$(date +%s).txt',
        '# Check top IP addresses hitting Nginx',
        'awk "{print $1}" /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 10'
      ],
      fix: [
        'Immediate relief: Scale out horizontally (increase HPA replicas or ASG instances).',
        'If malicious bot/DDoS: Block offending IP or ASN at Cloudflare/AWS WAF edge.',
        'If runaway query/process: Gracefully restart offending container or worker process.',
        'Permanent fix: Optimize application algorithms, patch regex, or add database index.'
      ],
      prevention: [
        'Configure automated horizontal pod autoscaling (HPA) targeting 65-75% CPU utilization.',
        'Implement rate limiting at the API Gateway or WAF level.',
        'Set strict CPU resource requests and limits in Kubernetes.'
      ]
    },
    {
      id: 'oomkilled-exit-137',
      title: 'Kubernetes OOMKilled (Exit Code 137) Diagnostic Playbook',
      keywords: ['oomkilled', 'oom', 'exit code 137', 'exit 137', '137', 'out of memory', 'memory limit', 'linux oom-killer'],
      problem: 'Container abruptly terminated by Linux kernel cgroup OOM-killer because it exceeded configured memory limit.',
      causes: [
        'Application memory leak (unreleased object references, unbounded caches, unclosed sockets)',
        'Memory limit configured too low for peak workload volume',
        'JVM heap memory not adhering to container cgroup memory boundaries (`-XX:MaxRAMPercentage`)',
        'Large dataset loaded completely into RAM instead of streaming chunks'
      ],
      diagnostics: [
        'Verify container terminated reason is `OOMKilled` with exit code `137`',
        'Check kernel dmesg for `invoked oom-killer` messages',
        'Monitor Grafana memory usage graphs leading up to the termination event'
      ],
      commands: [
        'kubectl describe pod <pod-name> -n <namespace> | grep -E "(OOMKilled|Exit Code|Limits)"',
        'dmesg -T | grep -i -E "oom-killer|out of memory"',
        'kubectl top pod <pod-name> -n <namespace> --containers'
      ],
      fix: [
        'Immediate fix: Raise `resources.limits.memory` in deployment manifest (e.g. from 512Mi to 1Gi).',
        'For Java 11+: Set JVM flags `-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0` to prevent JVM from allocating beyond container limits.',
        'For Node.js: Set `--max-old-space-size=<megabytes>` appropriately.',
        'Permanent fix: Profile heap dump to trace and eliminate memory leaks.'
      ],
      prevention: [
        'Always set memory requests equal to memory limits for guaranteed QoS class in K8s.',
        'Instrument memory tracking alerts at 80% threshold before OOM occurs.',
        'Stream large file uploads/downloads directly to disk/S3 rather than buffering in memory.'
      ]
    },
    {
      id: 'disk-full-inodes',
      title: 'Linux Disk Space 100% Full & Inode Exhaustion Playbook',
      keywords: ['disk full', 'no space left on device', 'inodes full', 'clean docker disk', 'disk space'],
      problem: '"No space left on device" error prevents services from writing logs, temp files, or database entries.',
      causes: [
        'Runaway log files in `/var/log` or application log directory without rotation',
        'Dangling uncleaned Docker images, containers, and build cache',
        'Inode exhaustion (millions of tiny files consuming inodes even when GBs of disk remain free)',
        'Deleted file handles still held open by running processes (space not released to OS)'
      ],
      diagnostics: [
        'Check block space with `df -h` and inode utilization with `df -i`',
        'Locate largest directories with `du -sh /*`',
        'Identify deleted files still held open by processes with `lsof +L1`'
      ],
      commands: [
        '# Check disk capacity and inode count',
        'df -h; df -i',
        '# Find top 10 largest folders on root partition',
        'sudo du -ahx / | sort -rh | head -n 15',
        '# Check for deleted files held open by running processes',
        'sudo lsof +L1',
        '# Prune unused Docker containers, images, volumes, and build caches',
        'docker system prune -af --volumes'
      ],
      fix: [
        'Clean old systemd journal logs: `sudo journalctl --vacuum-size=500M`.',
        'Truncate runaway active log files safely without breaking process fd: `sudo truncate -s 0 /path/to/log.log`.',
        'Restart processes holding deleted files identified in `lsof +L1`.',
        'Run `docker system prune -af --volumes` to reclaim GBs of dangling container data.'
      ],
      prevention: [
        'Configure logrotate (`/etc/logrotate.d/`) with maxsize, daily rotation, and gzip compression.',
        'Set up automated disk alerts at 75% and 85% capacity in Prometheus/Grafana.',
        'Set up a weekly cron job to prune dangling container build caches.'
      ]
    }
  ]
};
