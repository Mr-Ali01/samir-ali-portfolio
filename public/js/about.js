document.addEventListener('DOMContentLoaded', () => {
    // 0. Navbar Scrolled Trigger
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
            duration: 1200,
            once: true,
            offset: 100
        });
    }

    // 2. Stars/Particles Background Animation
    const canvas = document.getElementById('starsCanvas');
    const ctx = canvas.getContext('2d');
    let stars = [];
    const starCount = 150;

    function initStars() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2,
                opacity: Math.random(),
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            star.y -= star.speed;
            if (star.y < 0) {
                star.y = canvas.height;
                star.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', initStars);
    initStars();
    animateStars();

    // 3. Floating Icons Interaction
    const floatingIcons = document.querySelectorAll('.animate-float');
    floatingIcons.forEach(icon => {
        icon.addEventListener('mousemove', (e) => {
            const rect = icon.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            icon.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        icon.addEventListener('mouseleave', () => {
             icon.style.transform = `translate(0, 0)`;
        });
    });

    // 4. Lucide Icons Instance Refresh
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 5. Smooth Scroll for Page
    document.documentElement.style.scrollBehavior = 'smooth';
    
    console.log("✨ About page interactions loaded.");
});
