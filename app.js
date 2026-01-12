// ===== Main App Controller =====
class StressReliefApp {
    constructor() {
        this.currentModule = 'home';
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
        this.initBackgroundEffects();
        this.initQuoteTicker();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.loadDailyTip();
        this.handleUserPersonalization();
    }

    handleUserPersonalization() {
        let userName = localStorage.getItem('serenity_username');
        if (!userName) {
            // Wait a bit for animations to settle, then show modal
            setTimeout(() => {
                this.showWelcomeModal();
            }, 1500);
        } else {
            this.updateGreeting(userName);
        }
    }

    showWelcomeModal() {
        const modal = document.getElementById('welcome-modal');
        const input = document.getElementById('nameInput');
        const btn = document.getElementById('startJourneyBtn');
        const title = modal.querySelector('.modal-title');
        const subtitle = modal.querySelector('.modal-subtitle');

        if (modal) {
            modal.classList.add('active');

            // Reset text for typing animation
            title.textContent = '';
            title.style.borderRight = '2px solid var(--primary)'; // Cursor effect

            // Typing Animation
            const text = "Hello, Friend 🌟";
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    title.style.borderRight = 'none'; // Remove cursor
                    // Focus input after typing is done
                    setTimeout(() => input.focus(), 500);
                }
            };

            // Start typing after a brief delay
            setTimeout(typeWriter, 500);

            // Button click handler
            btn.addEventListener('click', () => this.saveUserName());

            // Enter key handler
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.saveUserName();
            });
        }
    }

    saveUserName() {
        const input = document.getElementById('nameInput');
        const name = input.value.trim() || 'Friend';

        localStorage.setItem('serenity_username', name);
        this.updateGreeting(name);

        // Animate modal out
        const modal = document.getElementById('welcome-modal');
        const card = modal.querySelector('.modal-card');

        card.style.transform = 'translateY(-50px) scale(0.9)';
        card.style.opacity = '0';

        setTimeout(() => {
            modal.classList.remove('active');
        }, 500);
    }

    updateGreeting(name) {
        const greetingEl = document.getElementById('userGreeting');
        if (greetingEl) {
            greetingEl.style.opacity = '0';
            setTimeout(() => {
                greetingEl.textContent = `Welcome back, ${name} 👋`;
                greetingEl.style.opacity = '1';
                greetingEl.style.transition = 'opacity 0.5s ease';
            }, 500);
        }
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const module = e.currentTarget.dataset.module;
                this.switchModule(module);
            });
        });

        const quickCards = document.querySelectorAll('.quick-card');
        quickCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.switchModule(action);
            });
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    switchModule(moduleName) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.module === moduleName) {
                btn.classList.add('active');
            }
        });

        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });

        const targetModule = document.getElementById(`${moduleName}-module`);
        if (targetModule) {
            targetModule.classList.add('active');
            this.currentModule = moduleName;
        }
    }

    initBackgroundEffects() {
        const bgContainer = document.createElement('div');
        bgContainer.className = 'bg-particles';

        // Add floating orbs
        for (let i = 1; i <= 3; i++) {
            const orb = document.createElement('div');
            orb.className = `floating-orb orb-${i}`;
            bgContainer.appendChild(orb);
        }

        // Add small particles
        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;

            particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
            particle.style.animationDelay = `-${Math.random() * 10}s`;

            bgContainer.appendChild(particle);
        }

        document.body.prepend(bgContainer);
    }

    initQuoteTicker() {
        const container = document.getElementById('quoteTicker');
        const quotes = [
            "Believe you can and you're halfway there.",
            "The only way to do great work is to love what you do.",
            "Success is not final, failure is not fatal: it is the courage to continue.",
            "Don't watch the clock; do what it does. Keep going.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "Everything you've ever wanted is on the other side of fear.",
            "Hardships often prepare ordinary people for an extraordinary destiny.",
            "Dream big and dare to fail.",
            "It does not matter how slowly you go as long as you do not stop.",
            "The best way to predict the future is to create it.",
            "Your time is limited, don't waste it living someone else's life.",
            "Quality is not an act, it is a habit.",
            "Keep your face always toward the sunshine - and shadows will fall behind you.",
            "The only limit to our realization of tomorrow will be our doubts of today.",
            "Act as if what you do makes a difference. It does.",
            "Happiness is not something ready made. It comes from your own actions."
        ];

        let currentIndex = 0;

        const showQuote = () => {
            // Create new text element
            container.innerHTML = `<div class="quote-text">${quotes[currentIndex]}</div>`;

            // Trigger fade in
            setTimeout(() => {
                const text = container.querySelector('.quote-text');
                if (text) text.classList.add('visible');
            }, 50);

            // Prepare next quote
            currentIndex = (currentIndex + 1) % quotes.length;
        };

        // Initial show
        showQuote();

        // Rotate quotes every 8 seconds
        setInterval(showQuote, 8000);
    }

    loadDailyTip() {
        const tips = [
            "Take regular breaks throughout your day. Even 5 minutes can make a big difference!",
            "Practice deep breathing when you feel stressed. It activates your body's relaxation response.",
            "Stay hydrated! Dehydration can increase stress levels and reduce focus.",
            "Take a short walk outside. Nature and movement are powerful stress relievers.",
            "Set boundaries with work. It's okay to disconnect and recharge.",
            "Practice gratitude. Write down three things you're thankful for today.",
            "Get enough sleep. Rest is essential for managing stress effectively.",
            "Connect with colleagues. Social support is crucial for workplace wellbeing.",
            "Break large tasks into smaller steps. Progress, not perfection!",
            "Listen to calming music during your work. It can reduce stress hormones."
        ];

        const today = new Date().getDate();
        const tipIndex = today % tips.length;
        const dailyTipEl = document.getElementById('dailyTip');
        if (dailyTipEl) {
            dailyTipEl.textContent = tips[tipIndex];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new StressReliefApp();
});
