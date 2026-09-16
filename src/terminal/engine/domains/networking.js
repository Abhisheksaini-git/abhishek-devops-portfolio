/**
 * Computer Networking for Cloud & DevOps Knowledge Domain
 */

export const networkingKnowledge = {
  domain: 'networking',
  topics: [
    {
      id: 'what-happens-url-browser',
      title: 'Deep-Dive: What Happens When You Type a URL in Browser?',
      keywords: ['what happens', 'url', 'browser', 'dns resolution', 'tcp handshake', 'tls', 'https', 'networking workflow'],
      summary: 'From browser cache to DNS hierarchy, ARP, TCP 3-way handshake, TLS negotiation, and HTTP/2 multiplexing.',
      content: `### 🌐 End-to-End Networking: What Happens When You Type "https://example.com"?

A classic Senior DevOps & Systems interview question traversing all layers of the networking stack.

---

#### Step 1: URL Parsing & HSTS Check
* The browser parses scheme (\`https\`), host (\`example.com\`), and port (\`443\`).
* Checks internal **HSTS (HTTP Strict Transport Security)** list to force HTTPS.

#### Step 2: DNS Resolution (Domain to IP)
Resolves domain hierarchically through 5 cache tiers:
1. **Browser DNS Cache** (e.g. Chrome internal cache)
2. **OS Host Cache** (\`/etc/hosts\` or Windows DNS cache)
3. **Local Router DNS Cache**
4. **ISP Recursive Resolver** (e.g., 8.8.8.8, 1.1.1.1)
5. **Root Name Servers (\`.\`)** ➔ **TLD Servers (\`.com\`)** ➔ **Authoritative Name Server** (e.g., Route53 hosting \`example.com\`).

#### Step 3: Layer 4 — TCP 3-Way Handshake
Establishes reliable bidirectional connection:
1. **Client ➔ Server: SYN** (Synchronize sequence number $X$)
2. **Server ➔ Client: SYN-ACK** (Acknowledge $X+1$, Synchronize sequence $Y$)
3. **Client ➔ Server: ACK** (Acknowledge $Y+1$)

#### Step 4: Layer 4/7 — TLS 1.3 Cryptographic Handshake
1. **ClientHello**: Supported cipher suites + Diffie-Hellman key share.
2. **ServerHello**: Selected cipher + Server Certificate (X.509 chain) + Server DH key share.
3. Both generate symmetric session keys (AES-GCM / ChaCha20) for zero-latency encrypted communication (1-RTT or 0-RTT session resumption).

#### Step 5: HTTP/2 or HTTP/3 Request & Response
* Client sends \`GET / HTTP/2\` over the encrypted tunnel.
* Reverses through CDN (Cloudflare/CloudFront) ➔ Load Balancer (ALB) ➔ Ingress Controller ➔ Application Pod ➔ Database.`
    },
    {
      id: 'osi-model-devops',
      title: 'OSI 7-Layer Model Explained for Cloud & DevOps Engineers',
      keywords: ['osi', 'osi model', 'layers', 'layer 4', 'layer 7', 'tcp/ip', 'transport layer', 'application layer'],
      summary: 'Practical mapping of the 7 layers from physical wires up to HTTP/gRPC, with focus on L4 vs L7 load balancing.',
      content: `### 🧱 The OSI Model Demystified for DevOps & Cloud

While academic textbooks cover 7 layers, in DevOps we primarily deal with **Layer 3 (IP/Routing)**, **Layer 4 (TCP/UDP/Ports)**, and **Layer 7 (HTTP/gRPC/TLS)**.

---

| Layer | Name | Protocol / Entity | DevOps Tooling / Context |
| :--- | :--- | :--- | :--- |
| **L7** | **Application** | HTTP, HTTPS, gRPC, WebSocket, DNS | Nginx, AWS ALB, Envoy, Istio, Cloudflare |
| **L6** | **Presentation** | SSL/TLS, JSON, ASCII, gzip | TLS termination, certificate managers |
| **L5** | **Session** | RPC, NetBIOS, Sockets | Session persistence, sticky cookies |
| **L4** | **Transport** | **TCP, UDP**, SCTP, QUIC | AWS NLB, HAProxy TCP mode, iptables/ipvs |
| **L3** | **Network** | **IPv4, IPv6**, ICMP, BGP, OSPF | VPC Routers, CIDR blocks, Subnets, Ping |
| **L2** | **Data Link** | Ethernet, MAC address, ARP, VLAN | AWS ENI (Elastic Network Interface), VXLAN (K8s CNI) |
| **L1** | **Physical** | Fiber, Copper, Radio (WiFi/5G) | Physical data centers, AWS Direct Connect cages |

---

### ⚖️ Layer 4 vs Layer 7 Load Balancing:
* **Layer 4 (NLB / HAProxy TCP)**: Operates purely on IP and Port. Does not decrypt SSL or inspect HTTP headers. Extremely high throughput (millions of RPS), sub-millisecond latency.
* **Layer 7 (ALB / Nginx / Envoy)**: Terminates TLS, inspects URI path (\`/api\` vs \`/static\`), host headers, JWT tokens, and HTTP cookies. More CPU intensive but provides intelligent routing.`
    },
    {
      id: 'cidr-subnetting-explained',
      title: 'CIDR Subnetting & AWS VPC IP Allocation Math',
      keywords: ['cidr', 'subnet', 'subnetting', 'ip address', 'netmask', 'vpc', 'slash notation'],
      summary: 'Mastering slash notation (/24, /16, /28) and understanding AWS reserved IP addresses.',
      content: `### 🧮 CIDR Subnetting Demystified for Cloud Engineers

CIDR (Classless Inter-Domain Routing) specifies an IP block using prefix notation: \`A.B.C.D / PrefixLength\`.

---

### 🔢 Common CIDR Block Sizes:
* **/32**: Exactly **1 IP** (\`2^(32-32) = 1\`) — used for specific host firewalls.
* **/28**: **16 IPs** (\`2^(32-28) = 16\`)
* **/24**: **256 IPs** (\`2^(32-24) = 256\`) — standard microservice subnet.
* **/20**: **4,096 IPs**
* **/16**: **65,536 IPs** — standard VPC size (e.g., \`10.0.0.0/16\`).

---

### ⚠️ The AWS 5-Reserved IPs Rule:
In every AWS VPC subnet, Amazon reserves **5 IP addresses**. If you create a \`/24\` subnet (256 theoretical IPs), only **251** are usable!

For subnet \`10.0.1.0/24\`:
1. \`10.0.1.0\`: Network address.
2. \`10.0.1.1\`: Reserved by AWS for VPC Router.
3. \`10.0.1.2\`: Reserved by AWS for DNS (AmazonProvidedDNS).
4. \`10.0.1.3\`: Reserved by AWS for future use.
5. \`10.0.1.255\`: Network broadcast address (AWS does not support broadcast, but reserves it).`
    },
    {
      id: 'reverse-proxy-vs-forward-proxy',
      title: 'Reverse Proxy vs Forward Proxy Architecture',
      keywords: ['reverse proxy', 'forward proxy', 'nginx', 'proxy', 'squid', 'envoy', 'edge proxy'],
      summary: 'A forward proxy protects and hides clients; a reverse proxy protects and abstracts servers.',
      content: `### 🔄 Forward Proxy vs Reverse Proxy

Both sit between clients and servers, but their direction, purpose, and visibility are opposites.

---

| Feature | Forward Proxy (Client-Facing) | Reverse Proxy (Server-Facing) |
| :--- | :--- | :--- |
| **Who it represents** | Protects / hides the **Client (User)** | Protects / hides the **Origin Servers** |
| **Location** | Client network perimeter / Corporate gateway | Origin infrastructure DMZ / Kubernetes Ingress |
| **Typical Use Cases** | Bypassing firewalls, corporate content filtering, anonymizing user traffic, caching external websites | SSL/TLS termination, load balancing, API routing, WAF inspection, caching backend responses |
| **Visibility** | Client explicitly configures proxy in browser or OS settings | Transparent to client; client believes it is communicating directly with origin |
| **Popular Tools** | Squid, Shadowsocks, Zscaler, Privoxy | Nginx, HAProxy, Envoy, Traefik, AWS ALB |`
    }
  ]
};
