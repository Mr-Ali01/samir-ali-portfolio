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
    checkAuth();

    // 2. Fetch Dashboard Statistics (Live Data)
    const fetchDashboardStats = () => {
        fetch('/api/v1/admin/stats')
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    const stats = data.stats;
                    $('#stat-projects').text(stats.projects).countUp(); // Assuming a small helper or just text
                    $('#stat-messages').text(stats.messages);
                    $('#stat-visits').text(stats.totalVisits.toLocaleString());
                    $('#stat-visits-today').text(`+ ${stats.todayVisits} today`);
                }
            })
            .catch(err => console.error('Critical: Stats fetch failed:', err));
    };
    fetchDashboardStats();

    // 3. Mode Toggle Logic (Removed as section was deleted from UI)
    // Mode toggling is no longer active in the current Dashboard version.

    // Initialize mode from localstorage
    const savedMode = localStorage.getItem('experienceMode') || 'professional';
    $(`.mode-toggle-btn[data-mode="${savedMode}"]`).addClass('active').siblings().removeClass('active');

    // 4. Sidebar Link Handler
    $('.nav-item').click(function(e) {
        // If it's a real link, navigation will happen naturally.
        // We add active state highlights here if it's SPA, but this is a multi-page app.
    });

    // 5. Fake Notification Utility
    const showNotification = (msg) => {
        console.log('🔔 Notification:', msg);
        // We could implement a toast system here later
    };

});

// API integration logic wrapper
class AdminAPI {
    // In production, we'd add centralized fetch methods here
    static async getProjects() {
        const response = await fetch('/api/v1/projects');
        return await response.json();
    }
}
