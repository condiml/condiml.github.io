document.addEventListener('DOMContentLoaded', () => {
    // Fade in elements on page load
    const allElements = document.querySelectorAll('.column > *');
    allElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + index * 100);
    });

    // Portfolio button click effect
    const portfolioButton = document.getElementById('portfolio-button');
    if (portfolioButton) {
        portfolioButton.addEventListener('click', () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        });
    }

    // Add subtle hover animations to all buttons
    const buttons = document.querySelectorAll('.button');
    buttons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-4px)';
            button.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            button.style.boxShadow = '';
        });
    });

    // Check if we should use dark mode based on user preference
    function updateTheme() {
        const isDarkMode =
            window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-mode', isDarkMode);
    }

    // Listen for changes in color scheme preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);

    // Initial theme check
    updateTheme();
});
