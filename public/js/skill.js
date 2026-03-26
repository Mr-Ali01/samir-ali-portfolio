document.addEventListener('DOMContentLoaded', () => {
    // 0. Navbar Scrolled Logic
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

    // 2. Lucide Icons Refresher
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Simple Theme Persistence (Sync with Home)
    const savedTheme = localStorage.getItem('portfolio-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // 4. Subtle Cursor Parallax Effect for Banner (Optional)
    const hero = document.querySelector('h1 span');
    document.addEventListener('mousemove', (e) => {
        if (hero) {
            const x = (e.clientX - window.innerWidth / 2) * 0.01;
            const y = (e.clientY - window.innerHeight / 2) * 0.01;
            hero.style.textShadow = `${x}px ${y}px 20px rgba(56, 189, 248, 0.5)`;
        }
    });

    // 5. Interaction: Animated Pill Entry Delay
    const skillPills = document.querySelectorAll('.skill-pill');
    skillPills.forEach((pill, index) => {
        pill.style.opacity = '0';
        pill.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            pill.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            pill.style.opacity = '1';
            pill.style.transform = 'translateY(0)';
        }, 100 + (index * 40));
    });

    console.log("🛠️ Skills page interactions active.");
});
