// ===== Motivational Quotes Module =====
class MotivationalQuotes {
    constructor() {
        this.quotes = [
            {
                text: "The greatest weapon against stress is our ability to choose one thought over another.",
                author: "William James"
            },
            {
                text: "You don't have to control your thoughts. You just have to stop letting them control you.",
                author: "Dan Millman"
            },
            {
                text: "The time to relax is when you don't have time for it.",
                author: "Sydney J. Harris"
            },
            {
                text: "Almost everything will work again if you unplug it for a few minutes, including you.",
                author: "Anne Lamott"
            },
            {
                text: "It's not the load that breaks you down, it's the way you carry it.",
                author: "Lou Holtz"
            },
            {
                text: "Take rest; a field that has rested gives a bountiful crop.",
                author: "Ovid"
            },
            {
                text: "Your mind will answer most questions if you learn to relax and wait for the answer.",
                author: "William S. Burroughs"
            },
            {
                text: "Tension is who you think you should be. Relaxation is who you are.",
                author: "Chinese Proverb"
            },
            {
                text: "The greatest mistake you can make in life is to be continually fearing you will make one.",
                author: "Elbert Hubbard"
            },
            {
                text: "Sometimes the most productive thing you can do is relax.",
                author: "Mark Black"
            },
            {
                text: "Don't let yesterday take up too much of today.",
                author: "Will Rogers"
            },
            {
                text: "You can't calm the storm, so stop trying. What you can do is calm yourself. The storm will pass.",
                author: "Timber Hawkeye"
            },
            {
                text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time.",
                author: "Hermann Hesse"
            },
            {
                text: "The mind is everything. What you think you become.",
                author: "Buddha"
            },
            {
                text: "Peace comes from within. Do not seek it without.",
                author: "Buddha"
            },
            {
                text: "Smile, breathe, and go slowly.",
                author: "Thich Nhat Hanh"
            },
            {
                text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.",
                author: "Thich Nhat Hanh"
            },
            {
                text: "Do not anticipate trouble, or worry about what may never happen. Keep in the sunlight.",
                author: "Benjamin Franklin"
            },
            {
                text: "Rule number one is, don't sweat the small stuff. Rule number two is, it's all small stuff.",
                author: "Robert Eliot"
            },
            {
                text: "Calmness is the cradle of power.",
                author: "Josiah Gilbert Holland"
            },
            {
                text: "The greatest discovery of my generation is that human beings can alter their lives by altering their attitudes.",
                author: "William James"
            },
            {
                text: "Every day may not be good, but there's something good in every day.",
                author: "Alice Morse Earle"
            },
            {
                text: "You are braver than you believe, stronger than you seem, and smarter than you think.",
                author: "A.A. Milne"
            },
            {
                text: "Happiness is not something ready made. It comes from your own actions.",
                author: "Dalai Lama"
            },
            {
                text: "The only way out is through.",
                author: "Robert Frost"
            }
        ];

        this.currentQuoteIndex = 0;
        this.init();
    }

    init() {
        this.quoteText = document.getElementById('quoteText');
        this.quoteAuthor = document.getElementById('quoteAuthor');
        this.newQuoteBtn = document.getElementById('newQuote');

        this.newQuoteBtn.addEventListener('click', () => this.showRandomQuote());

        // Show a random quote on load
        this.showRandomQuote();
    }

    showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        const quote = this.quotes[randomIndex];

        // Fade out
        this.quoteText.style.opacity = '0';
        this.quoteAuthor.style.opacity = '0';

        setTimeout(() => {
            this.quoteText.textContent = `"${quote.text}"`;
            this.quoteAuthor.textContent = `- ${quote.author}`;

            // Fade in
            this.quoteText.style.transition = 'opacity 0.5s ease';
            this.quoteAuthor.style.transition = 'opacity 0.5s ease';
            this.quoteText.style.opacity = '1';
            this.quoteAuthor.style.opacity = '1';
        }, 300);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.motivationalQuotes = new MotivationalQuotes();
});
