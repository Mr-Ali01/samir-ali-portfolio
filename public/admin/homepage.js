/* Home Page Management - Samir Ali Admin */

function initHomePageEditor(forcedEntity = null) {
    let currentEntity = forcedEntity || 'hero';
    
    // Hard reset UI state to ensure clean navigation
    $('.tab-btn').removeClass('active');
    $('.section-pane').removeClass('active');
    
    // Auto-detect entity if not forced (for direct page loads)
    if (!forcedEntity) {
        if (window.location.pathname.includes('skills.html')) currentEntity = 'skills';
        else if (window.location.pathname.includes('about.html')) currentEntity = 'about';
        else if (window.location.pathname.includes('experience.html')) currentEntity = 'experience';
        else if (window.location.pathname.includes('projects.html')) currentEntity = 'projects';
        else currentEntity = 'hero';
    }

    // Apply active class securely to target
    $(`.tab-btn[data-tab="${currentEntity}"]`).addClass('active');
    $(`#pane-${currentEntity}`).addClass('active');
    
    console.log(`[AdminEditor] Initializing for entity: ${currentEntity}`);

    let heroData = null; 

    // 2. Fetcher for Lists (Education, Experience)
    // 1. Fetch data for a specific entity and refresh its UI container
    const fetchResourceData = async (entityOverride = null) => {
        const activeEntity = entityOverride || currentEntity;
        try {
            const res = await fetch(`/api/v1/manage/${activeEntity}`);
            const data = await res.json();
            console.log(`[AdminEditor] Fetched ${activeEntity} data:`, data.success ? data.data.length + ' items' : 'failed');
            if (data.success) {
                renderList(data.data, activeEntity);
            }
        } catch (error) {
            console.error(`[AdminEditor] Failed to fetch ${activeEntity}:`, error);
        }

        // Auto-load preview if we are on the skills related tab/page
        if (activeEntity === 'skills' || $('#skills-home-preview').length) {
            loadSkillsPreview();
        }
    };

    const loadSkillsPreview = async () => {
        const preview = $('#skills-home-preview');
        if (!preview.length) return;

        try {
            const res = await fetch('/api/v1/manage/skills');
            const data = await res.json();
            if (data.success) {
                const skills = data.data;
                const categories = ['Development', 'Databases', 'Styling', 'Tools', 'Design', 'Learning'];
                preview.empty();

                categories.filter(c => c !== 'Learning').forEach(cat => {
                    const catSkills = skills.filter(s => s.category === cat);
                    if (catSkills.length > 0) {
                        const colorMap = {
                            'Development': { color: 'text-dash-accent', bg: 'bg-dash-accent/10', icon: 'code-2' },
                            'Databases': { color: 'text-indigo-400', bg: 'bg-indigo-400/10', icon: 'database' },
                            'Styling': { color: 'text-cyan-400', bg: 'bg-cyan-400/10', icon: 'brush' },
                            'Tools': { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: 'wrench' },
                            'Design': { color: 'text-rose-400', bg: 'bg-rose-400/10', icon: 'palette' }
                        };
                        const c = colorMap[cat] || { color: 'text-dash-accent', bg: 'bg-dash-accent/10', icon: 'zap' };
                        
                        const pillsHtml = catSkills.map(s => `
                            <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-dash-muted">
                                ${s.name}
                            </span>
                        `).join('');

                        preview.append(`
                            <div class="bg-[rgba(15,23,42,0.4)] backdrop-blur-xl border border-white/5 hover:border-white/10 p-6 sm:p-8 rounded-[2rem] flex flex-col items-start shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group" data-aos="fade-up">
                                <!-- Subtle Background Hue -->
                                <div class="absolute -top-16 -right-16 w-32 h-32 ${c.bg.replace('/10', '/5')} rounded-full blur-[40px] group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>

                                <div class="flex items-center gap-3 mb-6 relative z-10 w-full">
                                    <div class="w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center ${c.color} border border-white/5 shadow-inner">
                                        <i data-lucide="${c.icon}" class="w-5 h-5"></i>
                                    </div>
                                    <h4 class="text-xs font-black uppercase tracking-[0.2em] text-dash-text w-full truncate">${cat}</h4>
                                </div>
                                <div class="flex flex-wrap gap-2 relative z-10">
                                    ${pillsHtml}
                                </div>
                            </div>
                        `);
                    }
                });
                lucide.createIcons();
            }
        } catch (e) {
            console.error('Preview load failed');
        }
    }

    // 3. Hero Data Loader (Fills the form from dedicated hero_section table)
    const loadHeroData = async () => {
        try {
            const res = await fetch('/api/v1/manage/hero_section');
            const data = await res.json();
            if (data.success && data.data.length > 0) {
                const hero = data.data[0];
                heroData = hero;
                const form = $('#form-hero');
                
                // Map Dedicated Columns to Form Inputs
                form.find('[name="name"]').val(hero.main_name); 
                form.find('[name="status"]').val(hero.status_badge);
                form.find('[name="description"]').val(hero.headline);
                form.find('[name="image_url"]').val(hero.image_url || '');
                
                // Buttons Mapping
                for (let i = 1; i <= 3; i++) {
                    form.find(`[name="btn_${i}"]`).val(hero[`btn_${i}_label`]);
                }
                
                // Stats Mapping
                for (let i = 1; i <= 3; i++) {
                    form.find(`[name="stat_val_${i}"]`).val(hero[`stat_${i}_val`]);
                    form.find(`[name="stat_lab_${i}"]`).val(hero[`stat_${i}_lab`]);
                }

                // Show Preview if image exists
                if (hero.image_url) {
                    $('#hero-img-preview').removeClass('hidden').find('img').attr('src', hero.image_url);
                }

                form.find('[name="id"]').remove();
                form.append(`<input type="hidden" name="id" value="${hero.id}">`);
            }
        } catch (error) {
            console.error('Hero Load failed:', error);
        }
    };

    // 1. Tab Switching (For multi-pane views like homepage.html)
    $('.tab-btn').off('click').on('click', function() {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');
        
        const tab = $(this).data('tab');
        currentEntity = tab;
        $('.section-pane').removeClass('active');
        $(`#pane-${tab}`).addClass('active');

        // Load correct data
        if (currentEntity === 'hero') {
            loadHeroData();
        } else {
            fetchResourceData();
        }
    });

    // Clean up old listeners (Wait: handled by .off() in handlers below)

    // 4. Hero Form Submit (Delegated)
    $(document).off('submit', '#form-hero').on('submit', '#form-hero', async function(e) {
        e.preventDefault();
        const rawData = new FormData(this);
        const data = Object.fromEntries(rawData.entries());
        
        // Build Payload matching hero_section Schema
        const payload = {
            id: data.id || (heroData ? heroData.id : 1),
            main_name: data.name,
            status_badge: data.status,
            headline: data.description,
            image_url: data.image_url
        };
        
        for (let i = 1; i <= 3; i++) {
            payload[`btn_${i}_label`] = data[`btn_${i}`] || '';
            payload[`stat_${i}_val`] = data[`stat_val_${i}`] || '';
            payload[`stat_${i}_lab`] = data[`stat_lab_${i}`] || '';
        }

        try {
            const res = await fetch('/api/v1/manage/hero_section', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (result.success) {
                Swal.fire({
                    title: 'Hero Configuration Updated',
                    text: 'Changes are now live on your home page.',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                loadHeroData(); 
            }
        } catch (error) {
            Swal.fire('Error', 'Failed to save changes.', 'error');
        }
    });

    // 5. Hero Image Upload Handler (Delegated)
    $(document).off('change', '#hero-image-file').on('change', '#hero-image-file', async function() {
        const file = this.files[0];
        if (!file) return;

        // Show Loading state
        const label = $('label[for="hero-image-file"]');
        const oldText = label.text();
        label.text('Uploading...');

        try {
            const res = await fetch('/api/v1/upload', {
                method: 'POST',
                headers: { 'x-file-name': file.name },
                body: await file.arrayBuffer()
            });
            const result = await res.json();
            if (result.success) {
                $('[name="image_url"]').val(result.url);
                $('#hero-img-preview').removeClass('hidden').find('img').attr('src', result.url);
                label.text('Upload Complete!');
                setTimeout(() => label.text(oldText), 2000);
            }
        } catch (error) {
            label.text('Upload Failed!');
            setTimeout(() => label.text(oldText), 2000);
        }
    });

    // 2. Render List into designated container
    const renderList = (items, entityOverride = null) => {
        const activeEntity = entityOverride || currentEntity;
        const containerId = `#${activeEntity}-list`;
        const container = $(containerId);
        
        if (!container.length) {
            console.warn(`[AdminEditor] ABORT: Container ${containerId} not found in DOM!`);
            return;
        }
        container.empty();
        
        if (!items || items.length === 0) {
            container.append(`
                <div class="text-dash-muted text-center py-20 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                    No entries found. Click "Add Entry" to begin.
                </div>
            `);
            return;
        }

        // SPECIAL: Category-wise Grouping for Skills (Only on skills.html and when skills tab is active)
        if (activeEntity === 'skills' && window.location.pathname.includes('skills.html')) {
            const categories = ['Development', 'Databases', 'Styling', 'Tools', 'Design', 'Learning'];
            container.removeClass('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'); // Reset original grid

            categories.forEach(cat => {
                const catSkills = items.filter(s => s.category === cat);
                if (catSkills.length > 0) {
                    const groupHtml = `
                        <div class="category-group mb-12" data-aos="fade-up">
                            <div class="flex items-center gap-4 mb-10">
                                <div class="h-px bg-dash-border flex-1 opacity-40"></div>
                                <h3 class="text-sm font-black uppercase tracking-[0.25em] text-dash-accent bg-dash-bg px-6 py-2 rounded-full border border-dash-border/50 shadow-sm">${cat}</h3>
                                <div class="h-px bg-dash-border flex-1 opacity-40"></div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 list-container-inner"></div>
                        </div>
                    `;
                    const $group = $(groupHtml);
                    const $innerContainer = $group.find('.list-container-inner');
                    
                    catSkills.forEach(item => {
                        $innerContainer.append(createItemCard(item, activeEntity));
                    });
                    
                    container.append($group);
                }
            });
        } else {
            // Default Flat List
            items.forEach(item => {
                container.append(createItemCard(item, activeEntity));
            });
        }
        lucide.createIcons();
    };

    // 3. Simple Item Card Generator
    const createItemCard = (item, entityOverride = null) => {
        const activeEntity = entityOverride || currentEntity;
        const config = {
            education: { title: item.degree, sub: item.institution, icon: 'graduation-cap' },
            experience: { title: item.role, sub: item.company, icon: 'briefcase' },
            skills: { title: item.name, sub: item.category, icon: 'zap' },
            certifications: { title: item.name, sub: item.issuer, icon: 'award' },
            projects: { title: item.name, sub: item.category, icon: 'briefcase', preview: item.preview_image },
            about: { title: item.title || 'About Section', sub: 'Content Block', icon: 'user' }
        };
        const c = config[activeEntity] || { title: item.title || item.name || 'Untitled', sub: item.category || 'Mini Bio', icon: 'box' };

        return `
            <div class="bg-[rgba(15,23,42,0.4)] backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-[var(--dash-border)] shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(56,189,248,0.15)] hover:border-white/10 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group overflow-hidden relative">
                <!-- Ambient Hover Glow -->
                <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-dash-accent/0 group-hover:via-dash-accent/30 to-transparent transition-all duration-500"></div>

                <div class="flex items-center gap-4 sm:gap-6 relative z-10 min-w-0">
                    ${c.preview ? `
                        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-lg border border-white/10 shrink-0 relative group-hover:scale-105 transition-transform duration-300">
                            <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                            <img src="${c.preview}" class="w-full h-full object-cover">
                        </div>
                    ` : `
                        <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-dash-accent/10 group-hover:border-dash-accent/20 transition-all duration-300 shadow-inner relative z-10">
                            <i data-lucide="${c.icon}" class="w-5 h-5 sm:w-6 sm:h-6 text-dash-muted group-hover:text-dash-accent transition-colors pointer-events-none"></i>
                        </div>
                    `}
                    <div class="space-y-1 sm:space-y-1.5 min-w-0">
                        <span class="text-[9px] sm:text-[10px] font-black uppercase text-dash-accent tracking-[0.2em] bg-dash-accent/10 px-2.5 py-1 rounded-sm">${c.sub}</span>
                        <h4 class="text-base sm:text-lg font-black text-dash-text truncate">${c.title}</h4>
                    </div>
                </div>
                <div class="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity relative z-10 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-0 justify-end">
                    <!-- Actions -->
                    <div class="flex items-center gap-2">
                        <button class="edit-btn p-3 bg-white/5 border border-white/10 rounded-xl text-dash-muted hover:bg-dash-accent/10 hover:text-dash-accent transition-all group/btn cursor-pointer relative z-30" data-id="${item.id}" data-entity="${activeEntity}">
                            <i data-lucide="edit-3" class="w-4 h-4 pointer-events-none"></i>
                        </button>
                        <button class="delete-btn p-3 bg-white/5 border border-white/10 rounded-xl text-dash-muted hover:bg-red-500/10 hover:text-red-500 transition-all group/btn cursor-pointer relative z-30" data-id="${item.id}" data-entity="${activeEntity}">
                            <i data-lucide="trash-2" class="w-4 h-4 pointer-events-none"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    };

    // 6. CRUD Modals (Delegated)
    $(document).off('click', '.add-btn').on('click', '.add-btn', function(e) {
        e.preventDefault();
        const entity = $(this).data('entity') || $(this).closest('.section-pane').data('tab') || $(this).closest('.section-pane').attr('id')?.replace('pane-', '') || currentEntity;
        console.log(`[Admin] Add button clicked for entity: ${entity}`);
        openModal(null, entity);
    });

    $(document).off('click', '.edit-btn').on('click', '.edit-btn', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        const entity = $(this).data('entity') || $(this).closest('.section-pane').attr('id')?.replace('pane-', '') || currentEntity;
        console.log(`[Admin] Edit button clicked for entity: ${entity}, ID: ${id}`);
        openModal(id, entity);
    });

    const openModal = async (id = null, entityOverride = null) => {
        const activeEntity = entityOverride || currentEntity;
        
        let modal;
        let freshModal = $('#admin-view-content #modal-backdrop');
        
        if (freshModal.length > 0) {
            // A fresh modal exists inside the injected SPA content.
            // This means any existing modal in the body is a zombie from a previous tab.
            $('body > #modal-backdrop').remove();
            
            // Move the fresh modal to the body to escape stacking context constraints
            freshModal.appendTo('body');
            modal = freshModal;
        } else {
            // Second click on the same page. The modal is already in the body.
            modal = $('body > #modal-backdrop');
            
            if (!modal.length) {
                console.error("Critical: Modal backdrop is missing from the DOM entirely.");
                return;
            }
        }

        const formFields = $('#form-fields');
        formFields.empty();
        
        let formData = {};
        if (id) {
            try {
                const res = await fetch(`/api/v1/manage/${activeEntity}`);
                const json = await res.json();
                formData = (json.data || []).find(i => i.id == id) || {};
            } catch (e) {
                console.error('Modal data fetch failed:', e);
            }
        }

        // Update Modal Title
        const actionLabel = id ? 'Edit' : 'Add New';
        const entityLabel = activeEntity.charAt(0).toUpperCase() + activeEntity.slice(1);
        $('#modal-title').text(`${actionLabel} ${entityLabel} Block`);

        const config = {
            education: [
                { name: 'degree', label: 'Degree / Major', type: 'text' },
                { name: 'institution', label: 'Institution', type: 'text' },
                { name: 'period', label: 'Time Period (e.g. 2018-2022)', type: 'text' },
                { name: 'programme_status', label: 'Programme Status', type: 'select', options: ['Certified', 'Completed', 'Pursuing'] },
                { name: 'description', label: 'Brief Description', type: 'textarea' },
                { name: 'display_order', label: 'Order Index', type: 'number' }
            ],
            experience: [
                { name: 'role', label: 'Job Role / Title', type: 'text' },
                { name: 'company', label: 'Company Name', type: 'text' },
                { name: 'period', label: 'Time Period', type: 'text' },
                { name: 'focus_areas', label: 'Focus Areas (comma-separated)', type: 'text' },
                { name: 'description', label: 'Responsibilities', type: 'textarea' },
                { name: 'display_order', label: 'Order Index', type: 'number' }
            ],
            about: [
                { name: 'title', label: 'Section Title', type: 'text' },
                { name: 'description', label: 'About Me Content', type: 'textarea' },
                { name: 'image_url', label: 'Image URL', type: 'text' },
                { name: 'display_order', label: 'Order Index', type: 'number' }
            ],
            skills: [
                { name: 'name', label: 'Skill Name', type: 'text' },
                { name: 'Proficiency', label: 'Proficiency (%)', type: 'number' },
                { name: 'category', label: 'Category', type: 'select', options: ['Development', 'Databases', 'Tools', 'Learning', 'Design', 'Styling'] },
                { name: 'display_order', label: 'Order Index', type: 'number' }
            ],
            certifications: [
                { name: 'name', label: 'Certificate Name', type: 'text' },
                { name: 'issuer', label: 'Issuing Organization', type: 'text' },
                { name: 'date', label: 'Issue Date / Period', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'display_order', label: 'Order Index', type: 'number' }
            ],
            projects: [
                { name: 'name', label: 'Project Name', type: 'text' },
                { name: 'category', label: 'Category', type: 'select', options: ['Featured', 'Utility', 'Design', 'Experiments'] },
                { name: 'project_label', label: 'Project Label', type: 'select', options: ['Top Rated', 'Website', 'Tools', 'SEO Pages', 'Mobile'] },
                { name: 'short_description', label: 'Short Description', type: 'textarea' },
                { name: 'tech_stack', label: 'Tech Stack (comma separated)', type: 'text' },
                { name: 'preview_image', label: 'Preview Image URL', type: 'text' },
                { name: 'live_link', label: 'Live Demo Link', type: 'text' },
                { name: 'github_link', label: 'Source Code Link', type: 'text' },
                { name: 'display_order', label: 'Order Index', type: 'number' }
            ]
        };

        const fields = config[activeEntity] || [];
        
        fields.forEach(f => {
            const val = formData[f.name] !== undefined ? formData[f.name] : '';
            let fieldHtml = '';
            
            if (f.type === 'textarea') {
                fieldHtml = `<textarea name="${f.name}" rows="3" class="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-dash-accent transition-all outline-none resize-none placeholder:text-white/20" placeholder="Enter ${f.label.toLowerCase()}...">${val}</textarea>`;
            } else if (f.type === 'select') {
                fieldHtml = `
                    <div class="relative">
                        <select name="${f.name}" class="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-dash-accent transition-all outline-none appearance-none">
                            ${f.options.map(opt => `<option value="${opt}" ${val === opt ? 'selected' : ''} class="bg-slate-900">${opt}</option>`).join('')}
                        </select>
                        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><i data-lucide="chevron-down" class="w-4 h-4"></i></div>
                    </div>
                `;
            } else {
                fieldHtml = `<input type="${f.type}" name="${f.name}" value="${val}" class="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-dash-accent transition-all outline-none placeholder:text-white/20" placeholder="Enter ${f.label.toLowerCase()}...">`;
            }

            const html = `
                <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-dash-muted">${f.label}</label>
                    ${fieldHtml}
                </div>
            `;
            formFields.append(html);
        });

        if (id) formFields.append(`<input type="hidden" name="id" value="${id}">`);
        formFields.append(`<input type="hidden" id="active-modal-entity" value="${activeEntity}">`);

        // Lock body scroll
        $('body').addClass('overflow-hidden');

        // Show modal with animation
        modal.removeClass('hidden').addClass('flex');
        // Small delay to allow 'flex' rendering before triggering transitions
        setTimeout(() => {
            modal.removeClass('opacity-0');
            modal.find('#modal-container').removeClass('scale-95').addClass('scale-100');
        }, 10);
    };

    $(document).off('click', '.close-modal').on('click', '.close-modal', closeModal);
    function closeModal() {
        const modal = $('#modal-backdrop');
        modal.addClass('opacity-0');
        modal.find('#modal-container').removeClass('scale-100').addClass('scale-95');
        
        // Unlock body scroll
        $('body').removeClass('overflow-hidden');
        
        setTimeout(() => modal.addClass('hidden').removeClass('flex'), 300);
    }

    // 7. Submit CRUD with SweetAlert (Delegated)
    $(document).off('submit', '#crud-form').on('submit', '#crud-form', async function(e) {
        e.preventDefault();
        const rawData = new FormData(this);
        const data = Object.fromEntries(rawData.entries());
        
        // Fix: Remove empty ID for POST requests to prevent DB errors
        const isUpdate = !!data.id;
        if (!isUpdate) delete data.id;

        const entity = $('#active-modal-entity').val() || currentEntity;
        const method = isUpdate ? 'PUT' : 'POST';

        try {
            const res = await fetch(`/api/v1/manage/${entity}`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            if (result.success) {
                closeModal();
                fetchResourceData(entity);
                Swal.fire({ 
                    title: 'Sync Successful', 
                    text: `Resource in ${entity} has been updated.`, 
                    icon: 'success', 
                    background: 'rgba(15,23,42,0.95)',
                    color: '#fff',
                    confirmButtonColor: '#38bdf8',
                    backdrop: 'rgba(15,23,42,0.6)',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                    toast: true
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Operation Failed',
                text: 'Could not sync changes to the server.',
                icon: 'error',
                background: '#0f172a',
                color: '#fff',
                confirmButtonColor: '#ef4444'
            });
        }
    });

    // 8. Delete Logic with SweetAlert Confirmation (Delegated)
    $(document).off('click', '.delete-btn').on('click', '.delete-btn', async function() {
        const id = $(this).data('id');
        const entity = $(this).data('entity') || currentEntity;
        
        const result = await Swal.fire({
            title: 'Irreversible Action',
            text: `Remove this entry from ${entity}? This will be permanently erased.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Permanently Delete',
            background: 'rgba(15,23,42,0.95)',
            color: '#fff',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: 'rgba(255,255,255,0.05)',
            backdrop: 'rgba(15,23,42,0.8)'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`/api/v1/manage/${entity}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                if ((await res.json()).success) {
                    fetchResourceData(entity);
                    Swal.fire({ 
                        title: 'Purged', 
                        text: 'Item removed from database.', 
                        icon: 'success', 
                        background: 'rgba(15,23,42,0.95)', 
                        color: '#fff',
                        timer: 1500,
                        showConfirmButton: false,
                        position: 'top-end',
                        toast: true
                    });
                }
            } catch (error) {
                Swal.fire({ title: 'Error', text: 'Deletion encountered a server fault.', icon: 'error', background: '#0f172a', color: '#fff' });
            }
        }
    });

    // Initial Load - Ensure data is fetched after all functions are defined
    if (currentEntity === 'hero') {
        loadHeroData();
    } else {
        fetchResourceData(currentEntity);
    }
}
