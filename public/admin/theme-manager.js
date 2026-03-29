/* 
  Dashboard Theme & Style Sync - Samir Ali Admin
  Prevents color flicker and ensures consistent style across SPA & Standalone pages.
*/

(function() {
    // 1. Initial Theme Logic (Apply immediately before render)
    const savedTheme = localStorage.getItem('admin_theme') || 'dark';
    const htmlElement = document.documentElement;
    
    // Set base class
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
        document.body?.style.setProperty('background-color', '#020617');
    } else {
        htmlElement.classList.remove('dark');
        document.body?.style.setProperty('background-color', '#f8fafc');
    }

    // 2. Consistent Dashboard Colors (Force via JS if CSS load delay occurs)
    const setColors = () => {
        const root = document.querySelector(':root');
        if (!root) return;
        
        // Define unified theme tokens
        const tokens = {
            dark: {
                '--dash-bg': '#020617',
                '--dash-accent': '#38bdf8',
                '--dash-secondary': '#8b5cf6',
                '--dash-sidebar': 'rgba(15, 23, 42, 0.8)',
                '--dash-border': 'rgba(255, 255, 255, 0.08)',
                '--dash-text': '#f8fafc',
                '--dash-muted': '#94a3b8'
            },
            light: {
                '--dash-bg': '#f8fafc',
                '--dash-accent': '#0284c7',
                '--dash-secondary': '#7c3aed',
                '--dash-sidebar': 'rgba(255, 255, 255, 0.9)',
                '--dash-border': 'rgba(0, 0, 0, 0.05)',
                '--dash-text': '#0f172a',
                '--dash-muted': '#64748b'
            }
        };

        const current = tokens[savedTheme] || tokens.dark;
        Object.keys(current).forEach(key => {
            root.style.setProperty(key, current[key]);
        });
    };

    // Run immediately and again on DOM ready
    setColors();
    window.addEventListener('DOMContentLoaded', setColors);
    
    // Global Access
    window.AdminTheme = {
        current: savedTheme,
        apply: function(theme) {
            localStorage.setItem('admin_theme', theme);
            location.reload(); // Refresh to ensure all styles/libraries re-sync correctly
        }
    };
})();
