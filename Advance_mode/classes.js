// Enemy projectile class
class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 10;
        this.color = 'yellow';
        this.height = 3;
    }

    draw() {
        c.save();
        c.translate(this.position.x, this.position.y);
        
        c.shadowBlur = this.glowIntensity;
        c.shadowColor = this.color;
    
        c.fillStyle = this.color;
        c.fillRect(-3, 0, 2, this.height);  // Left beam
        c.fillRect(3, 0, 2, this.height);   // Right beam
        
        c.restore();
    }
    
    

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius*2;
        this.color = color;
        this.velocity = { x: 0, y: 0 }; // Initialize velocity
        this.speed = 3; // Normal speed
        this.boostedSpeed = 6; // Speed during boost
        this.isBoosted = false; // Track boost state
        this.glowIntensity = 15; // Default glow intensity
    }

    draw() {
        c.save();
        c.translate(this.x, this.y);
        c.rotate(Math.atan2(this.velocity.y, this.velocity.x)); // Rotate towards movement

        c.shadowBlur = this.glowIntensity;
        c.shadowColor = this.color;

        // Diamond Shape (Outer Glowing Body)
        c.beginPath();
        c.moveTo(0, -this.radius);  // Top point
        c.lineTo(-this.radius, 0);  // Left point
        c.lineTo(0, this.radius);   // Bottom point
        c.lineTo(this.radius, 0);   // Right point
        c.closePath();
        c.fillStyle = this.color;
        c.fill();

        // Inner Core (Black Center)
        c.beginPath();
        c.moveTo(0, -this.radius / 2);
        c.lineTo(-this.radius / 2, 0);
        c.lineTo(0, this.radius / 2);
        c.lineTo(this.radius / 2, 0);
        c.closePath();
        c.fillStyle = "black";
        c.fill();

        // Pupil (Glowing Red Core)
        c.beginPath();
        c.arc(0, 0, this.radius / 4, 0, Math.PI * 2);
        c.fillStyle = "white";
        c.fill();

        c.restore();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Prevent the player from going out of bounds
        if (this.x - this.radius < 0) this.x = this.radius;
        if (this.x + this.radius > canvas.width) this.x = canvas.width - this.radius;
        if (this.y - this.radius < 0) this.y = this.radius;
        if (this.y + this.radius > canvas.height) this.y = canvas.height - this.radius;

        this.draw(); // Call draw method to render the player
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        c.save();
        c.translate(this.x, this.y);
        c.shadowBlur = this.glowIntensity;
        c.shadowColor = this.color;

        // Outer glowing ring
        c.beginPath();
        c.arc(0, 0, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();

        // Inner core (darker shade)
        c.beginPath();
        c.arc(0, 0, this.radius / 2, 0, Math.PI * 2);
        c.fillStyle = "black";
        c.fill();

        // Pupil (small glowing center)
        c.beginPath();
        c.arc(0, 0, this.radius / 4, 0, Math.PI * 2);
        c.fillStyle = "white";
        c.fill();

        c.restore();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.glowIntensity = Math.random() * 20 + 10;  // Random glow intensity
    }

    draw() {
        c.save();
        c.translate(this.x, this.y);
        c.shadowBlur = 30;
        c.shadowColor = this.color;
    
        // Outer glowing ring
        c.beginPath();
        c.arc(0, 0, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
    
        // Inner "eye" effect
        c.beginPath();
        c.arc(0, 0, this.radius / 2, 0, Math.PI * 2);
        c.fillStyle = "black";
        c.fill();
    
        // Pupil that "charges up"
        c.beginPath();
        c.arc(0, 0, this.radius / 4, 0, Math.PI * 2);
        c.fillStyle = "red";
        c.fill();
    
        c.restore();
    }

    update(player) {
        // Move toward the player
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.velocity.x = Math.cos(angle) * enemySpeed;
        this.velocity.y = Math.sin(angle) * enemySpeed;

        // Update position
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Draw the enemy with the glow effect
        this.draw();
    }

    // Enemy shooting logic
    shoot(invaderProjectiles) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        const velocity = {
            x: Math.cos(angle) * 3,
            y: Math.sin(angle) * 3
        };
        invaderProjectiles.push(new InvaderProjectile({
            position: { x: this.x, y: this.y },
            velocity: velocity
        }));
    }
}

const friction = 0.99;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;
    }
}

// Star particle class (using existing Particle class logic)
class Star {
    constructor({ position, velocity, radius }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.draw();

        // If star moves off screen, reset it to the top
        if (this.position.y > canvas.height) {
            this.position.x = Math.random() * canvas.width;
            this.position.y = -this.radius;
        }
    }
}

// In classes.js
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'triple', 'spread5'
        this.radius = 15; // Increased size for better visibility
        this.color = type === 'triple' ? 'blue' : 'green';
        this.glowColor = type === 'triple' ? 'cyan' : 'lime';
    }

    draw() {
        c.save();
        c.shadowBlur = 20;
        c.shadowColor = this.glowColor;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }

    update() {
        this.draw();
    }
}
