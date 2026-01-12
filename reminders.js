// ===== Break Reminders Module =====
class BreakReminders {
    constructor() {
        this.isEnabled = false;
        this.interval = 30; // minutes
        this.timer = null;
        this.nextBreakTime = null;
        this.countdownInterval = null;
        this.init();
    }

    init() {
        this.intervalSelect = document.getElementById('reminderInterval');
        this.enableToggle = document.getElementById('reminderEnabled');
        this.statusText = document.getElementById('reminderStatus');
        this.nextBreakDisplay = document.getElementById('nextBreak');
        this.breakTimer = document.getElementById('breakTimer');

        // Load saved settings
        this.loadSettings();

        // Event listeners
        this.intervalSelect.addEventListener('change', (e) => {
            this.interval = parseInt(e.target.value);
            this.saveSettings();
            if (this.isEnabled) {
                this.restart();
            }
        });

        this.enableToggle.addEventListener('change', (e) => {
            this.isEnabled = e.target.checked;
            this.saveSettings();

            if (this.isEnabled) {
                this.start();
            } else {
                this.stop();
            }
        });

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    start() {
        this.statusText.textContent = 'Reminders On';
        this.statusText.style.color = '#10b981';
        this.nextBreakDisplay.style.display = 'block';

        this.setNextBreak();
        this.startCountdown();
    }

    stop() {
        this.statusText.textContent = 'Reminders Off';
        this.statusText.style.color = 'var(--text-secondary)';
        this.nextBreakDisplay.style.display = 'none';

        if (this.timer) {
            clearTimeout(this.timer);
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    }

    restart() {
        this.stop();
        this.start();
    }

    setNextBreak() {
        this.nextBreakTime = Date.now() + (this.interval * 60 * 1000);

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.showBreakNotification();
            this.setNextBreak(); // Schedule next break
        }, this.interval * 60 * 1000);
    }

    startCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    updateCountdown() {
        if (!this.nextBreakTime) return;

        const now = Date.now();
        const timeLeft = this.nextBreakTime - now;

        if (timeLeft <= 0) {
            this.breakTimer.textContent = '00:00';
            return;
        }

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);

        this.breakTimer.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    showBreakNotification() {
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('Time for a Break! 🧘', {
                body: 'You\'ve been working hard! Take a moment to stretch, breathe, or relax.',
                icon: '🧘',
                badge: '🧘',
                requireInteraction: false,
                silent: false
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // Auto close after 10 seconds
            setTimeout(() => notification.close(), 10000);
        }

        // Visual alert
        this.showVisualAlert();

        // Play a gentle sound (optional)
        this.playNotificationSound();
    }

    showVisualAlert() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const alertBox = document.createElement('div');
        alertBox.style.cssText = `
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            padding: 3rem;
            border-radius: 2rem;
            text-align: center;
            color: white;
            max-width: 500px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        `;

        alertBox.innerHTML = `
            <div style="font-size: 5rem; margin-bottom: 1rem;">🧘</div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">Time for a Break!</h2>
            <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">
                You've been working hard! Take a moment to stretch, breathe, or relax.
            </p>
            <button id="dismissBreak" style="
                padding: 1rem 2rem;
                background: white;
                color: #6366f1;
                border: none;
                border-radius: 1rem;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease;
            ">Got it!</button>
        `;

        overlay.appendChild(alertBox);
        document.body.appendChild(overlay);

        // Dismiss button
        document.getElementById('dismissBreak').addEventListener('click', () => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        });

        // Auto dismiss after 15 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => overlay.remove(), 300);
            }
        }, 15000);
    }

    playNotificationSound() {
        // Create a gentle notification sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 523.25; // C5 note
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not available');
        }
    }

    loadSettings() {
        const saved = localStorage.getItem('breakReminders');
        if (saved) {
            const settings = JSON.parse(saved);
            this.interval = settings.interval || 30;
            this.isEnabled = settings.enabled || false;

            this.intervalSelect.value = this.interval;
            this.enableToggle.checked = this.isEnabled;

            if (this.isEnabled) {
                this.start();
            }
        }
    }

    saveSettings() {
        const settings = {
            interval: this.interval,
            enabled: this.isEnabled
        };
        localStorage.setItem('breakReminders', JSON.stringify(settings));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.breakReminders = new BreakReminders();
});
