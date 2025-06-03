document.addEventListener('DOMContentLoaded', function() {
    const learnMoreBtn = document.querySelector('.cta-btn[href="#learn-more"]');

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const cardsSection = document.querySelector('.cards-container');
            if (cardsSection) {
                cardsSection.scrollIntoView({ 
                    behavior: 'smooth'
                });
            }
        });
    }
});