// Import CSS files so Vite processes them
import './style.css';
import rusticThemeCSS from './rustic-theme.css?inline';

document.addEventListener('DOMContentLoaded', () => {
    // Set sequential animation delays for buttons
    const buttonGroups = [
        '.social-links a',
        '.websites a',
        '.projects a',
        '.github-repos a',
        '.codepen-demos a',
        '.chrome-extensions a',
    ];

    buttonGroups.forEach((selector) => {
        const buttons = document.querySelectorAll(selector);
        buttons.forEach((button, index) => {
            button.style.animationDelay = `${0.1 + index * 0.1}s`;
        });
    });

    // Mouse move parallax effect for background
    const body = document.querySelector('body');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        body.style.setProperty('--mouse-x', x);
        body.style.setProperty('--mouse-y', y);
    });

    // Subtle hover effect for the card
    const card = document.querySelector('.column');
    if (card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            // Subtle tilt effect based on mouse position
            const tiltX = (y - 0.5) * 3;
            const tiltY = (x - 0.5) * -3;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;

            // Dynamic highlight effect
            const highlight = `radial-gradient(circle at ${x * 100}% ${
                y * 100
            }%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`;
            card.style.backgroundImage = highlight;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.backgroundImage = '';
        });
    }

    // Button ripple effect
    const buttons = document.querySelectorAll('.button');
    buttons.forEach((button) => {
        button.addEventListener('click', function (e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
        }
    );

    document.querySelectorAll('.section-title, .button').forEach((element) => {
        observer.observe(element);
    });

    // Optional: add subtle particle background
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 30, density: { enable: true, value_area: 800 } },
                color: { value: '#4a6cf7' },
                opacity: { value: 0.1, random: true },
                size: { value: 5, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#4a6cf7',
                    opacity: 0.1,
                    width: 1,
                },
                move: { enable: true, speed: 1, direction: 'none', random: true, out_mode: 'out' },
            },
        });
    }

    // Add theme switcher initialization
    initThemeSwitcher();
});

// Theme switching functionality
function initThemeSwitcher() {
    // Check for saved preference
    const currentTheme = localStorage.getItem('theme') || 'default';

    // Add theme toggle button to the page
    const column = document.querySelector('.column');

    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
    <button class="theme-btn default-theme ${currentTheme === 'default' ? 'active' : ''}"
            title="Modern Theme">
      <span class="theme-circle"></span>
    </button>
    <button class="theme-btn rustic-theme ${currentTheme === 'rustic' ? 'active' : ''}"
            title="Rustic Theme">
      <span class="theme-circle"></span>
    </button>
  `;

    // Insert before the first child of column
    if (column) {
        column.insertBefore(themeToggle, column.firstChild);
    }

    // Set initial theme
    setTheme(currentTheme);

    // Handle clicks on the theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling (stops ripple effect)

            // Set the theme based on which button was clicked
            if (btn.classList.contains('default-theme')) {
                setTheme('default');
            } else if (btn.classList.contains('rustic-theme')) {
                setTheme('rustic');
            }

            console.log(
                'Theme button clicked:',
                btn.classList.contains('default-theme') ? 'default' : 'rustic'
            );
        });
    });
}

function setTheme(theme) {
    // Simply toggle the body class - no need to load external CSS
    if (theme === 'rustic') {
        localStorage.setItem('theme', 'rustic');
        document.documentElement.setAttribute('data-theme', 'rustic');
        document.body.classList.add('rustic-theme');
        document.body.classList.remove('default-theme');
    } else {
        localStorage.setItem('theme', 'default');
        document.documentElement.setAttribute('data-theme', 'default');
        document.body.classList.add('default-theme');
        document.body.classList.remove('rustic-theme');
    }

    // Update button states
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach((btn) => {
        btn.classList.remove('active');
        if (
            (theme === 'rustic' && btn.classList.contains('rustic-theme')) ||
            (theme === 'default' && btn.classList.contains('default-theme'))
        ) {
            btn.classList.add('active');
        }
    });
}
