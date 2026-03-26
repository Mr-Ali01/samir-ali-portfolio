document.addEventListener('DOMContentLoaded', () => {
    // 0. Navbar Scroll Logic
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 1. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 80,
            easing: 'ease-out-back'
        });
    }

    // 2. Lucide Icons instance refresh
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Hero Particles Background
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;

        function initParticles() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 200 + 50,
                    opacity: Math.random() * 0.1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    color: Math.random() > 0.5 ? '#38BDF8' : '#8B5CF6'
                });
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                gradient.addColorStop(0, `${p.color}${Math.floor(p.opacity * 255).toString(16).padStart(2, '0')}`);
                gradient.addColorStop(1, `${p.color}00`);
                ctx.fillStyle = gradient;
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < -p.size) p.x = canvas.width + p.size;
                if (p.x > canvas.width + p.size) p.x = -p.size;
                if (p.y < -p.size) p.y = canvas.height + p.size;
                if (p.y > canvas.height + p.size) p.y = -p.size;
            });
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', initParticles);
        initParticles();
        animateParticles();
    }

    // 4. Smooth Scrolling Integration
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 5. Card Physics Interaction: Parallax Tilt (Optional subtle effect)
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 80;
            const rotateY = (centerX - x) / 80;
            card.style.transform = `perspective(1000px) translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
             card.style.transform = `perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg)`;
        });
    });

    console.log("🚀 Project page animations initialized.");
});
