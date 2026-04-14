import * as THREE from 'three';

/**
 * BackgroundParticlesV2 — Глобальная фоновая система частиц.
 * Теперь перемещается ВНУТРЬ секций для правильного наложения слоев.
 */
class BackgroundParticlesV2 {
    constructor() {
        this.container = document.createElement('div');
        this.container.id = 'global-particles-bg';
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.zIndex = '0'; // За фоном контента, но перед фоном блока
        this.container.style.pointerEvents = 'none';
        this.container.style.opacity = '0';
        this.container.style.transition = 'opacity 1.5s ease-in-out';

        this.COUNT = 15000; // Немного меньше для лучшей производительности
        this.modes = {
            dark: ['PCB_FLOW', 'SOLDER_POINTS'],
            light: ['ETCHED_TRACES', 'NODE_FIELD']
        };
        this.currentMode = 'PCB_FLOW';
        this.currentContext = 'dark';
        this.isActive = false;

        this.init();
        this.setupIntersectionObserver();
    }

    init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.set(0, 0, 100);

        // Alpha: true is critical for seeing section background
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        this.renderer.setClearColor(0x000000, 0); // Transparent clear
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        const geometry = new THREE.TetrahedronGeometry(0.25);
        // Using additive blending if needed, but MeshBasic with transparency is safer for muted look
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });

        this.instancedMesh = new THREE.InstancedMesh(geometry, this.material, this.COUNT);
        this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.scene.add(this.instancedMesh);

        this.positions = [];
        this.targets = [];
        this.colors = [];
        for (let i = 0; i < this.COUNT; i++) {
            this.positions.push(new THREE.Vector3((Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200));
            this.targets.push(new THREE.Vector3());
            this.colors.push(new THREE.Color());
        }

        // Bloom removed for absolute transparency safety in background
        this.clock = new THREE.Clock();
        this.dummy = new THREE.Object3D();

        window.addEventListener('resize', () => this.onResize());
        this.animate();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            let activeEntry = null;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    activeEntry = entry;
                }
            });

            if (activeEntry) {
                const context = activeEntry.target.getAttribute('data-has-particles');

                // Перемещаем контейнер в текущую секцию
                if (this.container.parentElement !== activeEntry.target) {
                    this.switchMode(context);
                    activeEntry.target.style.position = 'relative';
                    activeEntry.target.style.overflow = 'hidden';
                    activeEntry.target.prepend(this.container);
                    this.onResize(); // Рефреш размеров под новый контейнер
                }

                this.isActive = true;
                this.container.style.opacity = '1';
            } else {
                // Плавное скрытие, если ничего не пересекается
                const anyVisible = Array.from(document.querySelectorAll('[data-has-particles]'))
                    .some(el => {
                        const rect = el.getBoundingClientRect();
                        return rect.top < window.innerHeight && rect.bottom > 0;
                    });

                if (!anyVisible) {
                    this.isActive = false;
                    this.container.style.opacity = '0';
                }
            }
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-has-particles]').forEach(el => {
            // Убеждаемся, что контент секции выше частиц
            const content = el.querySelector('.wide-container');
            if (content) {
                content.style.position = 'relative';
                content.style.zIndex = '2';
            }
            this.observer.observe(el);
        });
    }

    switchMode(context) {
        this.currentContext = (context === 'light' || context === 'dark') ? context : 'dark';
        const modeList = this.modes[this.currentContext];
        this.currentMode = modeList[Math.floor(Math.random() * modeList.length)];
    }

    updatePhysics(time) {
        const tempTarget = new THREE.Vector3();
        const tempColor = new THREE.Color();

        for (let i = 0; i < this.COUNT; i++) {
            switch (this.currentMode) {
                case 'PCB_FLOW': this.modePCBFlow(i, time, tempTarget, tempColor); break;
                case 'SOLDER_POINTS': this.modeSolderPoints(i, time, tempTarget, tempColor); break;
                case 'ETCHED_TRACES': this.modeEtchedTraces(i, time, tempTarget, tempColor); break;
                case 'NODE_FIELD': this.modeNodeField(i, time, tempTarget, tempColor); break;
            }

            this.positions[i].lerp(tempTarget, 0.08);
            this.dummy.position.copy(this.positions[i]);
            this.dummy.updateMatrix();
            this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
            this.instancedMesh.setColorAt(i, tempColor);
        }

        this.instancedMesh.instanceMatrix.needsUpdate = true;
        this.instancedMesh.instanceColor.needsUpdate = true;
    }

    modePCBFlow(i, time, target, color) {
        const speed = 0.12;
        const phase = time * speed + i * 0.0008;
        const radius = 180 + Math.sin(i * 0.017 + time * 0.07) * 10;
        target.set(Math.cos(phase * 0.6 + i * 0.0003) * radius, Math.sin(phase * 0.6 + i * 0.0003) * radius * 0.7, (i % 180 - 90) * 1.6);
        const b = 0.2 + Math.sin(phase * 4 + i) * 0.05;
        color.setRGB(b, b, b); // Темно-серые (на темном фоне)
    }

    modeSolderPoints(i, time, target, color) {
        const gridX = (i % 100) - 50;
        const gridY = Math.floor(i / 100) - 50;
        const dist = Math.sqrt(gridX * gridX + gridY * gridY);
        target.set(gridX * 5, gridY * 4 + Math.sin(time * 0.2 + i * 0.01) * 10, dist * 0.5);
        const a = Math.max(0.1, 0.4 - dist / 80);
        color.setRGB(a * 0.5, a * 0.5, a * 0.5); // Темно-серые
    }

    modeEtchedTraces(i, time, target, color) {
        const t = time * 0.1 + i * 0.001;
        target.set(Math.sin(t * 0.8) * 200, Math.cos(t * 1.1) * 150, Math.sin(i * 0.008 + time) * 30);
        const l = 0.7 + Math.sin(t * 5) * 0.1;
        color.setRGB(l, l, l); // Серые (на светлом фоне)
    }

    modeNodeField(i, time, target, color) {
        const nx = (i % 80) * 5 - 200;
        const ny = Math.floor(i / 80) * 5 - 200;
        const nDist = Math.hypot(nx, ny);
        target.set(nx, ny + Math.sin(time * 0.3 + i * 0.01) * 15, Math.sin(time + i * 0.01) * 20);
        const s = Math.max(0.5, 0.8 - nDist / 200);
        color.setRGB(s, s, s); // Серые
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        if (!this.isActive && parseFloat(this.container.style.opacity) < 0.01) return;
        this.updatePhysics(this.clock.getElapsedTime());
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        if (!this.container.parentElement) return;
        const w = this.container.parentElement.clientWidth;
        const h = this.container.parentElement.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.bgParticles = new BackgroundParticlesV2();
});
