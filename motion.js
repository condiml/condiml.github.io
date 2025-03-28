// Motion tracking for interactive UI effects

// Track mouse position
let mouseX = 0;
let mouseY = 0;
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

// Target elements
const bgShapes = document.querySelectorAll('.shape');
const avatar = document.querySelector('.profile-avatar');
const cards = document.querySelectorAll('.link-card');

// Smoothing factor (lower = smoother)
const smoothing = 0.1;

// Current position with smoothing
let currentX = 0;
let currentY = 0;

// Update mouse position
function updateMousePosition(e) {
    mouseX = e.clientX || (e.touches && e.touches[0].clientX) || windowWidth / 2;
    mouseY = e.clientY || (e.touches && e.touches[0].clientY) || windowHeight / 2;
}

// Handle device orientation for mobile
function handleOrientation(e) {
    // Only use orientation if mouse hasn't moved recently
    if (Date.now() - lastMouseMove > 100) {
        // Convert orientation data to mouse position equivalent
        // Beta is front-to-back tilt in degrees (-180 to 180)
        // Gamma is left-to-right tilt in degrees (-90 to 90)
        const beta = e.beta || 0; // X
        const gamma = e.gamma || 0; // Y

        mouseX = windowWidth / 2 + (gamma / 90) * (windowWidth / 3);
        mouseY = windowHeight / 2 + (beta / 180) * (windowHeight / 3);
    }
}

// Track last mouse movement timestamp
let lastMouseMove = 0;

// Add listeners for both mouse and touch events
document.addEventListener('mousemove', (e) => {
    updateMousePosition(e);
    lastMouseMove = Date.now();
});

document.addEventListener('touchmove', (e) => {
    updateMousePosition(e);
    lastMouseMove = Date.now();
});

// Add device orientation for mobile devices
window.addEventListener('deviceorientation', handleOrientation);

// Update window dimensions on resize
window.addEventListener('resize', () => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
});

// Animation loop
function animate() {
    // Smooth transition to target position
    currentX += (mouseX - currentX) * smoothing;
    currentY += (mouseY - currentY) * smoothing;

    // Calculate normalized position (-1 to 1)
    const normalizedX = (currentX / windowWidth - 0.5) * 2;
    const normalizedY = (currentY / windowHeight - 0.5) * 2;

    // Animate background shapes with ENHANCED parallax effect
    if (bgShapes) {
        bgShapes.forEach((shape, index) => {
            // Significantly increased depth factors for more obvious movement
            const depth = 0.15 + index * 0.08; // 3x more sensitivity than before
            const moveX = normalizedX * depth * 300; // 3x larger movement range
            const moveY = normalizedY * depth * 300; // 3x larger movement range

            // Add slight rotation for more dynamic feel
            const rotation = normalizedX * normalizedY * (5 + index * 2);

            // Add scale variation based on mouse position
            const scale = 1 + Math.abs(normalizedX * normalizedY) * 0.1;

            // Apply more dramatic transform with visual feedback
            shape.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotation}deg) scale(${scale})`;

            // Update the opacity based on movement for visual feedback
            const dynamicOpacity = 0.5 + Math.abs(normalizedX * normalizedY) * 0.3;
            shape.style.opacity = dynamicOpacity;
        });
    }

    // Animate profile avatar with subtle rotation
    if (avatar) {
        const rotateX = normalizedY * -5; // Invert for natural feel
        const rotateY = normalizedX * 5;
        avatar.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        avatar.style.transition = 'transform 0.1s';
    }

    // Subtle hover effect on cards
    if (cards) {
        cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            // Distance from mouse to card center
            const deltaX = currentX - cardCenterX;
            const deltaY = currentY - cardCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Only affect cards within certain range
            const maxDistance = 300;
            if (distance < maxDistance) {
                const intensity = 1 - distance / maxDistance;
                const tiltX = deltaY * 0.01 * intensity;
                const tiltY = -deltaX * 0.01 * intensity;
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(10px)`;
                card.style.transition = 'transform 0.1s';
            } else {
                card.style.transform =
                    'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
                card.style.transition = 'transform 0.5s';
            }
        });
    }

    // Continue animation loop
    requestAnimationFrame(animate);
}

// Add visual indicator that shows motion tracking is active
function addMotionIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'motion-indicator';
    indicator.innerHTML = `
        <div class="motion-indicator-inner">
            <div class="motion-indicator-dot"></div>
            <div class="motion-indicator-text">Motion Tracking Active</div>
        </div>
    `;
    document.body.appendChild(indicator);

    setTimeout(() => {
        indicator.classList.add('motion-indicator-fade');
        setTimeout(() => {
            indicator.remove();
        }, 1000);
    }, 3000);
}

// Initialize animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial mouse position to center of screen
    mouseX = windowWidth / 2;
    mouseY = windowHeight / 2;

    // Start animation loop
    animate();

    // Show indicator that motion is active
    addMotionIndicator();
});
