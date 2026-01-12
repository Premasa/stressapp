// ===== Breathing Exercise Module =====
class BreathingExercise {
    constructor() {
        this.isActive = false;
        this.currentPhase = '';
        this.timer = null;
        this.patterns = {
            '478': {
                name: '4-7-8 Breathing',
                phases: [
                    { name: 'Breathe In', duration: 4000 },
                    { name: 'Hold', duration: 7000 },
                    { name: 'Breathe Out', duration: 8000 }
                ]
            },
            'box': {
                name: 'Box Breathing',
                phases: [
                    { name: 'Breathe In', duration: 4000 },
                    { name: 'Hold', duration: 4000 },
                    { name: 'Breathe Out', duration: 4000 },
                    { name: 'Hold', duration: 4000 }
                ]
            },
            'calm': {
                name: 'Calm Breathing',
                phases: [
                    { name: 'Breathe In', duration: 3000 },
                    { name: 'Breathe Out', duration: 6000 }
                ]
            }
        };
        this.init();
    }

    init() {
        this.startBtn = document.getElementById('startBreathing');
        this.stopBtn = document.getElementById('stopBreathing');
        this.patternSelect = document.getElementById('breathingPattern');
        this.breathingText = document.getElementById('breathingText');
        this.breathingCircle = document.querySelector('.breathing-circle');

        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
    }

    start() {
        if (this.isActive) return;

        this.isActive = true;
        this.startBtn.style.display = 'none';
        this.stopBtn.style.display = 'block';

        const pattern = this.patterns[this.patternSelect.value];
        this.runPattern(pattern);
    }

    stop() {
        this.isActive = false;
        this.startBtn.style.display = 'block';
        this.stopBtn.style.display = 'none';

        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.breathingText.textContent = 'Breathe';
        this.breathingCircle.style.animation = 'none';
    }

    runPattern(pattern) {
        if (!this.isActive) return;

        let phaseIndex = 0;

        const runPhase = () => {
            if (!this.isActive) return;

            const phase = pattern.phases[phaseIndex];
            this.breathingText.textContent = phase.name;

            // Animate circle
            if (phase.name.includes('In')) {
                this.breathingCircle.style.animation = `breatheIn ${phase.duration}ms ease-in-out forwards`;
            } else if (phase.name.includes('Out')) {
                this.breathingCircle.style.animation = `breatheOut ${phase.duration}ms ease-in-out forwards`;
            } else {
                this.breathingCircle.style.animation = 'none';
            }

            this.timer = setTimeout(() => {
                phaseIndex = (phaseIndex + 1) % pattern.phases.length;
                runPhase();
            }, phase.duration);
        };

        runPhase();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.breathingExercise = new BreathingExercise();
});
