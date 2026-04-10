/* Dynamic Content Loader - Samir Ali Portfolio */

$(document).ready(function () {

    // 1. Fetch & Render Education & Certifications
    const loadEducation = async () => {
        try {
            // Fetch both in parallel
            const [eduRes, certRes] = await Promise.all([
                fetch('/api/v1/manage/education'),
                fetch('/api/v1/manage/certifications')
            ]);

            const eduData = await eduRes.json();
            const certData = await certRes.json();

            const academicList = $('#education-academic-list');
            const certList = $('#education-cert-list');

            // 1.1 Render Academic Journey
            if (eduData.success) {
                eduData.data.forEach(item => {
                    const html = `
                        <div class="relative mb-12 last:mb-0" data-aos="fade-up">
                            <div class="absolute -left-[32px] top-6 w-10 h-10 rounded-full glass-panel flex items-center justify-center z-20 border border-theme-primary/30 shadow-lg neon-glow">
                                <i data-lucide="graduation-cap" class="w-5 h-5 text-theme-primary"></i>
                            </div>
                            <div class="glass-panel p-6 rounded-2xl border border-white/10 hover:scale-[1.03] transition-all duration-300 ml-4 group">
                                <span class="text-theme-primary font-bold text-sm mb-2 block tracking-wide">${item.period}</span>
                                <h4 class="text-xl font-bold text-theme-textPrimary mb-1">${item.degree}</h4>
                                <p class="text-theme-textSecondary font-medium text-sm mb-3">${item.institution}</p>
                                ${item.description ? `<p class="text-theme-textSecondary text-xs leading-relaxed opacity-80">${item.description}</p>` : ''}
                            </div>
                        </div>
                    `;
                    academicList.append(html);
                });
            }

            // 1.2 Render Technical Certifications
            if (certData.success) {
                certData.data.forEach(item => {
                    const html = `
                        <div class="relative mb-10 last:mb-0" data-aos="fade-up">
                            <div class="absolute -left-[32px] top-6 w-10 h-10 rounded-full glass-panel flex items-center justify-center z-20 border border-theme-secondary/30 shadow-lg neon-glow">
                                <i data-lucide="badge-check" class="w-5 h-5 text-theme-secondary"></i>
                            </div>
                            <div class="glass-panel p-5 rounded-2xl border border-white/10 hover:scale-[1.03] transition-all duration-300 ml-4">
                                <h4 class="text-lg font-bold text-theme-textPrimary mb-1">${item.name}</h4>
                                <p class="text-theme-textSecondary font-medium text-sm mb-2">${item.issuer}</p>
                                <span class="text-xs font-bold text-theme-secondary bg-theme-secondary/10 px-3 py-1 rounded-full">Issued: ${item.date}</span>
                            </div>
                        </div>
                    `;
                    certList.append(html);
                });
            }

            lucide.createIcons();
        } catch (error) {
            console.error('Failed to load education/certs:', error);
        }
    };

    // 2. Fetch & Render Experience
    const loadExperience = async () => {
        // Similar logic for experience section if added to home page
    };

    // 3. Fetch & Render Projects (Home Page Filter logic & SaaS Template)
    const loadProjects = async () => {
        try {
            const res = await fetch('/api/v1/manage/projects');
            const data = await res.json();
            if (data.success) {
                const allProjects = data.data;
                const grid = $('#projects-grid');
                const noProjectsMsg = $('#no-projects-msg');
                let currentFilter = 'all';

                const renderProjects = () => {
                    grid.empty();

                    // Filter Logic
                    let filtered = [];
                    if (currentFilter === 'all') {
                        filtered = allProjects.filter(p => !p.category || p.category === 'Featured');
                    } else if (currentFilter === 'seo') {
                        filtered = allProjects.filter(p => (p.category || '').toLowerCase().includes('seo'));
                    } else {
                        filtered = allProjects.filter(p => (p.category || '').toLowerCase() === currentFilter);
                    }

                    // Strict Limit: Only show max 3 items
                    filtered = filtered.slice(0, 3);

                    if (filtered.length === 0) {
                        grid.hide();
                        noProjectsMsg.removeClass('hidden');
                    } else {
                        grid.show();
                        noProjectsMsg.addClass('hidden');

                        // Ensure styles for scrolling and animation exist on the home page globally
                        if (!document.getElementById('home-project-card-styles')) {
                            const style = document.createElement('style');
                            style.id = 'home-project-card-styles';
                            style.textContent = `
                                @keyframes scroll-vertical {
                                    0% { transform: translateY(0); }
                                    50% { transform: translateY(calc(-100% + 220px)); }
                                    100% { transform: translateY(0); }
                                }
                                .animate-scroll-vertical {
                                    animation: scroll-vertical 15s ease-in-out infinite;
                                }
                                .hover\\:pause-scroll:hover {
                                    animation-play-state: paused;
                                }
                            `;
                            document.head.appendChild(style);
                        }

                        filtered.forEach((p, index) => {
                            const delay = index * 100;
                            const techTags = (p.tech_stack || '').split(',')
                                .map(t => `<span class="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[var(--theme-text-primary)] text-[10px] font-black rounded-lg border border-[var(--theme-card-border)] shadow-sm truncate" style="max-width: 100px;">${t.trim()}</span>`)
                                .join('');

                            const html = `
                                <article class="project-card group flex flex-col w-full mx-auto bg-[var(--theme-card-bg)] rounded-[2rem] border border-[var(--theme-card-border)] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 relative" style="height: 460px; max-width: 350px;" data-aos="fade-up" data-aos-delay="${delay}">
                                    
                                    <!-- Image Section (Top) -->
                                    <div class="relative w-full overflow-hidden group/image flex-shrink-0 bg-slate-100 dark:bg-slate-900 border-b border-[var(--theme-card-border)]" style="height: 220px;">
                                        <!-- Newly Launched Label -->
                                        <div class="absolute top-4 left-4 z-20 bg-gradient-to-r from-theme-primary to-theme-secondary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2.5 neon-glow">
                                            <div class="relative flex items-center justify-center mr-0.5">
                                                <div class="w-2 h-2 bg-white rounded-full animate-ping absolute opacity-80"></div>
                                                <div class="w-1.5 h-1.5 bg-white rounded-full relative z-10"></div> 
                                            </div>
                                            <span style="padding-left: 5px;">NEWLY LAUNCHED</span>
                                        </div>
                                        
                                        <!-- Scrolling Image Container -->
                                        <div class="w-full absolute top-0 left-0 hover:pause-scroll animate-scroll-vertical group-hover:scale-105 transition-transform" style="transition-duration: 10s;">
                                            <img src="${p.preview_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000'}" alt="${p.name}" class="w-full h-auto object-cover object-top" style="min-height: 400px;">
                                        </div>
                                        
                                        <!-- Overlay Gradient -->
                                        <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--theme-card-bg)] via-[var(--theme-card-bg)]/50 to-transparent z-10 pointer-events-none"></div>
                                    </div>

                                    <!-- Card Content Structure -->
                                    <div class="p-6 flex flex-col flex-1 relative z-20 w-full overflow-hidden">
                                        
                                        <!-- Tech Stack (Strict Fixed Height) -->
                                        <div class="flex flex-wrap gap-2 mb-4 overflow-hidden content-start flex-shrink-0 pt-1" style="height: 32px;">
                                            ${techTags}
                                        </div>

                                        <!-- Title (Strict Fixed Height) -->
                                        <h3 class="text-xl font-black text-[var(--theme-text-primary)] mb-2 tracking-tight line-clamp-1 overflow-hidden flex-shrink-0" style="height: 28px;" title="${p.name}">${p.name}</h3>
                                        
                                        <!-- Description (Strict Fixed Height) -->
                                        <p class="text-[var(--theme-text-secondary)] text-sm mb-5 line-clamp-2 leading-relaxed flex-shrink-0" style="height: 48px;">
                                            ${p.short_description}
                                        </p>

                                        <!-- Bottom Buttons -->
                                        <div class="flex flex-row items-center gap-3 mt-auto pt-4 border-t border-[var(--theme-card-border)]/50 flex-shrink-0 w-full">
                                            <a href="${p.live_link}" target="_blank" rel="noopener noreferrer" class="flex-1 bg-gradient-to-r from-theme-primary to-theme-secondary hover:shadow-[0_0_20px_var(--theme-accent-primary)] hover:-translate-y-1 transition-all duration-300 py-3 px-4 rounded-xl text-white text-[11px] uppercase font-black tracking-wider text-center flex items-center justify-center gap-2">Live Demo <i data-lucide="external-link" class="w-3.5 h-3.5"></i></a>
                                            <a href="${p.github_link}" target="_blank" rel="noopener noreferrer" class="bg-slate-100 dark:bg-white/5 hover:bg-[var(--theme-card-border)] transition-colors duration-300 py-3 px-5 rounded-xl text-[var(--theme-text-primary)] hover:text-theme-primary hover:-translate-y-1 text-center flex items-center justify-center border border-[var(--theme-card-border)]" style="max-width: 60px;" title="GitHub Repository"><i data-lucide="github" class="w-4 h-4"></i></a>
                                        </div>
                                    </div>
                                </article>
                            `;
                            grid.append(html);
                        });

                        lucide.createIcons();
                        if (typeof AOS !== 'undefined') AOS.refresh();
                    }
                };

                // Initial Render
                renderProjects();

                // Bind Filter Buttons
                $('.filter-btn').on('click', function () {
                    // Update active state visuals
                    $('.filter-btn').removeClass('active bg-theme-primary text-white neon-glow')
                        .addClass('bg-white text-slate-600')
                        .css('filter', '');

                    $(this).removeClass('bg-white text-slate-600')
                        .addClass('active bg-theme-primary text-white neon-glow');

                    const selectedFilter = $(this).data('filter');

                    // Simple fade animation for transition
                    grid.css('opacity', '0');
                    setTimeout(() => {
                        currentFilter = selectedFilter;
                        renderProjects();
                        grid.css('opacity', '1');
                    }, 300);
                });
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    // 4. Fetch & Render Hero section (from dedicated hero_section table)
    const loadHero = async () => {
        try {
            const res = await fetch('/api/v1/manage/hero_section');
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                const hero = data.data[0];

                // 1. Text & Stats Content
                $('#hero-status').text(hero.status_badge || 'Available now');
                $('#hero-description').text(hero.headline);

                // 2. Name Splitting Logic (FirstName. LastName.)
                const fullName = hero.main_name || 'SAMIR ALY';
                const names = fullName.trim().split(' ');
                if (names.length >= 2) {
                    $('#hero-name-1').text(`${names[0]}.`);
                    $('#hero-name-2').text(`${names.slice(1).join(' ')}.`);
                } else {
                    $('#hero-name-1').text(fullName);
                    $('#hero-name-2').text('');
                }

                // 3. Image Handling
                if (hero.image_url) {
                    $('#hero-img').attr('src', hero.image_url);
                }

                // 4. Buttons Mapping (Direct from columns)
                if (hero.btn_1_label) $('#hero-btn-1-text').text(hero.btn_1_label);
                if (hero.btn_2_label) $('#hero-btn-2-text').text(hero.btn_2_label);
                if (hero.btn_3_label) $('#hero-btn-3-text').text(hero.btn_3_label);

                // 5. Stats Mapping (Direct from columns)
                for (let i = 1; i <= 3; i++) {
                    const val = hero[`stat_${i}_val`];
                    const lab = hero[`stat_${i}_lab`];
                    if (val) $(`#hero-stat-val-${i}`).text(val);
                    if (lab) $(`#hero-stat-lab-${i}`).text(lab);
                }
            }
        } catch (error) {
            console.error('Failed to load hero section:', error);
        }
    };

    // 5. Fetch & Render About Section (Mini/Home)
    const loadAbout = async () => {
        try {
            const res = await fetch('/api/v1/manage/about');
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                const about = data.data[0];
                $('#about-title').text(about.title);
                const descHtml = (about.description || '').replace(/\n/g, '<br>');
                $('#about-description').html(descHtml);
                if (about.image_url && $('#about-img').length) {
                    $('#about-img').attr('src', about.image_url);
                }
            }
        } catch (error) {
            console.error('Failed to load about section:', error);
        }
    };

    // 5.1 Fetch & Render FULL About Page Content
    const loadAboutPage = async () => {
        try {
            const res = await fetch('/api/v1/manage/about_page');
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                const about = data.data[0];
                $('#about-page-badge').text(about.badge_text || '🚀 ABOUT ME');
                $('#about-page-title').text(about.title);

                // Map description with line breaks preserved
                const descHtml = (about.description || '').split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
                $('#about-page-description').html(descHtml);

                if (about.image_url && $('#about-page-img').length) {
                    $('#about-page-img').attr('src', about.image_url);
                }
            }
        } catch (error) {
            console.error('Failed to load full about page:', error);
        }
    };

    // 6. Fetch & Render Skills
    const loadSkills = async () => {
        try {
            const res = await fetch('/api/v1/manage/skills');
            const data = await res.json();
            if (data.success) {
                const skills = data.data;
                const categories = ['Development', 'Databases', 'Tools', 'Learning', 'Design', 'Styling'];

                // Handle Home Page Grid (#skills-grid)
                const homeGrid = $('#skills-grid');
                if (homeGrid.length) {
                    homeGrid.empty();
                    categories.filter(c => c !== 'Learning').forEach(cat => {
                        const catSkills = skills.filter(s => s.category === cat);
                        if (catSkills.length > 0) {
                            const colorMap = {
                                'Development': { color: 'text-theme-primary', bg: 'bg-theme-primary/10', icon: 'code-2' },
                                'Databases': { color: 'text-indigo-400', bg: 'bg-indigo-400/10', icon: 'database' },
                                'Tools': { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: 'wrench' },
                                'Styling': { color: 'text-cyan-500', bg: 'bg-cyan-500/10', icon: 'brush' },
                                'Design': { color: 'text-rose-500', bg: 'bg-rose-500/10', icon: 'palette' }

                            };
                            const c = colorMap[cat] || { color: 'text-theme-primary', bg: 'bg-theme-primary/10', icon: 'zap' };

                            const skillsHtml = catSkills.map(s => `
                                <span class="px-4 py-1.5 rounded-full bg-[var(--theme-card-bg)] border border-[var(--theme-card-border)] text-[11px] font-black uppercase text-[var(--theme-text-primary)] shadow-sm hover:!bg-[var(--theme-accent-primary)] hover:!text-white hover:border-[var(--theme-accent-primary)] hover:-translate-y-0.5 whitespace-nowrap transition-all cursor-default">
                                    ${s.name}
                                </span>
                            `).join('');

                            homeGrid.append(`
                                <div class="glass-panel p-8 md:p-10 rounded-[2.5rem] transition-all group flex flex-col items-start" data-aos="fade-up">
                                    <div class="flex items-center gap-4 mb-8">
                                        <div class="w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.color} group-hover:scale-110 transition-transform">
                                            <i data-lucide="${c.icon}" class="w-5 h-5"></i>
                                        </div>
                                        <h3 class="text-xl font-black text-[var(--theme-text-primary)] uppercase tracking-widest">${cat}</h3>
                                    </div>
                                    <div class="flex flex-wrap justify-start gap-3">
                                        ${skillsHtml}
                                    </div>
                                </div>
                            `);
                        }
                    });
                }

                // --- NEW: Handle About Page Skills Grid (#about-page-skills-grid) ---
                const aboutSkillsGrid = $('#about-page-skills-grid');
                if (aboutSkillsGrid.length) {
                    aboutSkillsGrid.empty();
                    const filterCats = ['Development', 'Databases', 'Styling', 'Tools', 'Design'];
                    filterCats.forEach((cat, idx) => {
                        const catSkills = skills.filter(s => s.category === cat);
                        if (catSkills.length > 0) {
                            const colorMap = {
                                'Development': { color: 'text-theme-primary', bg: 'bg-theme-primary/10', icon: 'code-2' },
                                'Databases': { color: 'text-theme-secondary', bg: 'bg-theme-secondary/10', icon: 'hard-drive' },
                                'Styling': { color: 'text-orange-400', bg: 'bg-orange-400/10', icon: 'palette' },
                                'Tools': { color: 'text-theme-primary', bg: 'bg-theme-primary/10', icon: 'tool' },
                                'Design': { color: 'text-theme-secondary', bg: 'bg-theme-secondary/10', icon: 'layout' }
                            };
                            const c = colorMap[cat] || { color: 'text-theme-primary', bg: 'bg-theme-primary/10', icon: 'zap' };

                            const badgesHtml = catSkills.map(s => `<span class="skill-badge">${s.name}</span>`).join('');

                            aboutSkillsGrid.append(`
                                <div class="glass-card p-6 rounded-[2.5rem] space-y-6 hover:scale-[1.05] transition-all duration-500 border border-white/5 relative overflow-hidden group shadow-xl" data-aos="zoom-in" data-aos-delay="${idx * 100}">
                                     <div class="w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ${c.color} group-hover:bg-theme-primary/20 transition-colors">
                                        <i data-lucide="${c.icon}" class="w-6 h-6"></i>
                                    </div>
                                    <h3 class="text-xl font-bold text-white uppercase tracking-wider">${cat}</h3>
                                    <div class="flex flex-wrap gap-2">
                                        ${badgesHtml}
                                    </div>
                                </div>
                            `);
                        }
                    });
                }

                // Handle Dedicated Skills Page Containers (#skills-development, etc)
                categories.forEach(cat => {
                    const container = $(`#skills-${cat.toLowerCase()}`);
                    if (container.length) {
                        container.empty();
                        const catSkills = skills.filter(s => s.category === cat);

                        catSkills.forEach(skill => {
                            if (cat === 'Learning') {
                                container.append(`
                                     <div class="learning-card group">
                                        <div class="w-14 h-14 rounded-2xl bg-theme-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <i data-lucide="zap" class="w-8 h-8 text-theme-primary"></i>
                                        </div>
                                        <h4 class="text-xl font-bold text-slate-800 dark:text-white mb-2">${skill.name}</h4>
                                        <div class="w-full bg-slate-200 dark:bg-white/5 h-1.5 rounded-full overflow-hidden mt-4">
                                            <div class="bg-gradient-primary h-full rounded-full" style="width: ${skill.Proficiency || 0}%"></div>
                                        </div>
                                    </div>
                                `);
                            } else {
                                container.append(`
                                    <div class="skill-pill group">
                                        <i data-lucide="check-circle-2" class="w-4 h-4 text-theme-primary"></i>
                                        <span>${skill.name}</span>
                                    </div>
                                `);
                            }
                        });
                    }
                });
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Failed to load skills:', error);
        }
    };

    // Run Loaders
    loadHero();
    loadAbout();
    loadAboutPage();
    loadEducation();
    loadProjects();
    loadSkills();
});
