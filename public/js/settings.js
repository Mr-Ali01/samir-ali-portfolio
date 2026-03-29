/* Settings Page Script */

$(document).ready(function() {
    // 1. Initial State Load
    const loadSettings = () => {
        // Theme
        const theme = localStorage.getItem('portfolio-theme') || 'light';
        updateButtonGroupUI('theme', theme);
        
        // Context
        const context = localStorage.getItem('experienceMode') || 'professional';
        updateButtonGroupUI('context', context);
        
        // Motion
        const motion = localStorage.getItem('portfolio-motion') || 'full';
        updateButtonGroupUI('motion', motion);
        
        // Visual Effects
        const effects = localStorage.getItem('portfolio-effects') !== 'false'; // Default to true
        $('#visual-effects-toggle').prop('checked', effects);
    };

    const updateButtonGroupUI = (group, value) => {
        $(`.setting-btn[data-setting="${group}"]`).removeClass('active');
        $(`.setting-btn[data-setting="${group}"][data-value="${value}"]`).addClass('active');
    };

    // 2. Settings Change Handlers
    $('.setting-btn').click(function() {
        const group = $(this).data('setting');
        const value = $(this).data('value');
        
        // Update localStorage
        if (group === 'theme') {
            localStorage.setItem('portfolio-theme', value);
            // Apply theme immediately
            if (value === 'dark') {
                $('html').addClass('dark');
            } else {
                $('html').removeClass('dark');
            }
        } else if (group === 'context') {
            localStorage.setItem('experienceMode', value);
            // Dynamic Redirect based on selection
            setTimeout(() => {
                window.location.href = value === 'personal' ? 'personal.html' : 'index.html';
            }, 500); // Slight delay for feedback feel
        } else if (group === 'motion') {
            localStorage.setItem('portfolio-motion', value);
        }
        
        // Update UI
        updateButtonGroupUI(group, value);
        
        // Feedback
        showStatus('Settings updated locally');
    });

    // Visual Effects Toggle
    $('#visual-effects-toggle').change(function() {
        const isChecked = $(this).is(':checked');
        localStorage.setItem('portfolio-effects', isChecked);
        showStatus('Effects updated');
    });

    // 3. Status Feedback
    const showStatus = (message) => {
        // Find existing or create new status box
        let statusBox = $('#settings-status');
        if (statusBox.length === 0) {
            statusBox = $('<div id="settings-status" class="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full glass-panel border border-theme-primary/30 text-theme-primary font-bold text-xs opacity-0 translate-y-4 transition-all z-50"></div>');
            $('body').append(statusBox);
        }
        
        statusBox.text(message).removeClass('opacity-0 translate-y-4').addClass('opacity-100 translate-y-0');
        
        setTimeout(() => {
            statusBox.removeClass('opacity-100 translate-y-0').addClass('opacity-0 translate-y-4');
        }, 2000);
    };

    // Initialize
    loadSettings();
    
    // Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
