$(document).ready(function () {
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

    // 1. Initial State Check (Default to Light, switch to Dark if saved)
    let savedTheme = localStorage.getItem('portfolio-theme');
    
    // If absolutely no theme is saved, assume 'light' as default requirement
    if (!savedTheme) {
        savedTheme = 'light';
        localStorage.setItem('portfolio-theme', 'light');
    }

    // Apply the saved theme immediately inside Document Ready (and sync icons)
    if (savedTheme === 'dark') {
        $('html').addClass('dark');
        themeIconSun.removeClass('rotate-0 scale-100 opacity-100').addClass('-rotate-90 scale-0 opacity-0');
        themeIconMoon.removeClass('rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
    } else {
        $('html').removeClass('dark');
        themeIconSun.removeClass('-rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
        themeIconMoon.removeClass('rotate-0 scale-100 opacity-100').addClass('rotate-90 scale-0 opacity-0');
    }

    // 2. Toggling logic via user click
    $(document).on("click", "#theme-toggle", function(e) {
        e.preventDefault();
        
        // Ensure class changes globally
        const isCurrentlyDark = $('html').hasClass('dark');
        
        if (!isCurrentlyDark) {
            $('html').addClass('dark');
            localStorage.setItem('portfolio-theme', 'dark');
            // Hard swap icons
            $('#theme-icon-sun').removeClass('rotate-0 scale-100 opacity-100').addClass('-rotate-90 scale-0 opacity-0');
            $('#theme-icon-moon').removeClass('rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
        } else {
            $('html').removeClass('dark');
            localStorage.setItem('portfolio-theme', 'light');
            // Hard swap icons
            $('#theme-icon-sun').removeClass('-rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
            $('#theme-icon-moon').removeClass('rotate-0 scale-100 opacity-100').addClass('rotate-90 scale-0 opacity-0');
        }
        
        // Prevent GSAP scroll trigger issues from stopping UI loop
        if (typeof ScrollTrigger !== 'undefined') {
            setTimeout(() => ScrollTrigger.refresh(), 50);
        }
    });

    // ==========================================
    // GSAP ScrollTrigger & Animations
    // ==========================================
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

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

        gsap.fromTo("#services .glass-panel", 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: { trigger: "#services", start: "top 80%" },
                y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", clearProps: "all"
            }
        );

        // 3. Projects Section
        gsap.fromTo(".project-item", 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: { trigger: "#portfolio", start: "top 80%" },
                y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", clearProps: "all"
            }
        );

        // 3. Stats Section
        // Removed missing .counter-box trigger

        // 4. About Section
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

        // 5. Portfolio/Latest Projects Section
        // Removed dup portfolio triggers

        // 6. Blog Articles
        // Removed missing #blog trigger

        // 7. Reviews/Testimonials
        gsap.fromTo("#reviews .max-w-4xl", 
            { scale: 0.95, opacity: 0 },
            {
                scrollTrigger: { trigger: "#reviews", start: "top 80%" },
                scale: 1, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all"
            }
        );

        // 8. Footer Entrance
        gsap.fromTo("footer", 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: { trigger: "footer", start: "top 90%" },
                y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all"
            }
        );
    }

    // ==========================================
    // Parallax background effects
    // ==========================================
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

    // ==========================================
    // EmailJS Contact Form & Modal Logic
    // ==========================================
    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("TSnMk-hxYFVYB1VBI");
    }

    const modal = $('#contact-modal');
    const modalContent = $('#contact-modal-content');
    const openBtn = $('#floating-btn');
    const closeBtn = $('#close-modal');
    const form = $('#contact-form');
    const formFeedback = $('#form-feedback');
    const submitBtn = $('#submit-btn');
    const btnText = $('#btn-text');
    const btnLoader = $('#btn-loader');

    // Open Modal
    openBtn.click(function() {
        modal.removeClass('hidden');
        // Small delay to allow display:block to apply before transition
        setTimeout(() => {
            modal.removeClass('opacity-0 pointer-events-none').addClass('opacity-100');
            modalContent.removeClass('scale-95').addClass('scale-100');
        }, 10);
    });

    // Close Modal Function
    function closeModal() {
        modal.removeClass('opacity-100').addClass('opacity-0 pointer-events-none');
        modalContent.removeClass('scale-100').addClass('scale-95');
        // Wait for transition to finish before hiding
        setTimeout(() => {
            modal.addClass('hidden');
            // reset feedback
            formFeedback.addClass('hidden').removeClass('bg-green-500/20 text-green-400 bg-red-500/20 text-red-400');
        }, 300);
    }

    // Close on click close button or outside modal
    closeBtn.click(closeModal);
    modal.click(function(e) {
        if (e.target === this) closeModal();
    });

    // Handle Form Submit
    form.on('submit', function(e) {
        e.preventDefault();

        const nameInput = $('#contact-name').val().trim();
        const emailInput = $('#contact-email').val().trim();
        const messageInput = $('#contact-message').val().trim();

        // Basic Validation
        if (!nameInput || !emailInput || !messageInput) {
            showFeedback("All fields are required.", "error");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            showFeedback("Please enter a valid email address.", "error");
            return;
        }

        // Setup Loading State
        submitBtn.prop('disabled', true).addClass('opacity-75 cursor-not-allowed');
        btnText.text('Sending...');
        btnLoader.removeClass('hidden');
        formFeedback.addClass('hidden');

        // Prepare EmailJS params
        const templateParams = {
            from_name: nameInput,
            reply_to: emailInput,
            message: messageInput
        };

        // Send primary Email using EmailJS
        emailjs.send("service_7o8so6t", "template_n3fafv7", templateParams)
            .then(function() {
                // Now trigger the auto-reply to the user's email 
                // Note: Re-using your same service ID and template. If you have a specific auto-reply 
                // template ID from EmailJS, you should replace "template_n3fafv7" with it.
                // We pass `to_email` explicitly for the autoresponder template to know where to send it.
                const autoReplyParams = {
                    to_email: emailInput,
                    to_name: nameInput,
                    message: "Thank you for reaching out! I have received your message and will get back to you shortly."
                };

                emailjs.send("service_7o8so6t", "template_n3fafv7", autoReplyParams)
                .finally(function() {
                    // Success UI Feedback
                    showFeedback("Message sent successfully ✅. Check your email for confirmation!", "success");
                    form[0].reset();
                    resetBtnState();
                    setTimeout(closeModal, 3000);
                });

            }, function(error) {
                // Error
                console.error("EmailJS Error:", error);
                showFeedback("Failed to send message. Please try again.", "error");
                resetBtnState();
            });
    });

    function showFeedback(message, type) {
        formFeedback.removeClass('hidden bg-green-500/20 text-green-400 bg-red-500/20 text-red-400');
        if (type === 'success') {
            formFeedback.addClass('bg-green-500/20 text-green-400').text(message);
        } else {
            formFeedback.addClass('bg-red-500/20 text-red-400').text(message);
        }
    }

    function resetBtnState() {
        submitBtn.prop('disabled', false).removeClass('opacity-75 cursor-not-allowed');
        btnText.text('Send Message');
        btnLoader.addClass('hidden');
    }
});
