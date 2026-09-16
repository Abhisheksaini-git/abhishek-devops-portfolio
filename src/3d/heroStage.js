import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { sound } from '../utils/audio.js';

export class Hero3DStage {
  constructor(mountElement, hudInfoElement) {
    this.mount = mountElement;
    this.hud = hudInfoElement;
    this.currentMode = 'k8s'; // 'k8s', 'aws', 'docker'
    this.interactiveObjects = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.clock = new THREE.Clock();
    this.dataPackets = [];

    this.init();
    this.createLights();
    this.buildMode(this.currentMode);
    this.setupEvents();
    this.animate();
  }

  init() {
    const width = this.mount.clientWidth || 550;
    const height = this.mount.clientHeight || 450;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 5, 14);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    this.mount.innerHTML = '';
    this.mount.appendChild(this.renderer.domElement);

    // OrbitControls for true 360 degree interactive dragging & zoom
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 1.2;
    this.controls.maxDistance = 25;
    this.controls.minDistance = 6;
    this.controls.maxPolarAngle = Math.PI / 1.8;
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.0);
    this.scene.add(ambientLight);

    this.cyanLight = new THREE.PointLight(0x00f0ff, 4, 30);
    this.cyanLight.position.set(6, 8, 6);
    this.scene.add(this.cyanLight);

    this.violetLight = new THREE.PointLight(0xa855f7, 3.5, 30);
    this.violetLight.position.set(-6, -6, 6);
    this.scene.add(this.violetLight);

    this.goldLight = new THREE.PointLight(0xff9900, 3, 25);
    this.goldLight.position.set(0, 10, -5);
    this.scene.add(this.goldLight);
  }

  clearStage() {
    if (this.stageGroup) {
      this.scene.remove(this.stageGroup);
    }
    this.stageGroup = new THREE.Group();
    this.scene.add(this.stageGroup);
    this.interactiveObjects = [];
    this.dataPackets = [];
  }

  setMode(mode) {
    this.currentMode = mode;
    this.clearStage();
    this.buildMode(mode);
    sound.playSuccess();
    this.updateHUD(`MODE SWITCHED: ${mode.toUpperCase()} ARCHITECTURE ACTIVE`, 'healthy');
  }

  buildMode(mode) {
    this.clearStage();

    if (mode === 'k8s') {
      this.buildKubernetesCluster();
    } else if (mode === 'aws') {
      this.buildAWSArchitecture();
    } else if (mode === 'docker') {
      this.buildDockerMesh();
    }
  }

  // 1. KUBERNETES TOPOLOGY
  buildKubernetesCluster() {
    // Holographic Grid Floor
    const grid = new THREE.GridHelper(16, 16, 0x00f0ff, 0x1e1b4b);
    grid.position.y = -3.5;
    grid.material.transparent = true;
    grid.material.opacity = 0.35;
    this.stageGroup.add(grid);

    // Central Master Control Plane
    const masterGeo = new THREE.DodecahedronGeometry(1.6, 1);
    const masterMat = new THREE.MeshStandardMaterial({
      color: 0x0a192f,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false
    });
    this.masterNode = new THREE.Mesh(masterGeo, masterMat);
    this.masterNode.userData = {
      title: "Kubernetes Control Plane",
      role: "K8s API Server, etcd & Controller Manager",
      status: "Active (Master-01)",
      metrics: "CPU: 14% | RAM: 1.8GB | 99.99% Uptime"
    };
    this.interactiveObjects.push(this.masterNode);

    // Wireframe Cage around master
    const wireGeo = new THREE.DodecahedronGeometry(1.8, 1);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
    this.masterNode.add(new THREE.Mesh(wireGeo, wireMat));
    this.stageGroup.add(this.masterNode);

    // Orbiting Rings
    const ringGeo = new THREE.TorusGeometry(3.5, 0.03, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    this.stageGroup.add(ring1);

    const ring2 = ring1.clone();
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 4;
    ring2.material = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.6 });
    this.stageGroup.add(ring2);

    // Worker Pods
    const podNames = [
      { name: "Enterprise-CI-CD Pod", role: "Java Spring Boot API", port: "8080" },
      { name: "Trivy-Security-Pod", role: "Vulnerability Scanner Daemon", port: "8081" },
      { name: "React-Frontend Pod", role: "Client UI Layer", port: "3000" },
      { name: "Node-API Pod", role: "Express REST Microservice", port: "5000" },
      { name: "MySQL-Database Pod", role: "Persistent Relational Storage", port: "3306" },
      { name: "Nginx-Ingress Pod", role: "Edge Reverse Proxy & TLS", port: "443" }
    ];

    const podCount = podNames.length;
    this.workerPods = [];

    podNames.forEach((podData, i) => {
      const angle = (i / podCount) * Math.PI * 2;
      const radius = 4.2 + (i % 2) * 0.8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (i % 2 === 0 ? 1 : -1) * 1.2;

      const podGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const podMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0xa855f7,
        roughness: 0.3,
        metalness: 0.7
      });
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.position.set(x, y, z);

      // Wireframe overlay
      const pWire = new THREE.Mesh(podGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
      pod.add(pWire);

      pod.userData = {
        title: podData.name,
        role: podData.role,
        status: "Pod: Ready (1/1)",
        metrics: `Port: ${podData.port} | Health: 100% | Restart: 0`
      };

      this.interactiveObjects.push(pod);
      this.workerPods.push({ mesh: pod, baseAngle: angle, radius, elevation: y });
      this.stageGroup.add(pod);

      // Service Mesh Line connecting to Control Plane
      const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.35 });
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, z)
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      this.stageGroup.add(line);

      // Animated Data Packet traveling along line
      const packetGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      this.dataPackets.push({
        mesh: packet,
        start: new THREE.Vector3(0, 0, 0),
        end: new THREE.Vector3(x, y, z),
        progress: Math.random()
      });
      this.stageGroup.add(packet);
    });
  }

  // 2. AWS CLOUD ARCHITECTURE
  buildAWSArchitecture() {
    // 3 Layered Cloud Tiers (VPC Ground, ALB Layer, EC2 Layer, S3 Storage)
    const tiers = [
      { y: -2.5, size: 8, color: 0x00f0ff, label: "VPC Subnet Perimeter" },
      { y: 0.2, size: 6, color: 0xff9900, label: "ALB & Compute Tier" },
      { y: 2.8, size: 4, color: 0x34d399, label: "Edge & Route53" }
    ];

    tiers.forEach(tier => {
      const ringGeo = new THREE.RingGeometry(tier.size - 0.2, tier.size, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: tier.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y = tier.y;
      this.stageGroup.add(mesh);
    });

    // Top: Internet Gateway Diamond
    const igwGeo = new THREE.OctahedronGeometry(1.2, 0);
    const igwMat = new THREE.MeshStandardMaterial({
      color: 0xff9900,
      emissive: 0xff5500,
      roughness: 0.2,
      metalness: 0.9
    });
    const igw = new THREE.Mesh(igwGeo, igwMat);
    igw.position.set(0, 3.2, 0);
    igw.userData = {
      title: "AWS Internet Gateway (IGW)",
      role: "VPC Public Edge & Route53 DNS",
      status: "Status: Attached & Active",
      metrics: "Bandwidth: 100 Gbps | High Availability"
    };
    this.interactiveObjects.push(igw);
    this.stageGroup.add(igw);

    // Center: Application Load Balancer (ALB)
    const albGeo = new THREE.TorusGeometry(1.5, 0.25, 16, 50);
    const albMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0077b6,
      metalness: 0.8
    });
    const alb = new THREE.Mesh(albGeo, albMat);
    alb.rotation.x = Math.PI / 2;
    alb.position.set(0, 1.2, 0);
    alb.userData = {
      title: "AWS Application Load Balancer (ALB)",
      role: "HTTP/HTTPS Traffic Distribution & Health Checks",
      status: "Target Group: 100% Healthy",
      metrics: "Active Connections: 4,200 | Latency: 2.1ms"
    };
    this.interactiveObjects.push(alb);
    this.stageGroup.add(alb);

    // Auto Scaling EC2 Instances (4 instances)
    const ec2Names = ["EC2-Web-Node-1A", "EC2-Web-Node-1B", "EC2-App-Node-2A", "EC2-App-Node-2B"];
    this.ec2Nodes = [];

    ec2Names.forEach((name, i) => {
      const angle = (i / 4) * Math.PI * 2;
      const x = Math.cos(angle) * 3.2;
      const z = Math.sin(angle) * 3.2;

      const ec2Geo = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 16);
      const ec2Mat = new THREE.MeshStandardMaterial({
        color: 0xff9900,
        roughness: 0.3,
        metalness: 0.7
      });
      const ec2 = new THREE.Mesh(ec2Geo, ec2Mat);
      ec2.position.set(x, 0.0, z);

      ec2.userData = {
        title: name,
        role: "Auto Scaling EC2 Compute Instance (Multi-AZ)",
        status: "State: Running (i-03fae991)",
        metrics: "Type: t3.medium | AZ: us-east-1a"
      };

      this.interactiveObjects.push(ec2);
      this.ec2Nodes.push(ec2);
      this.stageGroup.add(ec2);
    });

    // Bottom: Amazon S3 Storage Bucket & DynamoDB
    const s3Geo = new THREE.CylinderGeometry(1.8, 1.8, 0.6, 32);
    const s3Mat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      metalness: 0.8
    });
    const s3 = new THREE.Mesh(s3Geo, s3Mat);
    s3.position.set(0, -2.2, 0);
    s3.userData = {
      title: "Amazon S3 & DynamoDB State",
      role: "Terraform State Locking & Object Storage",
      status: "Encryption: AWS-KMS Active",
      metrics: "Durability: 99.999999999% (11 9s)"
    };
    this.interactiveObjects.push(s3);
    this.stageGroup.add(s3);
  }

  // 3. DOCKER CONTAINER MESH
  buildDockerMesh() {
    // Floating Container Blocks
    const containers = [
      { name: "Dockerized Nginx Proxy", color: 0x00f0ff, y: 1.8, scale: [2.0, 0.9, 1.2], role: "Reverse Proxy & TLS", tag: "abhisheksaini/nginx:latest" },
      { name: "3-Tier React Frontend", color: 0x38bdf8, y: 0.4, scale: [2.2, 1.0, 1.4], role: "Client Interface", tag: "3tier-app-frontend:v1" },
      { name: "Node.js / Express API", color: 0xa855f7, y: -1.0, scale: [2.2, 1.0, 1.4], role: "Backend REST Controller", tag: "3tier-app-backend:v1" },
      { name: "MySQL Database Container", color: 0xff9900, y: -2.4, scale: [2.4, 1.1, 1.5], role: "Persistent Data Storage", tag: "mysql:8.0" }
    ];

    containers.forEach((c, idx) => {
      const geo = new THREE.BoxGeometry(c.scale[0], c.scale[1], c.scale[2]);
      const mat = new THREE.MeshStandardMaterial({
        color: c.color,
        roughness: 0.4,
        metalness: 0.8
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, c.y, 0);

      // Cyber wireframe edges
      const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }));
      mesh.add(wire);

      mesh.userData = {
        title: c.name,
        role: c.role,
        status: `Container: Running [Up 42 days]`,
        metrics: `Image: ${c.tag} | Network: bridge-isolated`
      };

      this.interactiveObjects.push(mesh);
      this.stageGroup.add(mesh);
    });
  }

  setupEvents() {
    // Mouse hover raycast
    this.mount.addEventListener('mousemove', (e) => {
      const rect = this.mount.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.checkHover();
    });

    // Click on 3D node
    this.mount.addEventListener('click', () => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.title) {
          sound.playSuccess();
          this.displayNodeModal(hit.userData);
        }
      }
    });

    // Resize
    window.addEventListener('resize', () => {
      const w = this.mount.clientWidth || 550;
      const h = this.mount.clientHeight || 450;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  checkHover() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, false);

    if (intersects.length > 0) {
      this.mount.style.cursor = 'pointer';
      const obj = intersects[0].object;
      if (obj.userData && obj.userData.title) {
        this.updateHUD(`SELECTED: ${obj.userData.title} // ${obj.userData.role}`, 'inspect');
      }
    } else {
      this.mount.style.cursor = 'grab';
    }
  }

  updateHUD(text, type = 'normal') {
    if (!this.hud) return;
    this.hud.innerHTML = `
      <span class="hud-pulse"></span>
      <span style="color: ${type === 'inspect' ? 'var(--neon-cyan)' : '#34d399'};">${text}</span>
    `;
  }

  displayNodeModal(data) {
    let modal = document.getElementById('node-3d-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'node-3d-modal';
      modal.className = 'node-3d-popup';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="node-popup-header">
        <span class="status-indicator"></span>
        <strong style="color: #fff;">${data.title}</strong>
        <button id="close-node-popup-btn">&times;</button>
      </div>
      <div class="node-popup-body">
        <div style="color: var(--neon-cyan); margin-bottom: 0.4rem;">${data.role}</div>
        <div style="color: #34d399; font-size: 0.8rem; margin-bottom: 0.4rem;">✓ ${data.status}</div>
        <div style="color: var(--text-dim); font-size: 0.78rem; font-family: var(--font-mono);">${data.metrics}</div>
      </div>
    `;

    modal.style.display = 'block';

    const closeBtn = document.getElementById('close-node-popup-btn');
    if (closeBtn) {
      closeBtn.onclick = () => { modal.style.display = 'none'; };
    }
  }

  resetCamera() {
    this.camera.position.set(0, 5, 14);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    sound.playClick();
  }

  toggleAutoRotate() {
    this.controls.autoRotate = !this.controls.autoRotate;
    sound.playClick();
    return this.controls.autoRotate;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    this.controls.update();

    // Kubernetes mode animations
    if (this.currentMode === 'k8s') {
      if (this.masterNode) {
        this.masterNode.rotation.y = elapsedTime * 0.4;
        this.masterNode.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;
      }

      // Worker Pods subtle bobbing
      if (this.workerPods) {
        this.workerPods.forEach((podInfo, idx) => {
          podInfo.mesh.position.y = podInfo.elevation + Math.sin(elapsedTime * 2 + idx) * 0.25;
          podInfo.mesh.rotation.y += 0.02;
        });
      }

      // Data packets moving along lines
      this.dataPackets.forEach(pkt => {
        pkt.progress = (pkt.progress + delta * 0.6) % 1.0;
        pkt.mesh.position.lerpVectors(pkt.start, pkt.end, pkt.progress);
      });
    }

    // AWS mode animations
    if (this.currentMode === 'aws') {
      if (this.ec2Nodes) {
        this.ec2Nodes.forEach((node, i) => {
          node.rotation.y += 0.03;
        });
      }
    }

    // Docker mode animations
    if (this.currentMode === 'docker') {
      if (this.stageGroup) {
        this.stageGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.2;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
