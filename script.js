document.addEventListener('DOMContentLoaded', () => {
    const portfolioButton = document.getElementById('portfolio-button');
    if (portfolioButton) {
        portfolioButton.addEventListener('click', handlePortfolioButtonClick);
    }
});

function handlePortfolioButtonClick(event) {
    event.preventDefault();

    confetti();

    const href = event.currentTarget.href;

    event.currentTarget.removeEventListener('click', handlePortfolioButtonClick);

    setTimeout(() => {
        window.open(href, '_blank');
    }, 1000);
}
