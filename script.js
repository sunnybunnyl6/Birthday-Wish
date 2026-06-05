/* =======================================
   CANVAS SUNSET ANIMATION
   ======================================= */
class SunsetAnimator {
    constructor() {
        this.canvas = document.getElementById('sunsetCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.time = 0;
        this.animate();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.time += 0.002;
        this.drawSunset();
        requestAnimationFrame(() => this.animate());
    }

    drawSunset() {
        // Sky gradient based on time
        const topColor = this.interpolateColor(
            { r: 135, g: 206, b: 235 },
            { r: 10, g: 22, b: 40 },
            Math.min(this.time, 1)
        );

        const bottomColor = this.interpolateColor(
            { r: 255, g: 140, b: 66 },
            { r: 10, g: 22, b: 40 },
            Math.min(this.time, 1)
        );

        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, `rgb(${topColor.r}, ${topColor.g}, ${topColor.b})`);
        gradient.addColorStop(0.5, `rgb(${Math.floor(255 * (1 - this.time * 0.5))}, ${Math.floor(140 + 60 * this.time)}, ${Math.floor(100 * (1 - this.time))})`);
        gradient.addColorStop(1, `rgb(${bottomColor.r}, ${bottomColor.g}, ${bottomColor.b})`);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sun
        this.drawSun();

        // Draw clouds
        this.drawClouds();

        // Draw ocean
        this.drawOcean();

        // Draw birds
        this.drawBirds();
    }

    drawSun() {
        const sunY = this.canvas.height * 0.4 + this.time * this.canvas.height * 0.3;
        const sunX = this.canvas.width / 2;

        // Sun glow
        const glowGradient = this.ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 150);
        glowGradient.addColorStop(0, `rgba(255, 215, 0, ${0.4 * (1 - this.time)})`);
        glowGradient.addColorStop(1, `rgba(255, 215, 0, ${0.1 * (1 - this.time)})`);

        this.ctx.fillStyle = glowGradient;
        this.ctx.fillRect(sunX - 200, sunY - 200, 400, 400);

        // Sun
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawClouds() {
        const cloudOffset = (this.time * 20) % this.canvas.width;

        for (let i = 0; i < 3; i++) {
            this.drawCloud(
                (cloudOffset + i * 300) % this.canvas.width,
                100 + i * 50,
                100
            );
        }
    }

    drawCloud(x, y, size) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * (1 - this.time)})`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size, 0, Math.PI * 2);
        this.ctx.arc(x + size * 1.2, y, size * 0.8, 0, Math.PI * 2);
        this.ctx.arc(x - size * 1.2, y, size * 0.8, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawOcean() {
        const waterY = this.canvas.height * 0.6;
        const waterGradient = this.ctx.createLinearGradient(0, waterY, 0, this.canvas.height);

        const topWaterColor = this.interpolateColor(
            { r: 100, g: 180, b: 220 },
            { r: 20, g: 40, b: 80 },
            Math.min(this.time, 1)
        );

        waterGradient.addColorStop(0, `rgb(${topWaterColor.r}, ${topWaterColor.g}, ${topWaterColor.b})`);
        waterGradient.addColorStop(1, `rgba(10, 22, 40, 0.9)`);

        this.ctx.fillStyle = waterGradient;
        this.ctx.fillRect(0, waterY, this.canvas.width, this.canvas.height - waterY);

        // Draw waves
        this.drawWaves(waterY);
    }

    drawWaves(baseY) {
        this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - this.time * 0.5)})`;
        this.ctx.lineWidth = 2;

        for (let i = 0; i < 3; i++) {
            const offsetY = baseY + i * 40;
            const waveOffset = (this.time * 100 + i * 50) % this.canvas.width;

            this.ctx.beginPath();
            for (let x = 0; x <= this.canvas.width; x += 30) {
                const y = offsetY + Math.sin((x + waveOffset) * 0.01) * 20;
                if (x === 0) this.ctx.moveTo(x, y);
                else this.ctx.lineTo(x, y);
            }
            this.ctx.stroke();
        }
    }

    drawBirds() {
        const birds = [
            { x: 200, speed: 0.5 },
            { x: 600, speed: 0.3 },
            { x: 1000, speed: 0.4 }
        ];

        birds.forEach(bird => {
            const birdX = (bird.x + this.time * 100 * bird.speed) % this.canvas.width;
            const birdY = 200 + Math.sin(this.time * bird.speed) * 50;

            this.drawBird(birdX, birdY);
        });
    }

    drawBird(x, y) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 20, y - 10);
        this.ctx.lineTo(x + 40, y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(x + 20, y, 8, 0, Math.PI * 2);
        this.ctx.fill();
    }

    interpolateColor(color1, color2, factor) {
        return {
            r: Math.floor(color1.r + (color2.r - color1.r) * factor),
            g: Math.floor(color1.g + (color2.g - color1.g) * factor),
            b: Math.floor(color1.b + (color2.b - color1.b) * factor)
        };
    }
}

/* =======================================
   CONFETTI ANIMATION
   ======================================= */
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#FFD700', '#FF8C42', '#DDA0DD', '#FFB6C1', '#8B4FB6'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.setProperty('--confetti-color', colors[Math.floor(Math.random() * colors.length)]);
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.delay = (Math.random() * 0.5) + 's';

        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3500);
    }
}

/* =======================================
   FIREWORKS ANIMATION
   ======================================= */
function createFireworks() {
    const container = document.getElementById('fireworksContainer');
    const colors = ['#FFD700', '#FF8C42', '#DDA0DD', '#FFB6C1', '#FF69B4'];

    for (let burst = 0; burst < 8; burst++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight * 0.6);

            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';

                container.appendChild(particle);

                const angle = (i / 30) * Math.PI * 2;
                const velocity = 5 + Math.random() * 5;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;

                let px = x, py = y;
                let ax = vx, ay = vy + 0.1;

                const animate = () => {
                    px += ax;
                    py += ay;
                    particle.style.left = px + 'px';
                    particle.style.top = py + 'px';
                    particle.style.opacity = Math.max(0, 1 - (Date.now() % 1000) / 1000);

                    if (Date.now() % 1000 < 1000) {
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };

                animate();
            }
        }, burst * 300);
    }
}

function createFinalFireworks() {
    const container = document.getElementById('finalFireworksContainer');
    const colors = ['#FFD700', '#FF8C42', '#DDA0DD', '#FFB6C1', '#FF69B4'];

    for (let burst = 0; burst < 15; burst++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;

            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.boxShadow = `0 0 15px ${particle.style.background}`;
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';

                container.appendChild(particle);

                const angle = (i / 50) * Math.PI * 2;
                const velocity = 8 + Math.random() * 8;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;

                let px = x, py = y;
                let gravity = 0.15;

                const startTime = Date.now();
                const duration = 2000;

                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    if (elapsed > duration) {
                        particle.remove();
                        return;
                    }

                    px += vx;
                    py += vy;
                    vy += gravity;

                    particle.style.left = px + 'px';
                    particle.style.top = py + 'px';
                    particle.style.opacity = 1 - (elapsed / duration);

                    requestAnimationFrame(animate);
                };

                animate();
            }
        }, burst * 200);
    }
}

/* =======================================
   STARS CREATION
   ======================================= */
function createStars() {
    const container = document.getElementById('starsContainer');
    const starCount = 50;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';

        container.appendChild(star);
    }
}

/* =======================================
   FLOATING LANTERNS
   ======================================= */
function createLanterns() {
    const container = document.getElementById('lanternsContainer');

    for (let i = 0; i < 10; i++) {
        const lantern = document.createElement('div');
        lantern.className = 'lantern';
        lantern.style.left = Math.random() * 100 + '%';
        lantern.style.bottom = '-50px';
        lantern.style.animationDelay = (i * 0.5) + 's';

        container.appendChild(lantern);

        setTimeout(() => lantern.remove(), 10500);
    }
}

/* =======================================
   FLOATING HEARTS
   ======================================= */
function createHearts() {
    const container = document.getElementById('heartsContainer');

    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '-50px';
        heart.style.animationDelay = '0s';
        heart.style.animationDuration = (4 + Math.random() * 3) + 's';

        container.appendChild(heart);

        setTimeout(() => heart.remove(), 8000);
    }, 800);
}

/* =======================================
   GLOWING BUTTERFLIES
   ======================================= */
function createButterflies() {
    const container = document.getElementById('butterfliesContainer');

    setInterval(() => {
        const butterfly = document.createElement('div');
        butterfly.className = 'butterfly';
        butterfly.textContent = '🦋';
        butterfly.style.left = Math.random() * 100 + '%';
        butterfly.style.top = Math.random() * 100 + '%';
        butterfly.style.animationDelay = (Math.random() * 2) + 's';
        butterfly.style.animationDuration = (6 + Math.random() * 4) + 's';

        container.appendChild(butterfly);

        setTimeout(() => butterfly.remove(), 10000);
    }, 1500);
}

/* =======================================
   CAKE CANDLE INTERACTION
   ======================================= */
function setupCakeInteraction() {
    const candles = document.querySelectorAll('.candle');
    const blowBtn = document.getElementById('blowBtn');
    let litCandles = 0;

    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            if (!candle.classList.contains('lit')) {
                candle.classList.add('lit');
                litCandles++;

                if (litCandles === candles.length) {
                    blowBtn.disabled = false;
                }
            }
        });
    });

    blowBtn.addEventListener('click', () => {
        candles.forEach(candle => {
            candle.classList.remove('lit');
        });
        litCandles = 0;
        blowBtn.disabled = true;

        createConfetti();
        createFireworks();
    });
}

/* =======================================
   SCROLL ANIMATION TRIGGER
   ======================================= */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(element => {
        element.style.animationPlayState = 'paused';
        observer.observe(element);
    });
}

/* =======================================
   CELEBRATE BUTTON
   ======================================= */
function setupCelebrateButton() {
    const celebrateBtn = document.getElementById('celebrateBtn');
    const bgMusic = document.getElementById('bgMusic');

    celebrateBtn.addEventListener('click', () => {
        bgMusic.play().catch(() => {
            console.log('Audio autoplay prevented by browser');
        });
        
        createConfetti();
        createFireworks();

        celebrateBtn.style.animation = 'none';
        setTimeout(() => {
            celebrateBtn.style.animation = '';
        }, 10);
    });
}

/* =======================================
   FINAL CELEBRATION TRIGGER
   ======================================= */
function setupFinalCelebration() {
    const finalMessage = document.querySelector('.final-message');
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !window.finalCelebrationTriggered) {
                window.finalCelebrationTriggered = true;
                createLanterns();
                createFinalFireworks();
            }
        });
    }, observerOptions);

    observer.observe(finalMessage);
}

/* =======================================
   INITIALIZATION
   ======================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize sunset animation
    new SunsetAnimator();

    // Create initial stars
    createStars();

    // Setup interactions
    setupCakeInteraction();
    setupCelebrateButton();
    setupScrollAnimations();
    setupFinalCelebration();

    // Start ambient animations
    createHearts();
    createButterflies();

    // Add scroll event listener for smooth animations
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                ticking = false;
            });
            ticking = true;
        }
    });

    // Attempt to play audio on first interaction if not already playing
    document.addEventListener('click', () => {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic.paused) {
            bgMusic.play().catch(() => {
                console.log('Audio playback not available');
            });
        }
    }, { once: true });
});