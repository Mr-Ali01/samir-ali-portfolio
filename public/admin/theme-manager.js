/* 
  Dashboard Theme & Style Sync - Samir Ali Admin
  Prevents color flicker and ensures consistent style across SPA & Standalone pages.
*/

(function() {
    // 1. Initial Theme Logic (Apply immediately before render)
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    const htmlElement = document.documentElement;
    
    const applyToCore = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            htmlElement.setAttribute('data-theme', 'dark');
            document.body?.style.setProperty('background-color', '#020617');
        } else {
            htmlElement.classList.remove('dark');
            htmlElement.setAttribute('data-theme', 'light');
            document.body?.style.setProperty('background-color', '#f8fafc');
        }
    };

    applyToCore(savedTheme);

    // 2. Consistent Dashboard Colors (Force via JS if CSS load delay occurs)
    const setColors = (theme = localStorage.getItem('portfolio-theme') || 'dark') => {
        const root = document.querySelector(':root');
        if (!root) return;
        
        const tokens = {
            dark: {
                '--dash-bg': '#020617',
                '--dash-accent': '#38bdf8',
                '--dash-secondary': '#8b5cf6',
                '--dash-sidebar': 'rgba(15, 23, 42, 0.8)',
                '--dash-border': 'rgba(255, 255, 255, 0.08)',
                '--dash-text': '#f8fafc',
                '--dash-muted': '#94a3b8',
                '--theme-glow': 'rgba(56, 189, 248, 0.15)'
            },
            light: {
                '--dash-bg': '#f8fafc',
                '--dash-accent': '#0284c7',
                '--dash-secondary': '#7c3aed',
                '--dash-sidebar': 'rgba(255, 255, 255, 0.9)',
                '--dash-border': 'rgba(0, 0, 0, 0.05)',
                '--dash-text': '#0f172a',
                '--dash-muted': '#64748b',
                '--theme-glow': 'rgba(2, 132, 199, 0.1)'
            }
        };

        const current = tokens[theme] || tokens.dark;
        Object.keys(current).forEach(key => {
            root.style.setProperty(key, current[key]);
        });
        
        // Update Icons Visibility
        updateIcons(theme);
    };

    const updateIcons = (theme) => {
        const sun = document.getElementById('theme-icon-sun');
        const moon = document.getElementById('theme-icon-moon');
        if (!sun || !moon) return;

        if (theme === 'dark') {
            sun.style.opacity = '0';
            sun.style.transform = 'translateY(20px) rotate(45deg)';
            moon.style.opacity = '1';
            moon.style.transform = 'translateY(0) rotate(0)';
        } else {
            sun.style.opacity = '1';
            sun.style.transform = 'translateY(0) rotate(0)';
            moon.style.opacity = '0';
            moon.style.transform = 'translateY(-20px) rotate(-45deg)';
        }
    };

    // Run immediately and again on DOM ready
    setColors(savedTheme);
    window.addEventListener('DOMContentLoaded', () => {
        setColors(localStorage.getItem('portfolio-theme') || 'dark');
    });
    
    // Global Access
    window.AdminTheme = {
        current: savedTheme,
        toggle: function() {
            const current = localStorage.getItem('portfolio-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            
            localStorage.setItem('portfolio-theme', next);
            this.current = next;
            
            applyToCore(next);
            setColors(next);
            
            // Sync with portfolio logic if loaded (for multi-tab)
            if (typeof GlobalSettings !== 'undefined') {
                GlobalSettings.data.theme_mode = next;
            }
        }
    };
})();
