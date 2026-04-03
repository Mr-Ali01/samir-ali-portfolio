/**
 * Settings Manager - Samir Ali Admin
 * Handles global configuration, UI preferences, and SMTP/Templates.
 */

const SettingsManager = {
    settings: {},
    templates: [],
    activeTab: 'general',

    init: async function() {
        console.log('⚙️ Settings Manager Initializing...');
        this.setupTabSwitching();
        await this.loadAllData();
        this.renderSettings();
        this.renderTemplates();
        this.setupEventListeners();
        lucide.createIcons();
    },

    // 1. UI: Tab Switching
    setupTabSwitching: function() {
        const self = this;
        $('.settings-tab-btn').on('click', function() {
            const tabId = $(this).data('tab');
            self.activeTab = tabId;

            // Update Nav
            $('.settings-tab-btn').removeClass('active');
            $(this).addClass('active');

            // Update Panels
            $('.settings-tab-panel').addClass('hidden');
            $(`#settings-${tabId}`).removeClass('hidden');
            
            lucide.createIcons();
        });
    },

    // 2. Data Loading
    loadAllData: async function() {
        try {
            // Load Settings
            const sRes = await fetch('/api/v1/settings');
            const sData = await sRes.json();
            if (sData.success) this.settings = sData.settings;

            // Load Templates
            const tRes = await fetch('/api/v1/manage/email-templates');
            const tData = await tRes.json();
            if (tData.success) this.templates = tData.templates;

        } catch (error) {
            console.error('Failed to load settings data:', error);
        }
    },

    // 3. Rendering
    renderSettings: function() {
        const s = this.settings;
        if (!s) return;

        // General
        $(`input[name="experience_mode"][value="${s.experience_mode}"]`).prop('checked', true);

        // UI/UX
        $('.mode-toggle-btn[data-setting="theme_mode"]').removeClass('active');
        $(`.mode-toggle-btn[data-setting="theme_mode"][data-value="${s.theme_mode}"]`).addClass('active');

        if (s.motion_control) $('select[name="motion_control"]').val(s.motion_control);

        if (s.visual_effects) {
            $('input[name="effect_glow"]').prop('checked', s.visual_effects.glow);
            $('input[name="effect_blur"]').prop('checked', s.visual_effects.blur);
            $('input[name="effect_shadows"]').prop('checked', s.visual_effects.shadows);
        }

        // Communication
        if (s.auto_reply) $('input[name="auto_reply"]').prop('checked', s.auto_reply === 'on');
    },

    renderTemplates: function() {
        const selector = $('#template-selector');
        const selectedId = selector.val();
        const template = this.templates.find(t => t.name === selectedId);

        if (template) {
            $('#template-subject').val(template.subject);
            $('#template-body').val(template.body);
        }
    },

    // 4. Persistence
    saveSetting: async function(key, value) {
        try {
            const res = await fetch('/api/v1/settings/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });
            const data = await res.json();
            if (data.success) {
                this.settings[key] = value;
                // Apply locally for instant feedback (mock)
                if (key === 'theme_mode') {
                    // In a real app, this would trigger a theme change event
                    console.log(`Theme changed to ${value}`);
                }
            }
        } catch (error) {
            console.error(`Failed to save ${key}:`, error);
        }
    },

    saveTemplate: async function() {
        const name = $('#template-selector').val();
        const template = this.templates.find(t => t.name === name);
        if (!template) return;

        const subject = $('#template-subject').val();
        const body = $('#template-body').val();

        try {
            const res = await fetch('/api/v1/manage/email-templates/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: template.id, subject, body })
            });
            const data = await res.json();
            if (data.success) {
                template.subject = subject;
                template.body = body;
                Swal.fire({
                    icon: 'success',
                    title: 'Template Saved',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (error) {
            console.error('Failed to save template:', error);
        }
    },

    setupEventListeners: function() {
        const self = this;

        // Individual Auto-Saves for simple toggles
        $('input[type="radio"], input[type="checkbox"], select').on('change', function() {
            const name = $(this).attr('name');
            let value = $(this).val();

            if ($(this).is(':checkbox')) {
                value = $(this).is(':checked') ? (name === 'auto_reply' ? 'on' : true) : (name === 'auto_reply' ? 'off' : false);
            }

            // Group visual effects
            if (name.startsWith('effect_')) {
                const effects = {
                    glow: $('input[name="effect_glow"]').is(':checked'),
                    blur: $('input[name="effect_blur"]').is(':checked'),
                    shadows: $('input[name="effect_shadows"]').is(':checked')
                };
                self.saveSetting('visual_effects', effects);
            } else {
                self.saveSetting(name, value);
            }
        });

        // Theme Toggle Buttons
        $('.mode-toggle-btn').on('click', function() {
            const setting = $(this).data('setting');
            const value = $(this).data('value');

            $(`.mode-toggle-btn[data-setting="${setting}"]`).removeClass('active');
            $(this).addClass('active');

            self.saveSetting(setting, value);
        });

        // Template Selector
        $('#template-selector').on('change', () => this.renderTemplates());

        // Save All Button (Explicit save for templates or non-auto-save fields)
        $('#save-all-settings').on('click', async function() {
            $(this).addClass('opacity-50 pointer-events-none').text('Saving...');
            
            // Save templates
            await self.saveTemplate();

            $(this).removeClass('opacity-50 pointer-events-none').text('Save Changes');
        });
    }
};

// Global initialization function for AdminUI
function initSettingsManager() {
    console.log('🚀 initSettingsManager called from AdminUI');
    if (typeof SettingsManager !== 'undefined') {
        SettingsManager.init();
    } else {
        console.error('❌ SettingsManager object is not defined!');
    }
}
