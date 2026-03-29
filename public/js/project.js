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

    // 6. Dynamic Content Loader
    const loadProjects = async () => {
        try {
            const res = await fetch('/api/v1/manage/projects');
            const data = await res.json();
            if (data.success) {
                const projects = data.data;
                const featuredGrid = document.getElementById('featured-projects-grid');
                const utilityList = document.getElementById('utility-tools-list');
                const designList = document.getElementById('ui-design-list');

                if (featuredGrid) featuredGrid.innerHTML = '';
                if (utilityList) utilityList.innerHTML = '';
                if (designList) designList.innerHTML = '';

                projects.forEach((p, index) => {
                    const delay = (index % 3) * 100;
                    const techTags = (p.tech_stack || '').split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('');
                    
                    if (p.category === 'Featured') {
                        if (!featuredGrid) return;
                        const html = `
                            <article class="project-card group" data-aos="fade-up" data-aos-delay="${delay}">
                                <div class="project-image-container">
                                    <img src="${p.preview_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000'}" alt="${p.name}">
                                </div>
                                <div class="project-content p-8">
                                    <div class="flex flex-wrap gap-2 mb-6">
                                        ${techTags}
                                    </div>
                                    <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-3">${p.name}</h3>
                                    <p class="text-slate-500 dark:text-theme-textSecondary text-sm leading-relaxed mb-8 h-12 overflow-hidden line-clamp-2">
                                        ${p.short_description}
                                    </p>
                                    <div class="flex items-center gap-3">
                                        <a href="${p.live_link}" class="btn-primary flex-1 py-3 text-xs uppercase font-black tracking-widest text-center">Live Demo <i data-lucide="arrow-up-right" class="w-3 h-3 inline ml-1"></i></a>
                                        <a href="${p.github_link}" class="btn-secondary px-6 py-3 text-xs uppercase font-black text-center"><i data-lucide="github" class="w-4 h-4"></i></a>
                                    </div>
                                </div>
                            </article>
                        `;
                        featuredGrid.insertAdjacentHTML('beforeend', html);
                    } else if (p.category === 'Utility') {
                        if (!utilityList) return;
                        const html = `
                            <div class="utility-card p-6" data-aos="fade-up" data-aos-delay="${delay}">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-xl font-black text-slate-900 dark:text-white">${p.name}</h3>
                                    <i data-lucide="external-link" class="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity"></i>
                                </div>
                                <p class="text-slate-500 dark:text-theme-textSecondary text-sm mb-6">${p.short_description}</p>
                                <div class="flex gap-4">
                                    <a href="${p.live_link}" class="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1">Live Demo <i data-lucide="link" class="w-3 h-3"></i></a>
                                    <a href="${p.github_link}" class="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1">Repository <i data-lucide="github" class="w-3 h-3"></i></a>
                                </div>
                            </div>
                        `;
                        utilityList.insertAdjacentHTML('beforeend', html);
                    } else if (p.category === 'Design') {
                        if (!designList) return;
                        const html = `
                            <div class="utility-card p-6 group h-full" data-aos="fade-up" data-aos-delay="${delay}">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-xl font-black text-slate-900 dark:text-white">${p.name}</h3>
                                    <i data-lucide="layout" class="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity"></i>
                                </div>
                                <p class="text-slate-500 dark:text-theme-textSecondary text-sm mb-6">${p.short_description}</p>
                                <div class="flex gap-4">
                                    <a href="${p.live_link}" class="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1">Live Demo <i data-lucide="link" class="w-3 h-3"></i></a>
                                    <a href="${p.github_link}" class="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1">Repository <i data-lucide="github" class="w-3 h-3"></i></a>
                                </div>
                            </div>
                        `;
                        designList.insertAdjacentHTML('beforeend', html);
                    }
                });

                // Refresh Icons & AOS
                if (typeof lucide !== 'undefined') lucide.createIcons();
                if (typeof AOS !== 'undefined') AOS.refresh();
                
                // Re-bind card tilt logic
                bindCardTilt();
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const bindCardTilt = () => {
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
    };

    loadProjects();
});
