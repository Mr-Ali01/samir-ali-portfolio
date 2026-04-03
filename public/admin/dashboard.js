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
};

// API integration logic wrapper
class AdminAPI {
    static async getProjects() {
        const response = await fetch('/api/v1/projects');
        return await response.json();
    }
}
