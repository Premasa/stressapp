// ===== Stress Relief Games Module =====
class StressReliefGames {
    constructor() {
        this.currentGame = 'bubbles';
        this.init();
    }

    init() {
        // Game selector buttons
        const gameButtons = document.querySelectorAll('.game-select-btn');
        gameButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const game = e.target.dataset.game;
                this.switchGame(game);
            });
        });

        // Initialize all games
        this.initBubbleGame();
        this.initColorGame();
        this.initDrawGame();
        this.initMandalaGame();
        this.initParticleFlowGame();
    }

    switchGame(gameName) {
        // Update buttons
        document.querySelectorAll('.game-select-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.game === gameName) {
                btn.classList.add('active');
            }
        });

        // Update game containers
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(`${gameName}-game`).classList.add('active');

        this.currentGame = gameName;
    }

    // ===== Bubble Pop Game =====
    initBubbleGame() {
        const canvas = document.getElementById('bubblesCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('bubbleScore');
        const resetBtn = document.getElementById('resetBubbles');

        let bubbles = [];
        let particles = [];
        let score = 0;
        let animationId;

        class Bubble {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 50;
                this.radius = 20 + Math.random() * 30;
                this.speed = 1 + Math.random() * 2;
                this.color = this.getRandomColor();
                this.popped = false;
            }

            getRandomColor() {
                const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                if (!this.popped) {
                    this.y -= this.speed;
                }
            }

            draw() {
                if (!this.popped) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = 0.7;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            }

            isClicked(mouseX, mouseY) {
                const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
                return distance < this.radius;
            }
        }

        class PopParticle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.size = Math.random() * 5 + 2;
                this.speedX = Math.random() * 6 - 3;
                this.speedY = Math.random() * 6 - 3;
                this.opacity = 1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.opacity -= 0.02;
            }

            draw() {
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        const animate = () => {
            if (document.getElementById('bubbles-game').classList.contains('active')) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Add new bubbles randomly
                if (Math.random() < 0.03) {
                    bubbles.push(new Bubble());
                }

                // Update and draw bubbles
                bubbles = bubbles.filter(bubble => {
                    bubble.update();
                    bubble.draw();
                    return bubble.y + bubble.radius > 0 && !bubble.popped;
                });

                // Update and draw pop particles
                particles = particles.filter(p => {
                    p.update();
                    p.draw();
                    return p.opacity > 0;
                });
            }
            animationId = requestAnimationFrame(animate);
        };

        canvas.addEventListener('mousedown', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
            const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

            bubbles.forEach(bubble => {
                if (bubble.isClicked(mouseX, mouseY) && !bubble.popped) {
                    bubble.popped = true;
                    score++;
                    scoreElement.textContent = score;

                    // Create pop particles
                    for (let i = 0; i < 10; i++) {
                        particles.push(new PopParticle(bubble.x, bubble.y, bubble.color));
                    }
                }
            });
        });

        resetBtn.addEventListener('click', () => {
            bubbles = [];
            particles = [];
            score = 0;
            scoreElement.textContent = score;
        });

        animate();
    }

    // ===== Color Match Game =====
    initColorGame() {
        const grid = document.getElementById('colorGrid');
        const scoreElement = document.getElementById('colorScore');
        const resetBtn = document.getElementById('resetColors');

        let colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];
        let cards = [...colors, ...colors]; // Duplicate for matching pairs
        let flippedCards = [];
        let matchedPairs = 0;

        const shuffle = (array) => {
            return array.sort(() => Math.random() - 0.5);
        };

        const createGrid = () => {
            grid.innerHTML = '';
            cards = shuffle([...colors, ...colors]);
            matchedPairs = 0;
            scoreElement.textContent = matchedPairs;

            cards.forEach((color, index) => {
                const tile = document.createElement('div');
                tile.className = 'color-tile';
                tile.style.backgroundColor = '#cbd5e1';
                tile.dataset.color = color;
                tile.dataset.index = index;

                tile.addEventListener('click', () => handleTileClick(tile));
                grid.appendChild(tile);
            });
        };

        const handleTileClick = (tile) => {
            if (flippedCards.length >= 2 || tile.classList.contains('flipped')) return;

            tile.style.backgroundColor = tile.dataset.color;
            tile.classList.add('flipped');
            flippedCards.push(tile);

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        };

        const checkMatch = () => {
            const [tile1, tile2] = flippedCards;

            if (tile1.dataset.color === tile2.dataset.color) {
                matchedPairs++;
                scoreElement.textContent = matchedPairs;

                if (matchedPairs === colors.length) {
                    setTimeout(() => {
                        alert('🎉 Congratulations! You matched all pairs!');
                    }, 300);
                }
            } else {
                tile1.style.backgroundColor = '#cbd5e1';
                tile2.style.backgroundColor = '#cbd5e1';
                tile1.classList.remove('flipped');
                tile2.classList.remove('flipped');
            }

            flippedCards = [];
        };

        resetBtn.addEventListener('click', createGrid);
        createGrid();
    }

    // ===== Zen Draw Game =====
    initDrawGame() {
        const canvas = document.getElementById('drawCanvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('drawColor');
        const brushSize = document.getElementById('brushSize');
        const clearBtn = document.getElementById('clearCanvas');

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const draw = (e) => {
            if (!isDrawing) return;

            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);

            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = brushSize.value;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            lastX = x;
            lastY = y;
        };

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = (e.clientX - rect.left) * (canvas.width / rect.width);
            lastY = (e.clientY - rect.top) * (canvas.height / rect.height);
        });

        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseout', () => isDrawing = false);

        // Touch support for mobile
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            lastX = (touch.clientX - rect.left) * (canvas.width / rect.width);
            lastY = (touch.clientY - rect.top) * (canvas.height / rect.height);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isDrawing) return;

            const rect = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
            const y = (touch.clientY - rect.top) * (canvas.height / rect.height);

            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = brushSize.value;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();

            lastX = x;
            lastY = y;
        });

        canvas.addEventListener('touchend', () => isDrawing = false);

        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }

    // ===== Mandala Magic Game =====
    initMandalaGame() {
        const canvas = document.getElementById('mandalaCanvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('mandalaColor');
        const symmetrySelect = document.getElementById('mandalaSymmetry');
        const clearBtn = document.getElementById('clearMandala');

        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;

        const draw = (e) => {
            if (!isDrawing) return;

            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const symmetry = parseInt(symmetrySelect.value);
            const angle = (Math.PI * 2) / symmetry;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            for (let i = 0; i < symmetry; i++) {
                ctx.rotate(angle);

                // Draw path from last point to current point
                ctx.beginPath();
                ctx.moveTo(lastX - centerX, lastY - centerY);
                ctx.lineTo(x - centerX, y - centerY);
                ctx.stroke();

                // Mirror effect
                ctx.save();
                ctx.scale(1, -1);
                ctx.beginPath();
                ctx.moveTo(lastX - centerX, lastY - centerY);
                ctx.lineTo(x - centerX, y - centerY);
                ctx.stroke();
                ctx.restore();
            }
            ctx.restore();

            lastX = x;
            lastY = y;
        };

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            lastX = (e.clientX - rect.left) * (canvas.width / rect.width);
            lastY = (e.clientY - rect.top) * (canvas.height / rect.height);
        });

        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', () => isDrawing = false);
        canvas.addEventListener('mouseleave', () => isDrawing = false);

        clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }

    // ===== Particle Flow Game =====
    initParticleFlowGame() {
        const canvas = document.getElementById('particlesCanvas');
        const ctx = canvas.getContext('2d');
        const resetBtn = document.getElementById('resetParticles');

        let particles = [];
        const particleCount = 100;
        let mouse = { x: null, y: null };

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 5 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.color = `hsla(${Math.random() * 360}, 70%, 60%, 0.8)`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Return to screen
                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;

                // Mouse interaction
                if (mouse.x !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        this.x += dx * 0.05;
                        this.y += dy * 0.05;
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if (document.getElementById('particles-game').classList.contains('active')) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Trail effect
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
            }
            requestAnimationFrame(animate);
        };

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
            mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        resetBtn.addEventListener('click', initParticles);

        initParticles();
        animate();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stressReliefGames = new StressReliefGames();
});
