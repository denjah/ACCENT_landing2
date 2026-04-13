import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/**
 * Particles Swarm — Accent Multi-Mode Industrial Edition
 * Переключение между режимами: M01 (Flows), M02 (Blueprint), M03 (PCB Grid)
 */

class ParticlesBackground {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.init();
    }

    init() {
        const style = getComputedStyle(document.documentElement);
        this.colors = {
            accent: style.getPropertyValue('--particle-accent').trim() || '#C41E3A',
            base: style.getPropertyValue('--particle-base').trim() || '#868E96',
            opacity: parseFloat(style.getPropertyValue('--particle-opacity')) || 0.12,
            speed: parseFloat(style.getPropertyValue('--particle-speed')) || 0.1,
            bloom: parseFloat(style.getPropertyValue('--particle-bloom')) || 0.5
        };

        this.COUNT = 15000;
        this.modes = ['M01', 'M02', 'M03'];
        this.currentMode = 'M02';
        this.targetMode = 'M02';
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // Scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, this.container.clientWidth / this.container.clientHeight, 0.1, 2000);
        this.camera.position.set(0, 0, 120);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        this.setupSwarm();
        this.setupPostProcessing();

        this.clock = new THREE.Clock();
        this.lastSwitch = 0;
        this.animate();

        window.addEventListener('resize', () => this.onResize());

        // Timer for mode switching
        setInterval(() => this.randomizeMode(), 10000);
    }

    setupSwarm() {
        const geometry = new THREE.TetrahedronGeometry(0.25);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: this.colors.opacity });

        this.instancedMesh = new THREE.InstancedMesh(geometry, material, this.COUNT);
        this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.scene.add(this.instancedMesh);

        this.positions = [];
        this.targets = [];
        this.particleColors = [];

        for (let i = 0; i < this.COUNT; i++) {
            const p = new THREE.Vector3((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200);
            this.positions.push(p);
            this.targets.push(new THREE.Vector3().copy(p));
            this.particleColors.push(new THREE.Color(this.colors.base));
        }
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
            this.colors.bloom, 0.4, 0.85
        );
        this.bloomPass.strength = this.colors.bloom;
        this.composer.addPass(this.bloomPass);
    }

    randomizeMode() {
        if (this.reducedMotion) return;
        const available = this.modes.filter(m => m !== this.currentMode);
        this.targetMode = available[Math.floor(Math.random() * available.length)];
        this.currentMode = this.targetMode;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        const time = this.clock.getElapsedTime();
        const sTime = time * this.colors.speed;

        const dummy = new THREE.Object3D();
        const spread = 160;

        // Logic branching per mode
        for (let i = 0; i < this.COUNT; i++) {
            let tx, ty, tz;
            let targetColor = this.colors.base;

            if (this.currentMode === 'M01') {
                // M01: Signal Schematic / Flows
                const cols = Math.ceil(Math.sqrt(this.COUNT * 1.6));
                const col = i % cols;
                const row = Math.floor(i / cols);
                const nx = (col / (cols - 1)) - 0.5;
                const ny = (row / (Math.floor(this.COUNT / cols) + 1)) - 0.5;

                tx = nx * spread;
                ty = ny * spread * 0.62;

                const isTrace = (col % 6 === 0 || row % 6 === 0);
                const flow = Math.sin(sTime * 4 + col * 0.18 + row * 0.24) * 0.5 + 0.5;
                const isActive = isTrace && flow > 0.8;

                tz = isTrace ? Math.sin(sTime + i * 0.01) * 2 : -5;
                if (isActive) targetColor = this.colors.accent;

            } else if (this.currentMode === 'M02') {
                // M02: Microchip Blueprint (Grid based)
                const cols = Math.max(2, (spread * 0.15) | 0);
                const col = i % cols;
                const row = (i / cols) | 0;
                const u = col / (cols - 1);
                const v = row / (Math.floor(this.COUNT / cols));

                tx = (u - 0.5) * spread * 2;
                ty = (v - 0.5) * spread * 2;

                const mask = Math.sin(col * 12.98 + row * 78.23);
                const isNode = Math.abs(mask) > 0.72;
                const activity = Math.pow(0.5 + 0.5 * Math.sin(col * 0.1 + row * 0.1 - sTime * 10), 10);

                tz = isNode ? activity * 10 : 0;
                if (isNode && activity > 0.5) targetColor = this.colors.accent;

            } else {
                // M03: PCB Engineering Grid (Cold/Subtle)
                const gridSpacing = 4;
                const cols = Math.ceil(Math.sqrt(this.COUNT));
                const col = i % cols;
                const row = Math.floor(i / cols);

                tx = (col - cols * 0.5) * gridSpacing;
                ty = (row - cols * 0.5) * gridSpacing;

                const isNode = (row % 8 === 0 && col % 8 === 0);
                const isTrace = (row % 8 === 0 || col % 8 === 0);

                tz = isNode ? Math.sin(sTime * 2 + i) * 5 : (isTrace ? -2 : -10);
                if (isNode && Math.sin(sTime * 5 + i * 0.5) > 0.9) targetColor = this.colors.accent;
            }

            this.targets[i].set(tx, ty, tz);
            this.positions[i].lerp(this.targets[i], 0.05);

            dummy.position.copy(this.positions[i]);
            dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i, dummy.matrix);

            // Плавная смена цвета
            const c = new THREE.Color(targetColor);
            this.particleColors[i].lerp(c, 0.1);
            this.instancedMesh.setColorAt(i, this.particleColors[i]);
        }

        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.instancedMesh.instanceColor.needsUpdate = true;

        if (!this.reducedMotion) {
            this.scene.rotation.y += delta * 0.05;
            this.scene.rotation.x += delta * 0.02;
        }

        this.composer.render();
    }

    onResize() {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        this.composer.setSize(w, h);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticlesBackground('particles-background');
});
