const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const msg = document.getElementById('message');
const bgMusic = document.getElementById('bgMusic');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function spawnConfetti() {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    // Random position
    let x = Math.random() * window.innerWidth;
    let y = -20;
    
    // Random colors
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd700', '#ff69b4', '#00d2d3', '#ffb347', '#98d8c8'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.backgroundColor = color;
    
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.body.appendChild(confetti);

    setTimeout(() => { 
        confetti.style.opacity = '1'; 
        confetti.style.top = `${window.innerHeight + 20}px`;
    }, 100);    

    setTimeout(() => { confetti.remove(); }, 8100);
}

function startShow() {
    document.getElementById('overlay').style.display = 'none';
    msg.style.visibility = 'visible';
    
    // Try to play background music
    bgMusic.play().catch(() => {
        console.log('Background music autoplay blocked by browser');
    });

    spawnConfetti(); // First confetti immediately
    setInterval(spawnConfetti, 300); 
    setInterval(createFirework, 600);
    animate();
}

class Particle {
    constructor(x, y, color) {
        this.x = x; 
        this.y = y; 
        this.color = color;
        this.velocity = { 
            x: (Math.random() - 0.5) * 12, 
            y: (Math.random() - 0.5) * 12 
        };
        this.alpha = 1; 
        this.friction = 0.95;
    }
    
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color; 
        ctx.fill();
    }
    
    update() {
        this.velocity.x *= this.friction; 
        this.velocity.y *= this.friction;
        this.x += this.velocity.x; 
        this.y += this.velocity.y;
        this.alpha -= 0.015; 
    }
}

let particles = [];

function animate() {
    requestAnimationFrame(animate);
    
    // Clear the canvas so the gradient background shows through
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, i) => {
        if (p.alpha > 0) { 
            p.update(); 
            p.draw(); 
        } else { 
            particles.splice(i, 1); 
        }
    });
}

function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height * 0.7); // Keep fireworks in upper area
    const color = `hsl(${Math.random() * 360}, 100%, 75%)`;
    
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle(x, y, color));
    }
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
