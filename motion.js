let mouseX = 0;
let mouseY = 0;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const DEBUG_MODE = false; // Changed to false to disable the broken debug mode

const AUTO_ANIMATION = true;

const bgShapes = document.querySelectorAll('.shape');
const avatar = document.querySelector('.profile-avatar');
const cards = document.querySelectorAll('.link-card');

const smoothing = 0.1;

let currentX = 0;
let currentY = 0;

let autoAnimationPhase = 0;
let lastAutoUpdate = 0;

function updateMousePosition(e) {
    mouseX = e.clientX || (e.touches && e.touches[0].clientX) || windowWidth / 2;
    mouseY = e.clientY || (e.touches && e.touches[0].clientY) || windowHeight / 2;

    if (DEBUG_MODE) {
        updateDebugInfo();
    }
}

function handleOrientation(e) {
    if (Date.now() - lastMouseMove > 100) {
        const beta = e.beta || 0;
        const gamma = e.gamma || 0;

        mouseX = windowWidth / 2 + (gamma / 90) * (windowWidth / 3);
        mouseY = windowHeight / 2 + (beta / 180) * (windowHeight / 3);

        if (DEBUG_MODE) {
            updateDebugInfo();
        }
    }
}

let lastMouseMove = 0;

function updateAutoAnimation() {
    const now = Date.now();

    if (now - lastMouseMove > 1000 && AUTO_ANIMATION) {
        autoAnimationPhase += 0.01;

        const radius = Math.min(windowWidth, windowHeight) * 0.4;
        mouseX = windowWidth / 2 + Math.cos(autoAnimationPhase) * radius;
        mouseY = windowHeight / 2 + Math.sin(autoAnimationPhase) * radius;

        if (DEBUG_MODE) {
            updateDebugInfo();
        }
    }
}

document.addEventListener('mousemove', (e) => {
    updateMousePosition(e);
    lastMouseMove = Date.now();
});

document.addEventListener('touchmove', (e) => {
    updateMousePosition(e);
    lastMouseMove = Date.now();
});

window.addEventListener('deviceorientation', handleOrientation);

window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
});

function animate() {
    updateAutoAnimation();

    currentX += (mouseX - currentX) * smoothing;
    currentY += (mouseY - currentY) * smoothing;

    const normalizedX = (currentX / windowWidth - 0.5) * 2;
    const normalizedY = (currentY / windowHeight - 0.5) * 2;

    if (bgShapes) {
        bgShapes.forEach((shape, index) => {
            const depth = 0.2 + index * 0.1;
            const moveX = normalizedX * depth * 400;
            const moveY = normalizedY * depth * 400;

            const rotation = normalizedX * normalizedY * (10 + index * 5);

            const scale = 1 + Math.abs(normalizedX * normalizedY) * 0.15;

            shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}deg) scale(${scale})`;

            const dynamicOpacity = 0.6 + Math.abs(normalizedX * normalizedY) * 0.4;
            shape.style.opacity = dynamicOpacity;
        });
    }

    if (avatar) {
        const rotateX = normalizedY * -10;
        const rotateY = normalizedX * 10;
        avatar.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        avatar.style.transition = 'transform 0.1s';
    }

    if (cards) {
        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            const deltaX = currentX - cardCenterX;
            const deltaY = currentY - cardCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const maxDistance = 500;
            if (distance < maxDistance) {
                const intensity = 1 - distance / maxDistance;
                const tiltX = deltaY * 0.02 * intensity;
                const tiltY = -deltaX * 0.02 * intensity;
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(15px)`;
                card.style.transition = 'transform 0.1s';
            } else {
                card.style.transform =
                    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
                card.style.transition = 'transform 0.5s';
            }
        });
    }

    requestAnimationFrame(animate);
}

function createDebugDisplay() {
    if (!DEBUG_MODE) return;

    const debugButton = document.createElement('div');
    debugButton.className = 'motion-debug-button';
    debugButton.innerHTML = '<i class="ri-bug-2-line"></i>';
    document.body.appendChild(debugButton);

    const debugElement = document.createElement('div');
    debugElement.className = 'motion-debug motion-debug-hidden';
    debugElement.innerHTML = `
        <div class="motion-debug-header">
            Motion Debug
            <button id="close-debug-button" class="close-debug-button">&times;</button>
        </div>
        <div class="motion-debug-content">
            <div>Mouse X: <span id="debug-mouse-x">0</span></div>
            <div>Mouse Y: <span id="debug-mouse-y">0</span></div>
            <div>Current X: <span id="debug-current-x">0</span></div>
            <div>Current Y: <span id="debug-current-y">0</span></div>
            <div>Auto Animation: <span id="debug-auto-animation">${
                AUTO_ANIMATION ? 'ON' : 'OFF'
            }</span></div>
            <div>Shapes Found: <span id="debug-shapes-found">${
                bgShapes ? bgShapes.length : 0
            }</span></div>
        </div>
        <div class="motion-debug-status">
            <div class="motion-status-indicator"></div>
            <span>Motion system active</span>
        </div>
        <button id="test-motion-button" class="test-motion-button">Test Motion</button>
    `;
    document.body.appendChild(debugElement);

    debugButton.addEventListener('click', () => {
        debugElement.classList.toggle('motion-debug-hidden');
        debugButton.classList.toggle(
            'active',
            !debugElement.classList.contains('motion-debug-hidden')
        );
    });

    // Add event listeners only after elements exist in the DOM
    const testButton = document.getElementById('test-motion-button');
    if (testButton) {
        testButton.addEventListener('click', () => {
            testMotionEffect();
        });
    }

    const closeButton = document.getElementById('close-debug-button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            debugElement.classList.add('motion-debug-hidden');
            debugButton.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (
            !debugElement.contains(e.target) &&
            !debugButton.contains(e.target) &&
            !debugElement.classList.contains('motion-debug-hidden')
        ) {
            debugElement.classList.add('motion-debug-hidden');
            debugButton.classList.remove('active');
        }
    });
}

function updateDebugInfo() {
    if (!DEBUG_MODE) return;

    if (document.querySelector('.motion-debug:not(.motion-debug-hidden)')) {
        document.getElementById('debug-mouse-x').textContent = Math.round(mouseX);
        document.getElementById('debug-mouse-y').textContent = Math.round(mouseY);
        document.getElementById('debug-current-x').textContent = Math.round(currentX);
        document.getElementById('debug-current-y').textContent = Math.round(currentY);
    }

    const indicator = document.querySelector('.motion-status-indicator');
    const button = document.querySelector('.motion-debug-button');

    if (indicator) {
        indicator.classList.add('active');
        setTimeout(() => {
            indicator.classList.remove('active');
        }, 200);
    }

    if (button) {
        button.classList.add('pulse');
        setTimeout(() => {
            button.classList.remove('pulse');
        }, 200);
    }
}

function testMotionEffect() {
    const testDuration = 3000;
    const startTime = Date.now();
    const startX = mouseX;
    const startY = mouseY;

    const indicator = document.createElement('div');
    indicator.className = 'motion-test-overlay';
    indicator.innerHTML = `<div>Testing Motion Effect...</div>`;
    document.body.appendChild(indicator);

    function animateTest() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / testDuration, 1);

        const angle = progress * Math.PI * 2;
        const radius = Math.min(windowWidth, windowHeight) * 0.4;

        mouseX = windowWidth / 2 + Math.cos(angle) * radius;
        mouseY = windowHeight / 2 + Math.sin(angle) * radius;

        if (progress < 1) {
            requestAnimationFrame(animateTest);
        } else {
            mouseX = startX;
            mouseY = startY;

            indicator.classList.add('fade-out');
            setTimeout(() => {
                indicator.remove();
            }, 500);
        }
    }

    animateTest();
}

function addMotionIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'motion-indicator';
    indicator.innerHTML = `
        <div class="motion-indicator-inner">
            <div class="motion-indicator-dot"></div>
            <div class="motion-indicator-text">Mouse Tracking Active - Move your cursor!</div>
        </div>
    `;
    document.body.appendChild(indicator);

    setTimeout(() => {
        indicator.classList.add('motion-indicator-fade');
        setTimeout(() => {
            indicator.remove();
        }, 1000);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    mouseX = windowWidth / 2;
    mouseY = windowHeight / 2;

    createDebugDisplay();

    animate();

    addMotionIndicator();
});
