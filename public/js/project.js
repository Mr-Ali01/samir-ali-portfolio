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

    //* Custom Selection */
    const style = document.createElement('style');
    style.textContent = `
        ::selection {
            background: #38BDF8;
            color: white;
        }
        @keyframes scroll-vertical {
            0% { transform: translateY(0); }
            50% { transform: translateY(calc(-100% + 220px)); }
            100% { transform: translateY(0); }
        }
        .animate-scroll-vertical {
            animation: scroll-vertical 15s ease-in-out infinite;
        }
        .hover\:pause-scroll:hover {
            animation-play-state: paused;
        }
    `;
    document.head.appendChild(style);

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
        anchor.addEventListener('click', function (e) {
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
                            <article class="project-card group flex flex-col h-[460px] w-full max-w-[350px] mx-auto bg-[var(--theme-card-bg)] rounded-[2rem] border border-[var(--theme-card-border)] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative" data-aos="fade-up" data-aos-delay="${delay}">
                                
                                <!-- Image Section (Top) -->
                                <div class="relative w-full h-[220px] overflow-hidden group/image flex-shrink-0 bg-slate-100 dark:bg-slate-900 border-b border-[var(--theme-card-border)]">
                                    <!-- Newly Launched Label -->
                                    <div class="absolute top-4 left-4 z-20 bg-gradient-to-r from-theme-primary to-theme-secondary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 neon-glow">
                                        <div class="relative flex items-center justify-center">
                                            <div class="w-2 h-2 bg-white rounded-full animate-ping absolute opacity-80"></div>
                                            <div class="w-1.5 h-1.5 bg-white rounded-full relative z-10"></div> 
                                        </div>
                                        NEWLY LAUNCHED
                                    </div>
                                    
                                    <!-- Scrolling Image Container -->
                                    <div class="w-full absolute top-0 left-0 hover:pause-scroll animate-scroll-vertical group-hover:scale-105 transition-transform duration-[10s]">
                                        <img src="${p.preview_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000'}" alt="${p.name}" class="w-full h-auto min-h-[400px] object-cover object-top">
                                    </div>
                                    
                                    <!-- Overlay Gradient -->
                                    <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--theme-card-bg)] via-[var(--theme-card-bg)]/50 to-transparent z-10 pointer-events-none"></div>
                                </div>

                                <!-- Card Content Structure -->
                                <div class="p-6 flex flex-col flex-1 relative z-20 w-full overflow-hidden">
                                    
                                    <!-- Tech Stack (Strict Fixed Height) -->
                                    <div class="flex flex-wrap gap-2 mb-4 h-[32px] overflow-hidden content-start flex-shrink-0 pt-1">
                                        ${techTags}
                                    </div>

                                    <!-- Title (Strict Fixed Height) -->
                                    <h3 class="text-xl font-black text-[var(--theme-text-primary)] mb-2 tracking-tight line-clamp-1 h-[28px] overflow-hidden flex-shrink-0" title="${p.name}">${p.name}</h3>
                                    
                                    <!-- Description (Strict Fixed Height) -->
                                    <p class="text-[var(--theme-text-secondary)] text-sm mb-5 line-clamp-2 leading-relaxed h-[48px] flex-shrink-0">
                                        ${p.short_description}
                                    </p>

                                    <!-- Bottom Buttons -->
                                    <div class="flex flex-col sm:flex-row items-center gap-3 mt-auto pt-4 border-t border-[var(--theme-card-border)]/50 flex-shrink-0 w-full">
                                        <a href="${p.live_link}" target="_blank" rel="noopener noreferrer" class="w-full sm:flex-1 bg-gradient-to-r from-theme-primary to-theme-secondary hover:shadow-[0_0_20px_var(--theme-accent-primary)] hover:-translate-y-1 transition-all duration-300 py-3 px-3 rounded-xl text-white text-[11px] uppercase font-black tracking-wider text-center flex items-center justify-center gap-2 whitespace-nowrap">Live Demo <i data-lucide="external-link" class="w-3.5 h-3.5"></i></a>
                                        <a href="${p.github_link}" target="_blank" rel="noopener noreferrer" class="w-full sm:flex-1 bg-slate-100 dark:bg-white/5 hover:bg-[var(--theme-card-border)] transition-colors duration-300 py-3 px-3 rounded-xl text-[var(--theme-text-primary)] text-[11px] uppercase font-black tracking-wider hover:text-theme-primary hover:-translate-y-1 text-center flex items-center justify-center gap-2 border border-[var(--theme-card-border)] whitespace-nowrap" title="GitHub Repository">Source Code <i data-lucide="github" class="w-3.5 h-3.5"></i></a>
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
                                    <h3 class="text-lg md:text-xl font-black text-[var(--theme-text-primary)]">${p.name}</h3>
                                    <i data-lucide="external-link" class="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity text-[var(--theme-text-primary)]"></i>
                                </div>
                                <p class="text-[var(--theme-text-secondary)] text-sm mb-6">${p.short_description}</p>
                                <div class="flex flex-wrap gap-4 mt-auto">
                                    <a href="${p.live_link}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1">Live Demo <i data-lucide="link" class="w-3 h-3"></i></a>
                                    <a href="${p.github_link}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-[var(--theme-text-secondary)] hover:text-theme-primary transition-colors flex items-center gap-1">Repository <i data-lucide="github" class="w-3 h-3"></i></a>
                                </div>
                            </div>
                        `;
                        utilityList.insertAdjacentHTML('beforeend', html);
                    } else if (p.category === 'Design') {
                        if (!designList) return;
                        const html = `
                            <div class="utility-card p-6 group h-full" data-aos="fade-up" data-aos-delay="${delay}">
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-lg md:text-xl font-black text-[var(--theme-text-primary)]">${p.name}</h3>
                                    <i data-lucide="layout" class="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity text-[var(--theme-text-primary)]"></i>
                                </div>
                                <p class="text-[var(--theme-text-secondary)] text-sm mb-6">${p.short_description}</p>
                                <div class="flex flex-wrap gap-4 mt-auto">
                                    <a href="${p.live_link}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-theme-primary hover:underline flex items-center gap-1">Live Demo <i data-lucide="link" class="w-3 h-3"></i></a>
                                    <a href="${p.github_link}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-[var(--theme-text-secondary)] hover:text-theme-primary transition-colors flex items-center gap-1">Repository <i data-lucide="github" class="w-3 h-3"></i></a>
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
