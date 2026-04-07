$(document).ready(function () {
    // 0. Global Settings Manager
    const GlobalSettings = {
        data: {},
        init: async function() {
            // 0. Load local preferences first as baseline
            this.loadFromStorage();
            this.applySettings();

            try {
                // 1. Fetch from API
                const res = await fetch('/api/v1/settings');
                const result = await res.json();
                if (result.success) {
                    // 2. Merge API settings, but PRESERVE user's local theme choice
                    const localTheme = localStorage.getItem('portfolio-theme');
                    this.data = {
                        ...result.settings,
                        theme_mode: localTheme || result.settings.theme_mode
                    };
                    this.applySettings();
                }
            } catch (e) {
                console.warn('Settings fetch failed, using local storage.');
            }
        },
        loadFromStorage: function() {
            this.data = {
                experience_mode: localStorage.getItem('experienceMode') || 'professional',
                theme_mode: localStorage.getItem('portfolio-theme') || localStorage.getItem('themeMode') || 'dark',
                motion_control: localStorage.getItem('motionControl') || 'full',
                visual_effects: JSON.parse(localStorage.getItem('visualEffects') || '{"glow":true,"blur":true,"shadows":true}')
            };
        },
        applySettings: function() {
            const s = this.data;
            if (!s) return;

            // A. Experience Mode
            localStorage.setItem('experienceMode', s.experience_mode);
            this.applyExperienceMode(s.experience_mode);

            // B. Theme Mode
            document.documentElement.setAttribute('data-theme', s.theme_mode);
            document.documentElement.classList.toggle('dark', s.theme_mode === 'dark');
            localStorage.setItem('portfolio-theme', s.theme_mode);
            this.updateThemeIcons(s.theme_mode);

            // C. Motion Control
            document.documentElement.setAttribute('data-motion', s.motion_control);
            if (s.motion_control === 'none' || s.motion_control === 'reduced') {
                if (typeof AOS !== 'undefined') AOS.refresh();
            }

            // D. Visual Effects
            if (s.visual_effects) {
                const body = $('body');
                s.visual_effects.glow ? body.removeClass('no-glow') : body.addClass('no-glow');
                s.visual_effects.blur ? body.removeClass('no-blur') : body.addClass('no-blur');
                s.visual_effects.shadows ? body.removeClass('no-shadows') : body.addClass('no-shadows');
            }

            // E. Sync other UI elements (like Settings page buttons)
            this.syncOtherUI(s.theme_mode);
        },
        syncOtherUI: function(theme) {
            // Update any settings buttons if they exist on the current page
            $(`.setting-btn[data-setting="theme"]`).removeClass('active');
            $(`.setting-btn[data-setting="theme"][data-value="${theme}"]`).addClass('active');
        },
        applyExperienceMode: function(mode) {
            const isPersonal = mode === 'personal';
            const brandingLink = $('.group[href="index.html"], .group[href="personal.html"]');
            const backToHubLink = $('a:contains("Back to Hub")');

            if (isPersonal) {
                $('.nav-link-pro').addClass('hidden');
                $('.nav-link-per').removeClass('hidden');
                brandingLink.attr('href', 'personal.html');
                backToHubLink.attr('href', 'personal.html');
            } else {
                $('.nav-link-pro').removeClass('hidden');
                $('.nav-link-per').addClass('hidden');
                brandingLink.attr('href', 'index.html');
                backToHubLink.attr('href', 'index.html');
            }
        },
        updateThemeIcons: function(theme) {
            const themeIconSun = $('#theme-icon-sun');
            const themeIconMoon = $('#theme-icon-moon');
            if (theme === 'dark') {
                themeIconSun.removeClass('rotate-0 scale-100 opacity-100').addClass('-rotate-90 scale-0 opacity-0');
                themeIconMoon.removeClass('rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
            } else {
                themeIconSun.removeClass('-rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
                themeIconMoon.removeClass('rotate-0 scale-100 opacity-100').addClass('rotate-90 scale-0 opacity-0');
            }
        }
    };

    // Run Settings Initialization
    GlobalSettings.init();

    // Initialize Lucide Icons
    lucide.createIcons();

    // Navbar scroll effect
    $(window).scroll(function () {
        const scrollPos = $(this).scrollTop();
        
        // 1. Transition navbar background on scroll
        if (scrollPos > 50) {
            $('#navbar').addClass('scrolled');
        } else {
            $('#navbar').removeClass('scrolled');
        }

        // 2. ScrollSpy & Current Page logic
        const sections = ['about', 'skills', 'experience', 'portfolio', 'contact'];
        let currentSection = "";
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        sections.forEach(function(sectionId) {
            const el = document.getElementById(sectionId);
            if (el) {
                const sectionTop = el.offsetTop - 120;
                const sectionHeight = el.offsetHeight;
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                }
            }
        });

        $('.nav-link').each(function() {
            const href = $(this).attr('href');
            
            // 1. Reset to default state
            $(this).removeClass('text-theme-primary opacity-100 font-bold').addClass('text-theme-textSecondary opacity-70');

            // 2. Highlighting logic
            if (href) {
                // Case A: Exact path match for dedicated pages
                if (href === currentPath) {
                    $(this).addClass('text-theme-primary opacity-100 font-bold').removeClass('text-theme-textSecondary opacity-70');
                }
                // Case B: ScrollSpy match for section anchors
                else if (href.startsWith('#')) {
                    const id = href.substring(1);
                    if (id === currentSection) {
                        $(this).addClass('text-theme-primary opacity-100 font-bold').removeClass('text-theme-textSecondary opacity-70');
                    }
                }
            }
        });
    });

    // Interaction Overhaul: Scroll on HOVER, focal scroll on CLICK
    let hoverScrollTimeout;
    $('.nav-link').on('mouseenter', function() {
        const targetId = $(this).attr('href');
        if (targetId && targetId.startsWith('#')) {
            clearTimeout(hoverScrollTimeout);
            hoverScrollTimeout = setTimeout(() => {
                const target = $(targetId);
                if (target.length) {
                    $('html, body').stop().animate({
                        scrollTop: target.offset().top - 80
                    }, 1200, 'swing'); // Slightly slower for smooth hover feel
                }
            }, 300); // 300ms delay to prevent accidental scrolls
        }
    });

    // Clicking will still work as a focal action
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();
        const targetId = $.attr(this, 'href');
        if (targetId === '#') return;
        const target = $(targetId);
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 600);
        }
    });

    // Initial Trigger for ScrollSpy on page load
    $(window).trigger('scroll');

    // Counter Animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $('.counter').each(function () {
                    const $this = $(this);
                    const target = parseInt($this.data('target'));
                    $this.prop('Counter', 0).animate({
                        Counter: target
                    }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function (now) {
                            $this.text(Math.ceil(now) + '+');
                        }
                    });
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const counterElement = document.querySelector('.counter');
    if (counterElement) {
        if(counterElement.parentNode && counterElement.parentNode.parentNode) { counterObserver.observe(counterElement.parentNode.parentNode); } else { counterObserver.observe(counterElement); }
    }

    // Simple Testimonial Slider
    let currentSlide = 0;
    const slides = $('.testimonial-track > div');
    const totalSlides = slides.length;

    function updateSlider() {
        const offset = -currentSlide * 100;
        $('.testimonial-track').css('transform', `translateX(${offset}%)`);

        $('.slider-dot').removeClass('active w-6 bg-cyan-400');
        $('.slider-dot').addClass('w-2 bg-white/20');
        $(`.slider-dot[data-index="${currentSlide}"]`).addClass('active w-6 bg-cyan-400').removeClass('w-2 bg-white/20');
    }

    $('#next-btn').click(function () {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });

    $('#prev-btn').click(function () {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    $('.slider-dot').click(function () {
        currentSlide = $(this).data('index');
        updateSlider();
    });

    // Filter Projects
    $('.filter-btn').click(function () {
        // Reset all buttons to inactive Style
        $('.filter-btn').removeClass('active bg-theme-primary hover:opacity-90 text-white neon-glow')
            .addClass('bg-white text-slate-600 shadow-sm hover:text-theme-primary hover:shadow-md');
        
        // Set clicked button to Active Style
        $(this).addClass('active bg-theme-primary hover:opacity-90 text-white neon-glow')
            .removeClass('bg-white text-slate-600 shadow-sm hover:text-theme-primary hover:shadow-md');

        const filterValue = $(this).attr('data-filter');
        let visibleCount = 0;

        $('.project-item').each(function() {
            if (filterValue === 'all' || $(this).attr('data-category') === filterValue) {
                $(this).fadeIn(300);
                visibleCount++;
            } else {
                $(this).hide();
            }
        });

        // Toggle Empty Case Message
        if (visibleCount === 0) {
            $('#no-projects-msg').removeClass('hidden').hide().fadeIn(400);
        } else {
            $('#no-projects-msg').addClass('hidden');
        }
    });

    // Mobile Menu
    $('#mobile-menu-btn').click(function () {
        // Simplified for this demo
        alert("Mobile menu clicked. In a full site, this would toggle a slide-over menu.");
    });

    // Skill bars animation on scroll
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $('.progress-bar-inner').each(function () {
                    const width = $(this).css('width');
                    // They are already styled in CSS, but this re-triggers it
                    $(this).css('width', $(this).parent().data('width'));
                });
            }
        });
    }, { threshold: 0.2 });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        skillsObserver.observe(aboutSection);
    }

    // Theme Toggle Logic
    const themeToggleBtn = $('#theme-toggle');
    const themeIconSun = $('#theme-icon-sun');
    const themeIconMoon = $('#theme-icon-moon');

    // 1. Initial State Check (Default to Dark)
    let savedTheme = localStorage.getItem('portfolio-theme');
    
    if (!savedTheme) {
        savedTheme = 'dark';
        localStorage.setItem('portfolio-theme', 'dark');
    }

    // Apply the saved theme immediately and sync icons
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        $('html').addClass('dark');
    } else {
        $('html').removeClass('dark');
    }
    GlobalSettings.updateThemeIcons(savedTheme);

    // 2. Toggling logic via user click
    $(document).on("click", "#theme-toggle", function(e) {
        e.preventDefault();
        
        // Ensure class changes globally
        const isCurrentlyDark = $('html').hasClass('dark');
        
        if (!isCurrentlyDark) {
            $('html').addClass('dark');
            $('html').attr('data-theme', 'dark');
            localStorage.setItem('portfolio-theme', 'dark');
            if (GlobalSettings && GlobalSettings.data) GlobalSettings.data.theme_mode = 'dark';
            GlobalSettings.updateThemeIcons('dark');
        } else {
            $('html').removeClass('dark');
            $('html').attr('data-theme', 'light');
            localStorage.setItem('portfolio-theme', 'light');
            if (GlobalSettings && GlobalSettings.data) GlobalSettings.data.theme_mode = 'light';
            GlobalSettings.updateThemeIcons('light');
        }
        
        // Prevent GSAP scroll trigger issues from stopping UI loop
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => ScrollTrigger.refresh(), 50);
        }

        // Sync other UI elements that might be on the same page (e.g. Settings page)
        GlobalSettings.syncOtherUI(!isCurrentlyDark ? 'dark' : 'light');
    });

    // 3. Multi-Tab Synchronization
    window.addEventListener('storage', (e) => {
        if (e.key === 'portfolio-theme') {
            const newTheme = e.newValue || 'dark';
            
            // Sync current page theme
            document.documentElement.setAttribute('data-theme', newTheme);
            $('html').toggleClass('dark', newTheme === 'dark');
            GlobalSettings.updateThemeIcons(newTheme);
            GlobalSettings.syncOtherUI(newTheme);
            
            // Refresh layout if needed
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => ScrollTrigger.refresh(), 100);
            }
        }
    });

    // ==========================================
    // GSAP ScrollTrigger & Animations
    // ==========================================
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // 1. Hero Section Entrance
        let heroTimeline = gsap.timeline();
        heroTimeline.fromTo(".hero-content > *", 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
        )
        .fromTo(".hero-image-container", 
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.6"
        );

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.fromTo("#services .glass-panel", 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: { trigger: "#services", start: "top 80%" },
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", clearProps: "all"
                }
            );

            gsap.fromTo(".project-item", 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: { trigger: "#portfolio", start: "top 80%" },
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", clearProps: "all"
                }
            );

            gsap.fromTo("#about .grid > div:first-child", 
                { x: -50, opacity: 0 },
                {
                    scrollTrigger: { trigger: "#about", start: "top 80%" },
                    x: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all"
                }
            );

            gsap.fromTo("#about .grid > div:last-child", 
                { x: 50, opacity: 0 },
                {
                    scrollTrigger: { trigger: "#about", start: "top 80%" },
                    x: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all"
                }
            );

            gsap.fromTo("#reviews .max-w-4xl", 
                { scale: 0.95, opacity: 0 },
                {
                    scrollTrigger: { trigger: "#reviews", start: "top 80%" },
                    scale: 1, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all"
                }
            );

            gsap.fromTo("footer", 
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: { trigger: "footer", start: "top 90%" },
                    y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all"
                }
            );

            // Parallax background effects
            gsap.to(".glow-sphere", {
                y: "40%",
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    }

    // ==========================================
    // Legacy contact logic removed in favor of contact.js
    // ==========================================

    console.log("🚀 Portfolio core scripts initialized.");
});
