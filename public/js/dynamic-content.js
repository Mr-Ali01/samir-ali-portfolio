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

    // 3. Fetch & Render Projects
    const loadProjects = async () => {
        try {
            const res = await fetch('/api/v1/manage/projects');
            const data = await res.json();
            if (data.success) {
                const grid = $('#projects-grid');
                grid.empty();
                data.data.forEach(p => {
                    const html = `
                        <div class="project-item group glass-panel rounded-[2rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col pb-4" data-category="${p.category || 'website'}">
                            <div class="p-3 bg-gray-50/50 dark:bg-white/5 relative mx-3 mt-3 rounded-xl border-b-[3px] border-theme-primary overflow-hidden group-hover:bg-gray-100 dark:group-hover:bg-white/10 transition-colors">
                                <div class="aspect-video w-full relative overflow-hidden rounded-lg">
                                    <img src="${p.preview_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                                    <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300">
                                        <a href="${p.live_link}" class="px-4 py-2 bg-theme-primary hover:brightness-110 text-white text-sm font-bold rounded-full transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center"><i data-lucide="external-link" class="w-4 h-4 mr-1"></i>Live</a>
                                        <a href="${p.github_link}" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-full border border-white/20 transition-transform transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 flex items-center"><i data-lucide="github" class="w-4 h-4 mr-1"></i>Source</a>
                                    </div>
                                </div>
                            </div>
                            <div class="px-5 pt-4 flex-1 flex flex-col">
                                <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">${p.name}</h4>
                                <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">${p.short_description}</p>
                                <div class="flex flex-wrap gap-2 mt-auto">
                                    ${(p.tech_stack || '').split(',').map(t => `<span class="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-[10px] uppercase font-bold rounded-md">${t.trim()}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                    grid.append(html);
                });
                lucide.createIcons();
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
                                <span class="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-black uppercase text-slate-600 dark:text-white/80 whitespace-nowrap group-hover:border-theme-primary/30 transition-colors">
                                    ${s.name}
                                </span>
                            `).join('');

                            homeGrid.append(`
                                <div class="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/5 hover:border-theme-primary/20 transition-all group flex flex-col items-start" data-aos="fade-up">
                                    <div class="flex items-center gap-4 mb-8">
                                        <div class="w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.color} group-hover:scale-110 transition-transform">
                                            <i data-lucide="${c.icon}" class="w-5 h-5"></i>
                                        </div>
                                        <h3 class="text-xl font-black text-slate-900 dark:text-white uppercase tracking-widest">${cat}</h3>
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
