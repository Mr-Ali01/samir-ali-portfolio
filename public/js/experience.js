$(document).ready(function () {
    
    // 1. Initialize AOS (Animate on Scroll)
    const initAOS = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
        }
    };

    // 2. Fetch and Render Stats
    const fetchStats = async () => {
        try {
            const res = await fetch('/api/v1/manage/projects');
            const data = await res.json();
            const projectCount = data.success ? data.data.length : 0;

            const statsHtml = `
                <div class="glass-panel p-10 rounded-3xl group hover:border-theme-primary/50 transition-all duration-500" data-aos="fade-up" data-aos-delay="100">
                    <div class="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="calendar" class="w-7 h-7 text-orange-500"></i>
                    </div>
                    <h3 class="text-4xl font-black text-theme-textPrimary mb-2">2+</h3>
                    <p class="text-theme-textPrimary font-bold mb-1">Years of Learning</p>
                    <p class="text-theme-textSecondary text-sm">Consistent growth & practice</p>
                </div>
                <div class="glass-panel p-10 rounded-3xl group hover:border-theme-primary/50 transition-all duration-500" data-aos="fade-up" data-aos-delay="200">
                    <div class="w-14 h-14 rounded-2xl bg-theme-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="code-2" class="w-7 h-7 text-theme-primary"></i>
                    </div>
                    <h3 class="text-4xl font-black text-theme-textPrimary mb-2">${projectCount}+</h3>
                    <p class="text-theme-textPrimary font-bold mb-1">Projects Built</p>
                    <p class="text-theme-textSecondary text-sm">Apps, tools & experiments</p>
                </div>
                <div class="glass-panel p-10 rounded-3xl group hover:border-theme-primary/50 transition-all duration-500" data-aos="fade-up" data-aos-delay="300">
                    <div class="w-14 h-14 rounded-2xl bg-orange-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <i data-lucide="graduation-cap" class="w-7 h-7 text-orange-600"></i>
                    </div>
                    <h3 class="text-4xl font-black text-theme-textPrimary mb-2">84.06%</h3>
                    <p class="text-theme-textPrimary font-bold mb-1">BCA Score</p>
                    <p class="text-theme-textSecondary text-sm">R.L.SBCA College</p>
                </div>
            `;
            $('#stats-container').html(statsHtml);
            lucide.createIcons();
        } catch (err) {
            console.error('Stats fetch failed:', err);
        }
    };

    // 3. Fetch and Render Experience & Education Timeline
    const fetchTimeline = async () => {
        try {
            const [expRes, eduRes] = await Promise.all([
                fetch('/api/v1/manage/experience'),
                fetch('/api/v1/manage/education')
            ]);
            const expData = await expRes.json();
            const eduData = await eduRes.json();

            const container = $('#experience-timeline');
            container.empty();

            // Render Experience
            if (expData.success) {
                expData.data.forEach((exp, index) => {
                    const itemHtml = `
                        <div class="relative pl-12 md:pl-20 group" data-aos="fade-left" data-aos-delay="${index * 100}">
                            <!-- Timeline Dot Indicator -->
                            <div class="absolute left-0 top-8 md:top-10 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 group-hover:border-theme-primary z-10 shadow-sm group-hover:shadow-[0_0_20px_var(--theme-accent-primary)] transition-all duration-300">
                                <div class="w-3 h-3 md:w-4 md:h-4 bg-theme-primary rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                            </div>

                            <!-- Modern Experience Card (SaaS Style) -->
                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 bg-white/40 dark:bg-[#0a0a0ab3] backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-2xl md:rounded-[20px] p-6 md:p-8 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-theme-primary/20 dark:hover:shadow-theme-primary/10 transition-all duration-300 relative overflow-hidden group/card">
                                
                                <!-- Soft Glassmorphism Gradient Overlay on Hover -->
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/10 dark:from-theme-primary/10 dark:to-theme-secondary/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                <!-- Left Content (Role Details) -->
                                <div class="lg:col-span-8 flex flex-col justify-center space-y-5 px-1 relative z-10">
                                    <!-- Date Badge Pill -->
                                    <div class="flex items-center">
                                        <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-theme-primary/10 border border-theme-primary/20 text-theme-primary text-xs md:text-sm font-bold tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover/card:shadow-[0_0_20px_var(--theme-accent-primary)] transition-all">
                                            ${exp.period}
                                        </span>
                                    </div>
                                    <!-- Title & Subtitle Context -->
                                    <div>
                                        <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 leading-tight">${exp.role}</h2>
                                        <p class="text-cyan-500 dark:text-cyan-400 font-bold text-base md:text-lg tracking-wide flex items-center gap-2">
                                            <i data-lucide="building-2" class="w-5 h-5"></i> ${exp.company}
                                        </p>
                                    </div>
                                    <!-- Description -->
                                    <p class="text-slate-600 dark:text-slate-400 leading-loose text-sm md:text-[15px] font-medium max-w-2xl">
                                        ${exp.description}
                                    </p>
                                </div>

                                <!-- Right Content (Focus Areas Mini Card) -->
                                <div class="lg:col-span-4 flex flex-col justify-center h-full relative z-10">
                                    <div class="bg-slate-50 border border-slate-200 dark:bg-white/[0.02] dark:border-white/5 rounded-2xl p-5 md:p-6 shadow-inner h-full flex flex-col backdrop-blur-md transition-colors group-hover/card:border-theme-primary/20">
                                        <h4 class="text-slate-800 dark:text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
                                            <i data-lucide="target" class="w-4 h-4 text-theme-secondary"></i> Focus Areas
                                        </h4>
                                        <ul class="space-y-4 mt-auto border-l-2 border-slate-200 dark:border-white/5 pl-4">
                                            ${(exp.focus_areas ? exp.focus_areas.split(',').filter(f => f.trim()) : ['Application Development', 'UI/UX & Workflow Logic']).map(focus => `
                                            <li class="flex items-start gap-4 text-sm text-slate-600 dark:text-slate-400 relative">
                                                <div class="w-2.5 h-2.5 rounded-full bg-theme-secondary shrink-0 shadow-[0_0_8px_var(--theme-accent-secondary)] absolute -left-[21px] top-1"></div>
                                                <span class="font-semibold leading-relaxed">${focus.trim()}</span>
                                            </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    container.append(itemHtml);
                });
            }

            // Render Education
            if (eduData.success) {
                eduData.data.forEach((edu, index) => {
                    const isBCA = edu.degree.includes('BCA');
                    const itemHtml = `
                        <div class="relative pl-12 md:pl-20 group" data-aos="fade-left" data-aos-delay="${(expData.data.length + index) * 100}">
                            <!-- Timeline Dot Indicator -->
                            <div class="absolute left-0 top-8 md:top-10 w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-slate-50 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 group-hover:border-theme-primary z-10 shadow-sm group-hover:shadow-[0_0_20px_var(--theme-accent-primary)] transition-all duration-300">
                                <div class="w-3 h-3 md:w-4 md:h-4 bg-theme-primary rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                            </div>

                            <!-- Modern Education Card (SaaS Style) -->
                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 bg-white/40 dark:bg-[#0a0a0ab3] backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-2xl md:rounded-[20px] p-6 md:p-8 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-theme-primary/20 dark:hover:shadow-theme-primary/10 transition-all duration-300 relative overflow-hidden group/card">
                                
                                <!-- Soft Glassmorphism Gradient Overlay on Hover -->
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/10 dark:from-theme-primary/10 dark:to-theme-secondary/10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                                <!-- Left Content -->
                                <div class="lg:col-span-8 flex flex-col justify-center space-y-5 px-1 relative z-10">
                                    <!-- Date Badge Pill -->
                                    <div class="flex items-center">
                                        <span class="inline-flex items-center px-4 py-1.5 rounded-full bg-theme-primary/10 border border-theme-primary/20 text-theme-primary text-xs md:text-sm font-bold tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.15)] group-hover/card:shadow-[0_0_20px_var(--theme-accent-primary)] transition-all">
                                            ${edu.period}
                                        </span>
                                    </div>
                                    <!-- Title & Subtitle Context -->
                                    <div>
                                        <h2 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2 leading-tight">${edu.degree}</h2>
                                        <p class="text-cyan-500 dark:text-cyan-400 font-bold text-base md:text-lg flex items-center gap-2">
                                            <i data-lucide="school" class="w-5 h-5"></i> ${edu.institution}
                                        </p>
                                    </div>
                                    <p class="text-slate-600 dark:text-slate-400 leading-loose text-sm md:text-[15px] font-medium max-w-2xl">
                                        ${edu.description}
                                    </p>
                                </div>

                                <!-- Right Content (Education Status Mini Card) -->
                                <div class="lg:col-span-4 flex w-full items-center justify-center relative z-10 h-full">
                                    <div class="relative bg-slate-50 border border-slate-200 dark:bg-white/[0.02] dark:border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center backdrop-blur-md shadow-inner transition-colors group-hover/card:border-theme-primary/20 w-full h-full text-center">
                                        
                                        ${(() => {
                                            const status = edu.programme_status || (edu.degree.includes('BCA') ? 'Completed' : 'Certified');
                                            const isCompleted = status.toLowerCase() === 'completed';
                                            return `
                                            <div class="w-14 h-14 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'} bg-opacity-10 border ${isCompleted ? 'border-green-500/20' : 'border-blue-500/20'} flex items-center justify-center mb-5">
                                                <i data-lucide="${isCompleted ? 'check-circle-2' : 'award'}" class="w-7 h-7 ${isCompleted ? 'text-green-500' : 'text-blue-500'} shadow-sm"></i>
                                            </div>

                                            <span class="block text-[11px] font-bold uppercase tracking-widest mb-1.5 ${isCompleted ? 'text-green-500' : 'text-blue-500'} opacity-80">
                                                Programme Status
                                            </span>
                                            <span class="block text-2xl font-black ${isCompleted ? 'text-green-500' : 'text-blue-500'} tracking-tight drop-shadow-sm">
                                                ${status}
                                            </span>
                                            `;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    container.append(itemHtml);
                });
            }

            lucide.createIcons();
            if (typeof AOS !== 'undefined') AOS.refresh();
        } catch (err) {
            console.error('Timeline fetch failed:', err);
        }
    };

    // 4. Fetch and Render Skills
    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/v1/manage/skills');
            const data = await res.json();
            if (data.success) {
                const container = $('#skills-container');
                container.empty();
                // Take only top 10 skills for this view
                data.data.slice(0, 12).forEach(skill => {
                    container.append(`<div class="skill-tag">${skill.name}</div>`);
                });
            }
        } catch (err) {
            console.error('Skills fetch failed:', err);
        }
    };

    // Initial Load
    initAOS();
    fetchStats();
    fetchTimeline();
    fetchSkills();

    console.log("🚀 Experience page initialized successfully.");
});
