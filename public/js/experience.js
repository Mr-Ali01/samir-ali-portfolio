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
                        <div class="relative pl-20 md:pl-28 group" data-aos="fade-left" data-aos-delay="${index * 100}">
                            <div class="absolute left-3.5 md:left-5.5 top-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-900 border-2 border-theme-primary z-10 shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>
                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 glass-panel p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden group-hover:border-theme-primary/30 transition-all">
                                <div class="lg:col-span-8 space-y-4">
                                    <span class="inline-block px-4 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">${exp.period}</span>
                                    <h2 class="text-2xl md:text-3xl font-black text-theme-textPrimary">${exp.role}</h2>
                                    <p class="text-orange-500 font-bold text-sm italic">${exp.company}</p>
                                    <p class="text-theme-textSecondary leading-relaxed text-sm md:text-base">${exp.description}</p>
                                </div>
                                <div class="lg:col-span-4 lg:border-l lg:border-white/5 lg:pl-8 space-y-4 flex flex-col justify-center">
                                    <div class="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                                        <h4 class="text-orange-500 font-black text-xs uppercase tracking-wider mb-4">Focus Areas</h4>
                                        <ul class="space-y-3">
                                            <li class="flex items-start gap-3 text-xs md:text-sm text-theme-textSecondary">
                                                <div class="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                                <span>Application Development</span>
                                            </li>
                                            <li class="flex items-start gap-3 text-xs md:text-sm text-theme-textSecondary">
                                                <div class="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                                <span>UI/UX & Workflow Logic</span>
                                            </li>
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
                        <div class="relative pl-20 md:pl-28 group" data-aos="fade-left" data-aos-delay="${(expData.data.length + index) * 100}">
                            <div class="absolute left-3.5 md:left-5.5 top-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-900 border-2 border-theme-primary z-10 shadow-[0_0_15px_rgba(56,189,248,0.5)]"></div>
                            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 glass-panel p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden group-hover:border-theme-primary/30 transition-all">
                                <div class="lg:col-span-8 space-y-4">
                                    <span class="inline-block px-4 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">${edu.period}</span>
                                    <h2 class="text-2xl md:text-3xl font-black text-theme-textPrimary">${edu.degree}</h2>
                                    <div class="flex items-center gap-2 text-theme-textSecondary text-sm">
                                        <i data-lucide="school" class="w-4 h-4"></i> ${edu.institution}
                                    </div>
                                    <p class="text-theme-textSecondary leading-relaxed text-sm md:text-base mt-2">${edu.description}</p>
                                </div>
                                <div class="lg:col-span-4 lg:border-l lg:border-white/5 lg:pl-8 flex items-center justify-center">
                                    <div class="relative p-8 rounded-3xl ${isBCA ? 'bg-green-500/5 border border-green-500/20' : 'bg-blue-500/5 border border-blue-500/20'} text-center w-full max-w-[200px]">
                                        <i data-lucide="${isBCA ? 'leaf' : 'award'}" class="absolute -top-3 -right-3 w-8 h-8 ${isBCA ? 'text-green-500/40' : 'text-blue-500/40'}"></i>
                                        <span class="block text-[10px] font-black text-theme-textSecondary uppercase tracking-widest mb-1">Status</span>
                                        <span class="block text-2xl font-black text-theme-textPrimary">${isBCA ? 'Completed' : 'Certified'}</span>
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
