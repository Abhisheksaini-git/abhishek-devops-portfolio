/**
 * Linux & System Administration Knowledge Module
 */

export const LINUX_TOPICS = {
  process_port: {
    patterns: [
      'process using port', 'port 8080', 'port in use', 'find port', 'check port',
      'listen port', 'port listening', 'port check', 'which process is using port'
    ],
    title: "Identifying Processes Binding to Network Ports",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[LINUX NETWORKING] Identifying Processes on Specific Ports:</div>
  <p>To identify which service or process ID (PID) has bound to a TCP/UDP socket (e.g. port 8080):</p>
  
  <div style="margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #030712; border-left: 3px solid #00f0ff; font-family: monospace; font-size: 0.8rem; color: #34d399;">
    # 1. Modern ss tool (fastest, socket statistics)<br />
    sudo ss -tulpn | grep :8080<br /><br />
    # 2. lsof tool (list open files & network sockets)<br />
    sudo lsof -i :8080<br /><br />
    # 3. fuser (find & optionally kill process)<br />
    sudo fuser 8080/tcp
  </div>

  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong style="color: #f59e0b;">Flag Breakdown (ss -tulpn):</strong><br />
    &bull; <code>-t</code>: TCP sockets &nbsp;|&nbsp; <code>-u</code>: UDP sockets<br />
    &bull; <code>-l</code>: Listening sockets only &nbsp;|&nbsp; <code>-p</code>: Show process/program name<br />
    &bull; <code>-n</code>: Don't resolve service names (numeric ports, preventing DNS stall)
  </div>

  <div style="color: #94a3b8; font-size: 0.8rem; margin-top: 0.4rem;">
    <span style="color: #c084fc;">Production Tip:</span> If you need to terminate an orphaned process holding port 8080: <code>sudo fuser -k 8080/tcp</code> or <code>kill -15 &lt;PID&gt;</code> (prefer graceful SIGTERM over <code>SIGKILL -9</code>).
  </div>
</div>
`
  },

  memory_full: {
    patterns: [
      'linux server memory full', 'memory full', 'ram full', 'memory leak',
      'buff/cache', 'buffer cache', 'high memory linux', 'linux using all memory',
      'memory exhausted', 'free -m'
    ],
    title: "Linux Memory Management & Buffer/Cache",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[LINUX KERNEL] Why Linux Server Memory Appears Full:</div>
  <p>In modern Linux kernels, <strong>unused RAM is wasted RAM</strong>. The Linux virtual memory manager automatically claims inactive RAM for disk page caching (<code>buff/cache</code>) to accelerate I/O read operations.</p>
  
  <div style="margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #030712; border-left: 3px solid #a855f7; font-family: monospace; font-size: 0.8rem; color: #34d399;">
    $ free -h<br />
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;used&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;free&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;shared&nbsp;&nbsp;buff/cache&nbsp;&nbsp;&nbsp;available<br />
    Mem:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16Gi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4.2Gi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.1Gi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;240Mi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;10.7Gi&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>11.4Gi</strong>
  </div>

  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong>Crucial Metric:</strong> Never judge memory health by <code>free</code> alone. Always check <strong>available</strong>. Available memory represents memory that can be reclaimed instantly by dropping caches without swapping.
  </div>

  <div style="margin-top: 0.4rem; color: #94a3b8; font-size: 0.8rem;">
    <strong style="color: #ef4444;">When is memory actually in trouble?</strong><br />
    1. <code>available</code> drops below 10-15% of total.<br />
    2. Swap space starts thrashing (high <code>si</code>/<code>so</code> in <code>vmstat 1</code>).<br />
    3. The kernel OOM (Out Of Memory) Killer invokes: check with <code>sudo dmesg -T | grep -i oom</code>.
  </div>
</div>
`
  },

  disk_usage: {
    patterns: [
      'check disk usage', 'disk space', 'disk full', 'find large files', 'du -sh', 'df -h',
      'clean disk', 'disk space full'
    ],
    title: "Linux Disk Space & Inode Analysis",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[SYSTEM ADMINISTRATION] Disk Usage & Inode Troubleshooting:</div>
  
  <div style="margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #030712; border-left: 3px solid #10b981; font-family: monospace; font-size: 0.8rem; color: #34d399;">
    # 1. Overview of mounted filesystems (human readable)<br />
    df -h<br /><br />
    # 2. Check INODE exhaustion (common hidden disk issue!)<br />
    df -i<br /><br />
    # 3. Find top 10 largest directories from root<br />
    sudo du -ahx / 2>/dev/null | sort -rh | head -n 10<br /><br />
    # 4. Find files larger than 500MB<br />
    sudo find / -xdev -type f -size +500M -exec ls -lh {} + 2>/dev/null
  </div>

  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong style="color: #f59e0b;">Production Pitfall (Deleted files holding space):</strong><br />
    If <code>df -h</code> shows 100% full, but <code>du</code> cannot find the large files, a running process (like NGINX or Docker) is holding open file handles to an unlinked/deleted file.
    <br />Fix: <code>sudo lsof +L1</code> to find unlinked files, then restart the holding process.
  </div>
</div>
`
  },

  chmod_permissions: {
    patterns: [
      'chmod 755', 'explain chmod', 'chmod 644', 'chmod 777', 'file permissions',
      'linux permissions', 'chown', 'rwx'
    ],
    title: "Linux File Permissions & Octal Representation",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[SECURITY & PERMISSIONS] Understanding chmod 755:</div>
  <p>Linux permissions assign read (<code>r=4</code>), write (<code>w=2</code>), and execute (<code>x=1</code>) rights across three entities: <strong>Owner (User)</strong>, <strong>Group</strong>, and <strong>Others (World)</strong>.</p>

  <table style="width: 100%; font-size: 0.8rem; border-collapse: collapse; margin: 0.4rem 0;">
    <tr style="color: #00f0ff; border-bottom: 1px solid rgba(255,255,255,0.1);"><th style="text-align: left; padding: 3px;">Digit</th><th style="text-align: left; padding: 3px;">Entity</th><th style="text-align: left; padding: 3px;">Binary/Math</th><th style="text-align: left; padding: 3px;">Meaning</th></tr>
    <tr><td style="color:#34d399; padding: 2px;"><strong>7</strong></td><td>Owner</td><td>4+2+1 (rwx)</td><td>Full Read, Write, Execute</td></tr>
    <tr><td style="color:#f59e0b; padding: 2px;"><strong>5</strong></td><td>Group</td><td>4+0+1 (r-x)</td><td>Read and Execute (No Write)</td></tr>
    <tr><td style="color:#38bdf8; padding: 2px;"><strong>5</strong></td><td>Others</td><td>4+0+1 (r-x)</td><td>Read and Execute (No Write)</td></tr>
  </table>

  <div style="color: #ef4444; font-size: 0.8rem; margin-top: 0.4rem;">
    <strong>Senior SRE Warning:</strong> NEVER use <code>chmod 777</code> in production. 777 grants universal write access, creating catastrophic security holes. Standard production file norms: <code>644</code> for static files, <code>755</code> for directories/binaries, <code>600</code> for SSH keys (<code>~/.ssh/id_rsa</code>) and secrets.
  </div>
</div>
`
  },

  systemd: {
    patterns: [
      'systemd', 'systemctl', 'journalctl', 'service management', 'systemd service',
      'systemctl status'
    ],
    title: "systemd Service Architecture & Management",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[CORE OS] systemd Architecture & Operations:</div>
  <p><code>systemd</code> is the default system and service manager for modern Linux distros (PID 1). It parallelizes service startup, manages dependencies, and supervises crashed daemons.</p>

  <div style="margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #030712; border-left: 3px solid #00f0ff; font-family: monospace; font-size: 0.8rem; color: #34d399;">
    # Lifecycle commands<br />
    sudo systemctl daemon-reload&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Reload unit file modifications<br />
    sudo systemctl start|stop|restart &lt;service&gt;<br />
    sudo systemctl enable --now &lt;service&gt; # Start now & enable on reboot<br /><br />
    # Journal logging inspection<br />
    journalctl -u &lt;service&gt; -f&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# Tail live service logs<br />
    journalctl -u &lt;service&gt; --since "1 hour ago" -p err # Filter errors only
  </div>

  <div style="color: #cbd5e1; font-size: 0.82rem;">
    Unit file locations: Custom application unit files belong in <code>/etc/systemd/system/&lt;name&gt;.service</code>, configured with <code>Restart=always</code> and non-root <code>User=appuser</code> for security.
  </div>
</div>
`
  },

  ssh_troubleshooting: {
    patterns: [
      'troubleshoot ssh', 'ssh issue', 'ssh connection refused', 'permission denied publickey',
      'ssh debug', 'ssh verbose'
    ],
    title: "SSH Diagnostics & Security Hardening",
    content: `
<div style="line-height: 1.55;">
  <div style="color: #38bdf8; font-weight: 700; margin-bottom: 0.3rem;">[SECURITY] SSH Troubleshooting Playbook:</div>
  
  <div style="color: #34d399; font-family: monospace; font-size: 0.8rem; background: #030712; padding: 0.5rem; border-left: 3px solid #38bdf8; margin: 0.4rem 0;">
    # Step 1: Run verbose mode to pinpoint exact handshake failure<br />
    ssh -vvv user@server_ip<br /><br />
    # Step 2: Verify file permissions on client & server (crucial!)<br />
    chmod 700 ~/.ssh<br />
    chmod 600 ~/.ssh/id_rsa ~/.ssh/authorized_keys<br />
    chmod 644 ~/.ssh/id_rsa.pub ~/.ssh/known_hosts
  </div>

  <div style="color: #cbd5e1; font-size: 0.84rem;">
    <strong style="color: #f59e0b;">Top 4 SSH Failure Causes:</strong><br />
    1. <strong>Permission Denied (publickey):</strong> Permissions too open on <code>~/.ssh</code> or key not appended to <code>authorized_keys</code>.<br />
    2. <strong>Connection Timed Out:</strong> Cloud Security Group or host firewall (ufw/iptables) blocking inbound port 22.<br />
    3. <strong>Connection Refused:</strong> sshd service is stopped (<code>sudo systemctl status sshd</code>).<br />
    4. <strong>Host Key Changed:</strong> Man-in-the-middle alert or server was reprovisioned with a new key.
  </div>
</div>
`
  }
};
