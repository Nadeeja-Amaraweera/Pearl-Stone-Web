const sections = document.querySelectorAll('.fade-section');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});
sections.forEach(sec => observer.observe(sec));

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if(mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if(navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('glass-effect', 'shadow-lg');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('glass-effect', 'shadow-lg');
            navbar.classList.add('bg-transparent');
        }
    });
}

// Add bubble animation CSS dynamically
if (!document.getElementById('bubble-style')) {
    const style = document.createElement('style');
    style.id = 'bubble-style';
    style.textContent = `
        @keyframes floatDown {
            0% { transform: translateY(-50px) scale(0.8) rotate(0deg); opacity: 0; }
            10% { opacity: 0.5; }
            90% { opacity: 0.5; }
            100% { transform: translateY(120vh) scale(1.2) rotate(360deg); opacity: 0; }
        }
        .bubble-anim {
            animation: floatDown linear infinite;
            box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.5);
            backdrop-filter: blur(2px);
        }
    `;
    document.head.appendChild(style);
}

// Falling bubbles effect for white screens
const bubbleContainers = document.querySelectorAll('.bubbles-container, #bubbles-container');
if(bubbleContainers.length > 0) {
    bubbleContainers.forEach(container => {
        const createBubble = () => {
            const bubble = document.createElement('div');
            bubble.classList.add('absolute', 'rounded-full', 'bubble-anim');
            
            // Random size between 10px and 60px
            const size = Math.random() * 50 + 10;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            // Random left position
            bubble.style.left = `${Math.random() * 100}%`;
            
            // Random blue shade with gradient for realistic bubble effect
            const opacity = Math.random() * 0.15 + 0.05;
            bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(59, 130, 246, ${opacity}))`;
            bubble.style.border = `1px solid rgba(59, 130, 246, ${opacity + 0.1})`;
            
            // Random animation duration between 6s and 15s
            const duration = Math.random() * 9 + 6;
            bubble.style.animationDuration = `${duration}s`;
            
            // Random slight delay
            bubble.style.animationDelay = `${Math.random() * 2}s`;
            
            container.appendChild(bubble);
            
            // Remove bubble after animation ends to prevent memory leak
            setTimeout(() => {
                bubble.remove();
            }, (duration + 2) * 1000);
        };

        // Create bubbles initially to fill the screen
        for(let i=0; i<15; i++) {
            setTimeout(createBubble, i * 300);
        }

        // Continue creating bubbles
        setInterval(createBubble, 600);
    });
}

// Spider web (Particle network) effect in Hero Section
const heroSection = document.getElementById('hero-section');
const canvas = document.getElementById('hero-canvas');

if(heroSection && canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Mouse tracking
    let mouse = {
        x: null,
        y: null,
        radius: 180 // How far the mouse attracts/draws lines
    };
    
    heroSection.addEventListener('mousemove', function(event) {
        // Need coordinates relative to the hero section
        const rect = heroSection.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    
    heroSection.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    function initCanvas() {
        width = heroSection.clientWidth;
        height = heroSection.clientHeight;
        canvas.width = width;
        canvas.height = height;
        
        particles = [];
        // Determine number of particles based on screen size (density)
        let particleCount = Math.floor((width * height) / 10000);
        if (particleCount > 150) particleCount = 150; // Cap to avoid lag
        
        for (let i = 0; i < particleCount; i++) {
            let size = Math.random() * 2 + 1; // 1 to 3px
            let x = Math.random() * (width - size * 2) + size;
            let y = Math.random() * (height - size * 2) + size;
            let directionX = (Math.random() * 1.5) - 0.75;
            let directionY = (Math.random() * 1.5) - 0.75;
            
            particles.push({
                x, y, directionX, directionY, size
            });
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Move particles
            p.x += p.directionX;
            p.y += p.directionY;
            
            // Bounce off edges
            if (p.x > width || p.x < 0) p.directionX = -p.directionX;
            if (p.y > height || p.y < 0) p.directionY = -p.directionY;
            
            // Draw particle dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fill();
            
            // Check collisions between particles
            for (let j = i; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // Draw connecting lines if close
                if (distance < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - distance/120)})`; // Fading white line
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
            
            // Check collision with mouse
            if (mouse.x != null && mouse.y != null) {
                let dx = p.x - mouse.x;
                let dy = p.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // Draw connecting lines to mouse (Spider web effect)
                if (distance < mouse.radius) {
                    ctx.beginPath();
                    // Line gets thicker and more opaque the closer it is to the mouse
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * (1 - distance/mouse.radius)})`; 
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    
                    // Very slight attraction to the mouse to make it feel interactive
                    p.x -= dx * 0.01;
                    p.y -= dy * 0.01;
                }
            }
        }
    }
    
    // Initialize and handle resize
    initCanvas();
    animateParticles();
    
    window.addEventListener('resize', function() {
        initCanvas();
    });
}
