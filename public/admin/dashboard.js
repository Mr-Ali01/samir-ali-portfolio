/* Dashboard Central Logic - Samir Ali Admin */

$(document).ready(function() {
    
    // 1. Authentication Security Check (Via Backend)
    const checkAuth = async () => {
        try {
            const res = await fetch('/api/v1/auth/status');
            const data = await res.json();
            
            if (!res.ok || !data.success) {
                console.warn('Unauthorized access attempt detected.');
                window.location.href = '../login.html';
            } else {
                console.log('✅ Session verified successfully.');
            }
        } catch (error) {
            console.error('Session verify failed:', error);
            window.location.href = '../login.html';
        }
    };
    
    // (Session check is now handled via AdminUI/Server logic, but kept here for fallback)
    // checkAuth(); 

    // 2. Initialize UI State from Storage
    const savedMode = localStorage.getItem('experienceMode') || 'professional';
    $(`.mode-toggle-btn[data-mode="${savedMode}"]`).addClass('active').siblings().removeClass('active');

    // 3. Fake Notification Utility
    const showNotification = (msg) => {
        console.log('🔔 Notification:', msg);
    };

});

/**
 * Global exported function for AdminUI
 * This is called by AdminUI.executeBaseScripts('dashboard') 
 * only when the dashboard view is actually rendered.
 */
window.loadDashboardStats = function() {
    console.log('📊 Loading Dashboard Stats...');
    fetch('/api/v1/admin/stats')
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                const stats = data.stats;
                $('#stat-projects').text(stats.projects);
                $('#stat-messages').text(stats.messages);
                $('#stat-visits').text(stats.totalVisits.toLocaleString());
                $('#stat-visits-today').text(`+ ${stats.todayVisits} today`);
            }
        })
        .catch(err => console.error('Critical: Stats fetch failed:', err));

    // Dynamic Recent Messages Load
    fetch('/api/v1/manage/contacts')
        .then(res => res.json())
        .then(data => {
            const container = $('#dashboard-recent-messages');
            if(data.success) {
                const latest = (data.data || []).sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
                container.empty();
                if(latest.length === 0) {
                    container.html('<div class="text-center py-6 text-dash-muted text-sm">No recent messages found</div>');
                    return;
                }
                latest.forEach(msg => {
                    const timeAgo = Math.floor((new Date() - new Date(msg.created_at)) / (1000 * 60 * 60));
                    const timeStr = timeAgo < 24 ? (timeAgo === 0 ? 'Just now' : `${timeAgo} hrs ago`) : new Date(msg.created_at).toLocaleDateString();
                    const isNew = msg.status === 'new';
                    
                    container.append(`
                        <div class="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300 cursor-pointer ${!isNew ? 'opacity-70 grayscale-[30%]' : ''}">
                            <div class="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
                                <div class="relative flex-shrink-0">
                                    <div class="absolute inset-0 bg-dash-accent/20 blur-md rounded-full group-hover:bg-dash-accent/40 transition-colors"></div>
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.name}" class="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                                    ${isNew ? '<div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[var(--dash-bg)] rounded-full animate-pulse z-10"></div>' : ''}
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <h4 class="font-black text-sm md:text-base text-dash-text truncate">${msg.name}</h4>
                                        <span class="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest text-dash-muted hidden sm:inline-block">${msg.inquiry_type || 'General'}</span>
                                    </div>
                                    <p class="text-xs md:text-sm text-dash-muted truncate pr-2 group-hover:text-dash-text/80 transition-colors">${msg.message}</p>
                                </div>
                            </div>
                            <div class="flex items-center justify-between sm:flex-col sm:items-end gap-1 flex-shrink-0 border-t border-white/5 sm:border-0 pt-3 sm:pt-0">
                                <p class="text-[10px] md:text-xs font-bold text-dash-muted uppercase tracking-wider">${timeStr}</p>
                                ${isNew 
                                    ? '<span class="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-sm">Unread</span>' 
                                    : '<span class="text-[9px] text-dash-muted font-black uppercase tracking-widest px-2.5 py-1">Viewed</span>'}
                            </div>
                        </div>
                    `);
                });
            } else {
                container.html('<div class="text-center py-6 text-red-400 text-sm">Failed to load messages</div>');
            }
        })
        .catch(err => {
            console.error('Failed to load recent messages:', err);
            $('#dashboard-recent-messages').html('<div class="text-center py-6 text-red-400 text-sm">Error loading messages</div>');
        });
};

// API integration logic wrapper
class AdminAPI {
    static async getProjects() {
        const response = await fetch('/api/v1/projects');
        return await response.json();
    }
}
