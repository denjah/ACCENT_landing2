/**
 * MOUSE ENGINEERING GRID — Модуль интерактивной сетки «Акцент»
 * 
 * Реализует эффект «чертежа», который реагирует на движение мыши.
 * Использует Canvas 2D для отрисовки сетки из крестиков и точек.
 */

export class MouseEngineeringGrid {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Настройки сетки (константы)
        this.gridSize = 40;       // Шаг сетки в пикселях
        this.crossSize = 3;       // Размер плеча крестика
        this.dotSize = 1;         // Размер точки

        // Параметры анимации
        this.mouse = { x: -1000, y: -1000 };
        this.targetMouse = { x: -1000, y: -1000 };
        this.trail = [];          // След истории мыши
        this.trailLength = 6;     // Длина следа
        this.opacity = 0;         // Текущая прозрачность (для fade-in/out)
        this.targetOpacity = 0;

        // Цвета из CSS variables (будут обновлены при отрисовке)
        this.colors = {
            base: 'rgba(206, 212, 210, 0.12)', // --gray-400
            active: 'rgba(206, 212, 210, 0.25)',
            accent: 'rgba(196, 30, 58, 0.1)'   // --brand-red-500
        };

        this.init();
    }

    init() {
        // Подготовка canvas
        this.canvas.classList.add('mouse-grid-canvas');
        this.container.style.position = 'relative';
        this.container.prepend(this.canvas);

        this.setColors();

        this.resize();
        window.addEventListener('resize', () => {
            this.setColors();
            this.resize();
        });

        // Слушатели событий
        this.container.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.container.addEventListener('mouseenter', () => this.targetOpacity = 1);
        this.container.addEventListener('mouseleave', () => {
            this.targetOpacity = 0;
            this.targetMouse = { x: -1000, y: -1000 };
        });

        // Проверка prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!motionQuery.matches) {
            this.animate();
        }
    }

    setColors() {
        const rootStyle = getComputedStyle(document.documentElement);
        // Для адаптации под темные блоки, берем текущий цвет текста контейнера
        const containerStyle = getComputedStyle(this.container);
        this.baseColor = containerStyle.color || '#868E96';
        this.brandRedColor = rootStyle.getPropertyValue('--brand-red-500').trim() || '#C41E3A';
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.draw();
    }

    handleMouseMove(e) {
        const rect = this.container.getBoundingClientRect();
        this.targetMouse.x = e.clientX - rect.left;
        this.targetMouse.y = e.clientY - rect.top;
    }

    /**
     * Плавная интерполяция значений для мягких движений
     */
    update() {
        // Плавное следование за мышью
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.15;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.15;

        // Обновление trail
        this.trail.unshift({ x: this.mouse.x, y: this.mouse.y });
        if (this.trail.length > this.trailLength) {
            this.trail.pop();
        }

        // Плавный fade in / out
        this.opacity += (this.targetOpacity - this.opacity) * 0.1;
    }

    draw() {
        if (this.opacity < 0.01 && this.targetOpacity === 0) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        ctx.lineWidth = 1;

        // Отрисовка сетки
        for (let x = 0; x <= w; x += this.gridSize) {
            for (let y = 0; y <= h; y += this.gridSize) {

                // Рассчитываем влияние мыши (и её следа) на конкретный узел сетки
                let influence = 0;
                this.trail.forEach((pos, index) => {
                    const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
                    const force = Math.max(0, 1 - dist / 150);
                    // Чем старее позиция в trail, тем меньше влияние
                    const trailDecay = (this.trailLength - index) / this.trailLength;
                    influence = Math.max(influence, force * trailDecay);
                });

                // Увеличенная базовая контрастность (была 0.08)
                const baseAlpha = 0.14 * this.opacity;
                const activeAlpha = 0.40 * this.opacity;
                const alpha = baseAlpha + (activeAlpha - baseAlpha) * influence;

                // Рисуем крестик (+) в узле
                ctx.strokeStyle = this.baseColor;
                ctx.globalAlpha = alpha;

                // Если влияние сильное — добавляем легкий красный акцент
                if (influence > 0.6) {
                    ctx.strokeStyle = this.brandRedColor;
                    ctx.globalAlpha = alpha * 0.6; // повысили контраст акцента
                }

                ctx.beginPath();
                // Горизонтальная линия крестика
                ctx.moveTo(x - this.crossSize, y);
                ctx.lineTo(x + this.crossSize, y);
                // Вертикальная линия крестика
                ctx.moveTo(x, y - this.crossSize);
                ctx.lineTo(x, y + this.crossSize);
                ctx.stroke();

                // Рисуем малый крестик в середине квадрата сетки (вместо точки)
                const dotX = x + this.gridSize / 2;
                const dotY = y + this.gridSize / 2;
                if (dotX < w && dotY < h) {
                    ctx.globalAlpha = baseAlpha * 0.7; // малый крестик чуть тусклее основного
                    ctx.strokeStyle = this.baseColor; // обязательно возвращаем базовый цвет
                    ctx.beginPath();
                    const smCross = 1.5;
                    ctx.moveTo(dotX - smCross, dotY);
                    ctx.lineTo(dotX + smCross, dotY);
                    ctx.moveTo(dotX, dotY - smCross);
                    ctx.lineTo(dotX, dotY + smCross);
                    ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Авто-инициализация для всех блоков с data-mouse-grid
function initGrid() {
    const containers = document.querySelectorAll('[data-mouse-grid="true"]');
    containers.forEach(container => new MouseEngineeringGrid(container));
}

// Т.к. скрипт подключен как type="module", DOMContentLoaded мог уже сработать
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrid);
} else {
    initGrid();
}
