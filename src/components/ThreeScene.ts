import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Invert color shader
const InvertColorShader = {
    uniforms: {
        tDiffuse: { value: null }
    },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
            vec4 color = texture2D(tDiffuse, vUv);
            gl_FragColor = vec4(1.0 - color.rgb, color.a);
        }
    `
};

// Custom shaders for particles (currently unused - stars use PointsMaterial)
// These could be used for more advanced particle effects in the future

// Shader for the background grid
const gridVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const gridFragmentShader = `
  uniform float time;
  uniform float scroll;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    // Animate grid by offsetting vUv.y with scroll
    vec2 uv = vUv * 20.0;
    uv.y += scroll;
    vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
    float line = min(grid.x, grid.y);
    float opacity = 1.0 - min(line, 1.0);
    opacity *= 0.35;
    vec3 color = vec3(0.0, 0.85, 1.0) * opacity;
    gl_FragColor = vec4(color, opacity);
  }
`;

export default class ThreeScene {
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;
    private composer!: EffectComposer;
    private invertPass!: ShaderPass;
    private grid!: THREE.Mesh;
    private topGrid!: THREE.Mesh;
    private clock: THREE.Clock;
    private cameraTarget = { x: 0, y: 0 };
    private scroll: number = 0;
    private hudRing!: THREE.Mesh;
    private hudGlow!: THREE.Mesh;
    private speedLines: THREE.Mesh[] = [];
    private stars!: THREE.Points;

    constructor(container: HTMLElement) {
        this.clock = new THREE.Clock();
        this.initScene(container);
        this.createGrid();
        this.addHUD();
        this.addSpeedLines();
        this.addStars();
        this.setupPostProcessing();
        this.setupThemeObserver();
        this.addMouseControls(container);
        this.animate();
    }

    private initScene(container: HTMLElement) {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Let parent background show

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5; // Zoom in

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true // Allow parent background
        });
        this.renderer.setClearColor(0x000000, 0); // Fully transparent
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;

        container.appendChild(this.renderer.domElement);

        // Handle resize
        window.addEventListener('resize', () => {
            this.camera.aspect = container.clientWidth / container.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            this.composer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    private createGrid() {
        const gridGeometry = new THREE.PlaneGeometry(10, 30, 50, 150);
        const gridMaterial = new THREE.ShaderMaterial({
            vertexShader: gridVertexShader,
            fragmentShader: gridFragmentShader,
            uniforms: {
                time: { value: 0 },
                scroll: { value: 0 }
            },
            transparent: true,
            side: THREE.DoubleSide
        });

        // Bottom grid (tunnel floor)
        this.grid = new THREE.Mesh(gridGeometry, gridMaterial);
        this.grid.rotation.x = -Math.PI / 2;
        this.grid.position.y = -2.5;
        this.scene.add(this.grid);

        // Top grid (tunnel ceiling)
        this.topGrid = new THREE.Mesh(gridGeometry, gridMaterial.clone());
        this.topGrid.rotation.x = Math.PI / 2;
        this.topGrid.position.y = 2.5;
        this.scene.add(this.topGrid);
    }

    private setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom effect
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.0,  // strength (much higher)
            1.0,  // radius
            0.7   // threshold (lower for more bloom)
        );
        this.composer.addPass(bloomPass);

        // Invert color pass (added/removed based on theme)
        this.invertPass = new ShaderPass(InvertColorShader);
        this.updateInvertPass();
    }

    private setupThemeObserver() {
        const observer = new MutationObserver(() => this.updateInvertPass());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    private updateInvertPass() {
        const theme = document.documentElement.getAttribute('data-theme');
        const hasInvert = this.composer.passes.includes(this.invertPass);
        if (theme === 'light' && !hasInvert) {
            this.composer.addPass(this.invertPass);
        } else if (theme !== 'light' && hasInvert) {
            this.composer.passes = this.composer.passes.filter(p => p !== this.invertPass);
        }
    }

    private addHUD() {
        // Glowing ring/reticle at the center (HUD)
        const ringGeometry = new THREE.RingGeometry(0.18, 0.22, 48);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
        this.hudRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.hudRing.position.set(0, 0, -1.2);
        this.scene.add(this.hudRing);
        // Glow ring
        const glowGeometry = new THREE.RingGeometry(0.24, 0.32, 48);
        const glowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
        this.hudGlow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.hudGlow.position.set(0, 0, -1.21);
        this.scene.add(this.hudGlow);
    }

    private addSpeedLines() {
        // Create 32 speed lines
        for (let i = 0; i < 32; i++) {
            const geom = new THREE.CylinderGeometry(0.01, 0.01, 1.2, 6);
            const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
            const line = new THREE.Mesh(geom, mat);
            line.position.x = (Math.random() - 0.5) * 7;
            line.position.y = (Math.random() - 0.5) * 3.5;
            line.position.z = -Math.random() * 18 - 2;
            line.rotation.x = Math.PI / 2;
            this.scene.add(line);
            this.speedLines.push(line);
        }
    }

    private addStars() {
        // Starfield: 200 points
        const starGeom = new THREE.BufferGeometry();
        const starCount = 200;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const r = 8 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const y = (Math.random() - 0.5) * 8;
            positions[i * 3] = Math.cos(theta) * r;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = -Math.random() * 30;
        }
        starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        // Create a circular star texture (always white)
        const starCanvas = document.createElement('canvas');
        starCanvas.width = 32; starCanvas.height = 32;
        const ctx = starCanvas.getContext('2d')!;
        ctx.clearRect(0, 0, 32, 32);
        ctx.beginPath();
        ctx.arc(16, 16, 14, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        const starTexture = new THREE.Texture(starCanvas);
        starTexture.needsUpdate = true;
        const starMat = new THREE.PointsMaterial({
            map: starTexture,
            size: 0.18,
            transparent: true,
            alphaTest: 0.1,
            opacity: 0.8,
            color: 0xffffff
        });
        this.stars = new THREE.Points(starGeom, starMat);
        this.scene.add(this.stars);
    }

    private addMouseControls(container: HTMLElement) {
        container.addEventListener('mousemove', (event) => {
            const rect = container.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;
            // Map to -1 to 1
            this.cameraTarget.x = (x - 0.5) * 2;
            this.cameraTarget.y = (0.5 - y) * 2;
        });
    }

    private animate() {
        requestAnimationFrame(() => this.animate());

        const time = this.clock.getElapsedTime();
        this.scroll += 0.08; // Speed of tunnel movement

        // Update grid shader uniforms
        if (this.grid.material instanceof THREE.ShaderMaterial) {
            this.grid.material.uniforms.time.value = time;
            this.grid.material.uniforms.scroll.value = this.scroll;
        }
        if (this.topGrid && this.topGrid.material instanceof THREE.ShaderMaterial) {
            this.topGrid.material.uniforms.time.value = time;
            this.topGrid.material.uniforms.scroll.value = this.scroll;
        }

        // Camera is the jet: move/tilt based on mouse
        const targetX = this.cameraTarget.x * 3;
        const targetY = this.cameraTarget.y * 1.5;
        this.camera.position.x += (targetX - this.camera.position.x) * 0.12;
        this.camera.position.y += (targetY - this.camera.position.y) * 0.12;
        this.camera.position.z = 0;
        // Camera tilt for immersion
        this.camera.rotation.z = -this.camera.position.x * 0.08;
        this.camera.lookAt(0, 0, -2);
        // Keep HUD ring and glow always in front of camera
        this.hudRing.position.set(this.camera.position.x, this.camera.position.y, -1.2);
        this.hudGlow.position.set(this.camera.position.x, this.camera.position.y, -1.21);

        // Animate speed lines
        for (const line of this.speedLines) {
            line.position.z += 0.7;
            if (line.position.z > 1) {
                line.position.x = (Math.random() - 0.5) * 7;
                line.position.y = (Math.random() - 0.5) * 3.5;
                line.position.z = -Math.random() * 18 - 2;
            }
        }
        // Animate stars (parallax)
        if (this.stars) {
            const pos = this.stars.geometry.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                pos.array[i * 3 + 2] += 0.12;
                if (pos.array[i * 3 + 2] > 1) {
                    const r = 8 + Math.random() * 8;
                    const theta = Math.random() * Math.PI * 2;
                    const y = (Math.random() - 0.5) * 8;
                    pos.array[i * 3] = Math.cos(theta) * r;
                    pos.array[i * 3 + 1] = y;
                    pos.array[i * 3 + 2] = -30;
                }
            }
            pos.needsUpdate = true;
        }

        this.composer.render();
    }

    public dispose() {
        this.renderer.dispose();
        this.scene.clear();
    }
} 