// ===== Mood Tracker Module =====
class MoodTracker {
    constructor() {
        this.moods = this.loadMoods();
        this.selectedMood = null;
        this.init();
    }

    init() {
        this.setupMoodButtons();
        this.setupSaveButton();
        this.renderMoodHistory();
        this.renderMoodChart();
    }

    setupMoodButtons() {
        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove previous selection
                moodButtons.forEach(b => b.classList.remove('selected'));

                // Select current
                e.currentTarget.classList.add('selected');
                this.selectedMood = parseInt(e.currentTarget.dataset.mood);
            });
        });
    }

    setupSaveButton() {
        const saveBtn = document.getElementById('saveMood');
        const noteInput = document.getElementById('moodNote');

        saveBtn.addEventListener('click', () => {
            if (this.selectedMood === null) {
                alert('Please select a mood first!');
                return;
            }

            const moodEntry = {
                mood: this.selectedMood,
                note: noteInput.value,
                date: new Date().toISOString(),
                timestamp: Date.now()
            };

            this.moods.push(moodEntry);
            this.saveMoods();

            // Reset form
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            noteInput.value = '';
            this.selectedMood = null;

            // Update displays
            this.renderMoodHistory();
            this.renderMoodChart();

            // Show success message
            this.showSuccessMessage();
        });
    }

    showSuccessMessage() {
        const saveBtn = document.getElementById('saveMood');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✓ Saved!';
        saveBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
        }, 2000);
    }

    renderMoodHistory() {
        const historyContainer = document.getElementById('moodHistory');

        if (this.moods.length === 0) {
            historyContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No mood entries yet. Start tracking your mood today!</p>';
            return;
        }

        // Show last 7 entries
        const recentMoods = this.moods.slice(-7).reverse();

        historyContainer.innerHTML = recentMoods.map(entry => {
            const date = new Date(entry.date);
            const emoji = this.getMoodEmoji(entry.mood);
            const moodText = this.getMoodText(entry.mood);

            return `
                <div class="mood-entry">
                    <div class="mood-entry-emoji">${emoji}</div>
                    <div class="mood-entry-details">
                        <div class="mood-entry-date">${date.toLocaleDateString()} - ${moodText}</div>
                        ${entry.note ? `<div class="mood-entry-note">${entry.note}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderMoodChart() {
        const canvas = document.getElementById('moodChart');
        const ctx = canvas.getContext('2d');

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.moods.length === 0) {
            ctx.fillStyle = 'var(--text-secondary)';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Start tracking to see your mood trends', canvas.width / 2, canvas.height / 2);
            return;
        }

        // Get last 14 days of data
        const last14Days = this.moods.slice(-14);

        const paddingLeft = 80;  // Increased for longer labels
        const paddingRight = 40;
        const paddingTop = 40;
        const paddingBottom = 40;
        const chartWidth = canvas.width - paddingLeft - paddingRight;
        const chartHeight = canvas.height - paddingTop - paddingBottom;

        // Draw axes
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, paddingTop);
        ctx.lineTo(paddingLeft, canvas.height - paddingBottom);
        ctx.lineTo(canvas.width - paddingRight, canvas.height - paddingBottom);
        ctx.stroke();

        // Draw grid lines
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        for (let i = 1; i <= 5; i++) {
            const y = paddingTop + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(canvas.width - paddingRight, y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Draw mood line
        if (last14Days.length > 1) {
            ctx.strokeStyle = '#6366f1';
            ctx.lineWidth = 3;
            ctx.beginPath();

            last14Days.forEach((entry, index) => {
                const x = paddingLeft + (chartWidth / (last14Days.length - 1)) * index;
                const y = canvas.height - paddingBottom - ((entry.mood - 1) / 4) * chartHeight;

                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            ctx.stroke();

            // Draw points
            last14Days.forEach((entry, index) => {
                const x = paddingLeft + (chartWidth / (last14Days.length - 1)) * index;
                const y = canvas.height - paddingBottom - ((entry.mood - 1) / 4) * chartHeight;

                ctx.fillStyle = '#6366f1';
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // Draw labels
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
        ctx.font = '12px Inter';
        ctx.textAlign = 'right';

        const labels = ['Stressed', 'Not Great', 'Okay', 'Good', 'Excellent'];
        labels.forEach((label, index) => {
            const y = canvas.height - paddingBottom - (chartHeight / 4) * index;
            ctx.fillText(label, paddingLeft - 10, y);
        });
    }

    getMoodEmoji(mood) {
        const emojis = {
            1: '😰',
            2: '😟',
            3: '😐',
            4: '🙂',
            5: '😄'
        };
        return emojis[mood] || '😐';
    }

    getMoodText(mood) {
        const texts = {
            1: 'Stressed',
            2: 'Not Great',
            3: 'Okay',
            4: 'Good',
            5: 'Excellent'
        };
        return texts[mood] || 'Okay';
    }

    loadMoods() {
        const stored = localStorage.getItem('moodHistory');
        return stored ? JSON.parse(stored) : [];
    }

    saveMoods() {
        localStorage.setItem('moodHistory', JSON.stringify(this.moods));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moodTracker = new MoodTracker();
});
