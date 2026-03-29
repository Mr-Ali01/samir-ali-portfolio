/* 
  Admin SPA Router & Layout Manager
  Handles dynamic content loading without page reloads.
*/

const AdminUI = {
    // 1. Core Config
    init: function(activePage = 'dashboard') {
        // Safeguard: Only render shell if containers are empty or don't exist
        const sidebar = $('#admin-sidebar-container');
        if (sidebar.length && sidebar.is(':empty')) {
            this.renderShell(activePage);
        } else if (!sidebar.length) {
            // Fallback for non-existent containers
            console.warn('Admin layout containers not found. Normal initialization.');
        }

        this.setupRouting();
        
        // Initial Page Script Run
        this.executeBaseScripts(activePage);
    },

    // 2. Render Sidebar/Header Shell
    renderShell: function(activePage) {
        const sidebarHTML = `
            <div class="fixed inset-0 z-0 pointer-events-none">
                <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-dash-accent/10 rounded-full blur-[120px]"></div>
                <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-dash-secondary/10 rounded-full blur-[120px]"></div>
            </div>

            <aside class="w-72 bg-dash-sidebar/60 backdrop-blur-3xl border-r border-dash-border fixed h-full flex flex-col p-6 overflow-y-auto custom-scrollbar z-50">
                <div class="flex items-center gap-3 mb-10">
                    <div class="w-10 h-10 bg-gradient-to-br from-dash-accent to-dash-secondary rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-dash-accentGlow">S</div>
                    <span class="text-xl font-bold tracking-tight">Samir Ali</span>
                </div>

                <nav class="space-y-1 flex-1" id="admin-sidebar-nav">
                    ${this.generateNavItems(activePage)}
                </nav>

                <div class="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl overflow-hidden border border-dash-border">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h4 class="font-black text-sm">Samir Ali</h4>
                            <p class="text-[9px] text-dash-accent font-black uppercase tracking-widest">Super Admin</p>
                        </div>
                    </div>
                    <a href="../index.html" class="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest transition-all block text-center">View Portfolio</a>
                </div>
            </aside>
        `;

        const headerHTML = `
            <header class="h-20 px-10 flex items-center justify-end border-b border-dash-border bg-dash-bg/60 backdrop-blur-md">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-1">
                        <button class="icon-btn"><i data-lucide="mail"></i></button>
                        <button class="icon-btn relative">
                            <i data-lucide="bell"></i>
                            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-dash-bg"></span>
                        </button>
                    </div>
                    <div class="h-8 w-px bg-dash-border mx-2"></div>
                    <div class="w-10 h-10 rounded-xl overflow-hidden border border-dash-border">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" class="w-full h-full object-cover">
                    </div>
                    <button class="icon-btn" onclick="window.location.href='../login.html'"><i data-lucide="log-out"></i></button>
                </div>
            </header>
        `;

        $('#admin-sidebar-container').html(sidebarHTML);
        $('#admin-header-container').html(headerHTML);
        lucide.createIcons();
    },

    // 3. Navigation Helpers
    generateNavItems: function(activePage) {
        const items = [
            { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', url: 'dashboard.html' },
            { id: 'homepage', label: 'Home Page', icon: 'home', url: 'homepage.html' },
            { id: 'messages', label: 'Messages', icon: 'message-square', url: 'messages.html', badge: 24 },
            { id: 'projects', label: 'Projects', icon: 'briefcase', url: 'projects.html' },
            { id: 'skills', label: 'Skills', icon: 'zap', url: 'skills.html' },
            { id: 'experience', label: 'Experience', icon: 'history', url: 'experience.html' },
            { id: 'about', label: 'About', icon: 'user', url: 'about.html' },
            { id: 'settings', label: 'Settings', icon: 'settings', url: 'settings.html' }
        ];

        return items.map(item => `
            <a href="${item.url}" class="nav-item ${activePage === item.id ? 'active' : ''}" data-nav-id="${item.id}" onclick="AdminUI.navigate(event, '${item.url}', '${item.id}')">
                <div class="flex items-center gap-3">
                    <i data-lucide="${item.icon}"></i> <span>${item.label}</span>
                </div>
                ${item.badge ? `<span class="badge bg-dash-accent/20 text-dash-accent">${item.badge}</span>` : ''}
            </a>
        `).join('');
    },

    // 4. SPA Router Logic
    navigate: async function(e, url, pageId) {
        if (e) e.preventDefault();
        
        // Show Loading State (Optional)
        // $('.nav-item').removeClass('active');
        // $(`[data-nav-id="${pageId}"]`).addClass('active');

        try {
            const response = await fetch(url);
            const html = await response.text();
            
            // Extract the dynamic content (assumes the content is inside .admin-view-content)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const targetEl = doc.querySelector('#admin-view-content');
            
            if (!targetEl) {
                console.warn(`Target #admin-view-content not found in ${url}. Falling back to normal navigation.`);
                window.location.href = url;
                return;
            }

            const newContent = targetEl.innerHTML;

            // Inject Content
            $('#admin-view-content').fadeOut(150, function() {
                $(this).html(newContent).fadeIn(200);
                
                // Update History
                history.pushState({ pageId }, '', url);
                
                // Update Sidebar Highlighting
                $('#admin-sidebar-nav .nav-item').removeClass('active');
                $(`[data-nav-id="${pageId}"]`).addClass('active');

                // Re-init Icons and Page-Specific Logic
                lucide.createIcons();
                AdminUI.executeBaseScripts(pageId);
            });

        } catch (error) {
            console.error('SPA Navigation failed:', error);
            // Fallback to normal navigation if fetch fails
            window.location.href = url;
        }
    },

    setupRouting: function() {
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.pageId) {
                const parts = window.location.pathname.split('/');
                const url = parts[parts.length - 1] || 'dashboard.html';
                this.navigate(null, url, e.state.pageId);
            }
        });
    },

    executeBaseScripts: function(pageId) {
        // This simulates running $(document).ready() logic for specific views
        if (pageId === 'dashboard' && typeof loadDashboardStats === 'function') {
            loadDashboardStats();
        }
        if (pageId === 'homepage' && typeof initHomePageEditor === 'function') {
            initHomePageEditor('education');
        }
        if ((pageId === 'skills' || pageId === 'about' || pageId === 'projects') && typeof initHomePageEditor === 'function') {
            initHomePageEditor(pageId);
        }
    }
};
