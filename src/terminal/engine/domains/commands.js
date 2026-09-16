/**
 * DevOps Command Deep-Dives and Simulated Output Engine
 */

export const commandKnowledge = {
  domain: 'commands',
  commands: [
    {
      id: 'kubectl-get-pods',
      name: 'kubectl get pods',
      aliases: ['k get po', 'kubectl get po', 'get pods'],
      description: 'List pods with status, ready count, restarts, and age across namespaces.',
      syntax: 'kubectl get pods [-n <namespace>] [-A] [-o wide|json|yaml] [--show-labels]',
      flags: [
        { flag: '-n, --namespace <ns>', desc: 'Scope query to a specific namespace' },
        { flag: '-A, --all-namespaces', desc: 'List pods across all cluster namespaces' },
        { flag: '-o wide', desc: 'Output additional columns: IP address, Node name, Nominated Node' },
        { flag: '-w, --watch', desc: 'Stream live updates as pod statuses transition' }
      ],
      pitfalls: [
        'Running without `-n` only searches the `default` namespace. Use `-A` if you cannot find your newly deployed pods.',
        'A `Running` status does not guarantee traffic routing—check the `READY` column (e.g., `0/1` means readiness probe failing).'
      ],
      simulation: `NAME                             READY   STATUS    RESTARTS   AGE     IP            NODE                          NOMINATED NODE
payment-service-589db4c8bf-6fkmr 1/1     Running   0          4h12m   10.244.2.45   ip-10-0-12-84.ec2.internal    <none>
payment-service-589db4c8bf-8h29p 1/1     Running   0          4h12m   10.244.3.19   ip-10-0-12-99.ec2.internal    <none>
auth-api-76cf9957df-2jkl4        1/1     Running   1 (2d ago) 6d      10.244.1.88   ip-10-0-11-210.ec2.internal   <none>
notification-worker-674dcb9-pt9v 0/1     CrashLoopBackOff 4 (2m ago) 8m 10.244.3.22 ip-10-0-12-99.ec2.internal    <none>`
    },
    {
      id: 'docker-ps',
      name: 'docker ps',
      aliases: ['docker ps -a', 'docker container ls'],
      description: 'List running or all Docker containers with IDs, images, status, and port bindings.',
      syntax: 'docker ps [-a] [-q] [--filter <filter>] [--format <format>]',
      flags: [
        { flag: '-a, --all', desc: 'Show all containers (both running and stopped/exited)' },
        { flag: '-q, --quiet', desc: 'Only display numeric container IDs' },
        { flag: '--filter "status=exited"', desc: 'Filter containers by execution state' }
      ],
      pitfalls: [
        'If a container died immediately upon startup, `docker ps` will show nothing. Run `docker ps -a` to see exit codes.'
      ],
      simulation: `CONTAINER ID   IMAGE                 COMMAND                  CREATED         STATUS                  PORTS                    NAMES
8f921ea02d41   redis:7-alpine        "docker-entrypoint.s…"   2 hours ago     Up 2 hours              0.0.0.0:6379->6379/tcp   redis-cluster
c390a4dfb899   nginx:1.25-alpine     "/docker-entrypoint.…"   5 hours ago     Up 5 hours              0.0.0.0:80->80/tcp       web-ingress
e44f8019a2b5   backend-api:v2.4.0    "node dist/server.js"    10 minutes ago  Exited (1) 2 minutes ago                         backend-api-worker`
    },
    {
      id: 'free-h',
      name: 'free -h',
      aliases: ['free', 'free -m'],
      description: 'Display total, used, and available system RAM and Swap in human-readable format.',
      syntax: 'free [-h] [-m] [-g] [-s <delay>]',
      flags: [
        { flag: '-h, --human', desc: 'Show output in human-friendly units (B, K, M, G, T)' },
        { flag: '-m, --mebi', desc: 'Display amounts of memory in mebibytes' },
        { flag: '-w, --wide', desc: 'Display buffers and cache in separate columns' }
      ],
      pitfalls: [
        'Do NOT look at `used` memory to gauge if a system is out of memory! Look at the `available` column. Linux intentionally uses unused RAM as buffer/cache.'
      ],
      simulation: `               total        used        free      shared  buff/cache   available
Mem:            31Gi       8.4Gi       1.2Gi       214Mi        21Gi        22Gi
Swap:          4.0Gi       0.0Ki       4.0Gi`
    },
    {
      id: 'df-h',
      name: 'df -h',
      aliases: ['df', 'df -i'],
      description: 'Show file system disk space usage across mounted partitions.',
      syntax: 'df [-h] [-T] [-i]',
      flags: [
        { flag: '-h, --human-readable', desc: 'Print sizes in powers of 1024 (e.g., 1023M)' },
        { flag: '-T, --print-type', desc: 'Print file system type (ext4, xfs, overlay)' },
        { flag: '-i, --inodes', desc: 'List inode information instead of block usage' }
      ],
      pitfalls: [
        'A system can show 50GB free space on `df -h` but still return "No space left on device" if inodes are 100% full (`df -i`).'
      ],
      simulation: `Filesystem      Size  Used Avail Use% Mounted on
udev             16G     0   16G   0% /dev
tmpfs           3.2G  1.8M  3.2G   1% /run
/dev/nvme0n1p1  100G   42G   58G  42% /
/dev/nvme1n1    500G  380G   95G  80% /var/lib/docker
overlay         500G  380G   95G  80% /var/lib/docker/overlay2/.../merged`
    }
  ]
};
