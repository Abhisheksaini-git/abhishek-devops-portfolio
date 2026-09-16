import * as THREE from 'three';

export class CyberpunkScene {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.clock = new THREE.Clock();

    this.init();
    this.createBackgroundParticles();
    this.createDevOpsCluster();
    this.createCloudNetworkGrid();
    this.setupEventListeners();
    this.animate();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x060813, 0.015);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 18);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.container.appendChild(this.renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0x0d1b2a, 1.5);
    this.scene.add(ambientLight);

    // Cyan Key Light
    this.cyanLight = new THREE.PointLight(0x00f0ff, 3, 50);
    this.cyanLight.position.set(10, 10, 10);
    this.scene.add(this.cyanLight);

    // Violet Accent Light
    this.violetLight = new THREE.PointLight(0xa855f7, 3.5, 50);
    this.violetLight.position.set(-10, -8, 8);
    this.scene.add(this.violetLight);

    // Emerald Edge Light
    this.emeraldLight = new THREE.PointLight(0x10b981, 2, 40);
    this.emeraldLight.position.set(0, -12, -5);
    this.scene.add(this.emeraldLight);
  }

  createBackgroundParticles() {
    const count = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const cyan = new THREE.Color(0x00f0ff);
    const violet = new THREE.Color(0x8b5cf6);
    const emerald = new THREE.Color(0x10b981);
    const white = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      // Cylindrical / volumetric distribution
      const r = 10 + Math.random() * 45;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 80;

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = Math.sin(theta) * r;
      positions[i * 3 + 2] = z;

      // Assign cyberpunk palette colors
      const rand = Math.random();
      let color = cyan;
      if (rand < 0.4) color = cyan;
      else if (rand < 0.75) color = violet;
      else if (rand < 0.9) color = emerald;
      else color = white;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      scales[i] = Math.random() * 2 + 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Canvas particle texture for smooth circular glow
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.8)');
    grad.addColorStop(0.7, 'rgba(139, 92, 246, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.6,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createDevOpsCluster() {
    this.devopsGroup = new THREE.Group();
    this.scene.add(this.devopsGroup);

    // Central Core: Kubernetes Control Plane (Wireframe Icosahedron + Inner Glowing Core)
    const coreGeo = new THREE.IcosahedronGeometry(3.2, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.devopsGroup.add(this.coreMesh);

    // Inner glowing sphere (Nucleus)
    const innerGeo = new THREE.SphereGeometry(2.0, 32, 32);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x111e38,
      emissive: 0x004777,
      specular: 0x00f0ff,
      shininess: 90,
      wireframe: false,
      transparent: true,
      opacity: 0.85
    });
    this.innerCore = new THREE.Mesh(innerGeo, innerMat);
    this.devopsGroup.add(this.innerCore);

    // Orbiting Rings (CI/CD Pipeline & AWS VPC Boundary)
    this.rings = [];
    const ringRadii = [4.8, 6.2, 7.6];
    const ringColors = [0x00f0ff, 0xa855f7, 0x10b981];

    ringRadii.forEach((radius, idx) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.035, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[idx],
        transparent: true,
        opacity: 0.6,
        wireframe: false
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / (2.2 + idx * 0.4);
      ring.rotation.y = idx * 0.6;
      this.rings.push(ring);
      this.devopsGroup.add(ring);
    });

    // Satellite Nodes: Representing Pods, Containers, and Microservices
    this.satelliteNodes = [];
    const nodeCount = 10;
    const nodeGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const dist = 5.2 + (i % 3) * 1.2;
      const nodeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0xa855f7,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: false
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      
      // Wireframe overlay for tech look
      const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
      const wire = new THREE.Mesh(nodeGeo, wireMat);
      node.add(wire);

      node.userData = {
        baseAngle: angle,
        orbitRadius: dist,
        orbitSpeed: 0.4 + (i % 4) * 0.15,
        elevation: (i % 2 === 0 ? 1 : -1) * (1.2 + (i % 3) * 0.6),
        pulseSpeed: 2 + i * 0.3
      };

      this.satelliteNodes.push(node);
      this.devopsGroup.add(node);
    }

    // Dynamic Connection Lines (Kubernetes Service Mesh Lines)
    const lineCount = 12;
    this.connectionLines = [];
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4
    });

    for (let i = 0; i < lineCount; i++) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0)
      ]);
      const line = new THREE.Line(lineGeo, lineMaterial);
      this.connectionLines.push(line);
      this.devopsGroup.add(line);
    }
  }

  createCloudNetworkGrid() {
    // Subtle cybernetic floor grid far below
    const gridHelper = new THREE.GridHelper(80, 50, 0x00f0ff, 0x1e1b4b);
    gridHelper.position.y = -12;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.25;
    this.scene.add(gridHelper);
    this.cyberGrid = gridHelper;
  }

  setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    window.addEventListener('scroll', () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        this.scrollProgress = window.scrollY / scrollHeight;
      }
    }, { passive: true });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth cursor interpolation (lerp)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Rotate core mesh & rings
    if (this.coreMesh) {
      this.coreMesh.rotation.x = elapsedTime * 0.2 + this.mouse.y * 0.3;
      this.coreMesh.rotation.y = elapsedTime * 0.35 + this.mouse.x * 0.5;
    }

    if (this.innerCore) {
      this.innerCore.rotation.y = -elapsedTime * 0.15;
      const pulse = 1 + Math.sin(elapsedTime * 3) * 0.04;
      this.innerCore.scale.set(pulse, pulse, pulse);
    }

    this.rings.forEach((ring, index) => {
      const dir = index % 2 === 0 ? 1 : -1;
      ring.rotation.z += delta * (0.3 + index * 0.15) * dir;
      ring.rotation.x += delta * 0.1 * dir;
    });

    // Update Orbiting Satellite Nodes
    this.satelliteNodes.forEach((node, i) => {
      const { baseAngle, orbitRadius, orbitSpeed, elevation } = node.userData;
      const curAngle = baseAngle + elapsedTime * orbitSpeed * 0.5;
      const x = Math.cos(curAngle) * orbitRadius;
      const z = Math.sin(curAngle) * orbitRadius;
      const y = Math.sin(elapsedTime * 1.5 + i) * 0.8 + elevation;

      node.position.set(x, y, z);
      node.rotation.x += 0.02;
      node.rotation.y += 0.03;

      // Update connection line to core
      if (this.connectionLines[i]) {
        const positions = this.connectionLines[i].geometry.attributes.position.array;
        // Point 1: Node
        positions[0] = x;
        positions[1] = y;
        positions[2] = z;
        // Point 2: Core surface
        positions[3] = (x / orbitRadius) * 2.2;
        positions[4] = (y / (Math.abs(elevation) + 1)) * 1.5;
        positions[5] = (z / orbitRadius) * 2.2;
        this.connectionLines[i].geometry.attributes.position.needsUpdate = true;
      }
    });

    // Slowly drift particles
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.03;
      this.particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;
    }

    // Dynamic Camera and Cluster Movement based on scroll & mouse
    const scrollTargetY = -this.scrollProgress * 14;
    const scrollTargetZ = 18 - this.scrollProgress * 6;
    const scrollClusterX = Math.sin(this.scrollProgress * Math.PI) * 4;

    this.camera.position.x += (this.mouse.x * 2 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.mouse.y * 1.5 + scrollTargetY * 0.2 - this.camera.position.y) * 0.05;
    this.camera.position.z += (scrollTargetZ - this.camera.position.z) * 0.05;
    this.camera.lookAt(0, scrollTargetY * 0.3, 0);

    if (this.devopsGroup) {
      this.devopsGroup.position.x += (scrollClusterX - this.devopsGroup.position.x) * 0.05;
      this.devopsGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.4;
    }

    // Lights follow mouse slightly
    this.cyanLight.position.x = 10 + this.mouse.x * 6;
    this.cyanLight.position.y = 10 + this.mouse.y * 6;
    this.violetLight.position.x = -10 - this.mouse.x * 6;

    this.renderer.render(this.scene, this.camera);
  }
}
