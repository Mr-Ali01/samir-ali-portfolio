$(document).ready(function () {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Navbar scroll effect
    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            $('#navbar').addClass('bg-[#07090d]/80 backdrop-blur-md py-4 shadow-xl border-b border-white/5');
        } else {
            $('#navbar').removeClass('bg-[#07090d]/80 backdrop-blur-md py-4 shadow-xl border-b border-white/5');
        }
    });

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

    counterObserver.observe(document.querySelector('.counter').parentNode.parentNode);

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
        $('.filter-btn').removeClass('active bg-cyan-500 text-white').addClass('border border-white/10');
        $(this).addClass('active bg-cyan-500 text-white').removeClass('border border-white/10');

        // For demo purpose, we just flicker the grid
        $('.project-card').fadeOut(200).fadeIn(200);
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

    skillsObserver.observe(document.getElementById('about'));

    // Theme Toggle Logic
    const themeToggleBtn = $('#theme-toggle');
    const themeIconSun = $('#theme-icon-sun');
    const themeIconMoon = $('#theme-icon-moon');

    // Check for saved theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    if (savedTheme === 'light') {
        $('body').addClass('light-theme');
        themeIconSun.removeClass('rotate-0 scale-100 opacity-100').addClass('-rotate-90 scale-0 opacity-0');
        themeIconMoon.removeClass('rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
    } else {
        themeIconSun.removeClass('-rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
        themeIconMoon.removeClass('rotate-0 scale-100 opacity-100').addClass('rotate-90 scale-0 opacity-0');
    }

    themeToggleBtn.click(function() {
        $('body').toggleClass('light-theme');
        const isLight = $('body').hasClass('light-theme');
        
        if (isLight) {
            localStorage.setItem('portfolio-theme', 'light');
            themeIconSun.removeClass('rotate-0 scale-100 opacity-100').addClass('-rotate-90 scale-0 opacity-0');
            themeIconMoon.removeClass('rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
        } else {
            localStorage.setItem('portfolio-theme', 'dark');
            themeIconSun.removeClass('-rotate-90 scale-0 opacity-0').addClass('rotate-0 scale-100 opacity-100');
            themeIconMoon.removeClass('rotate-0 scale-100 opacity-100').addClass('rotate-90 scale-0 opacity-0');
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

        // 2. Services Section
        gsap.fromTo("#services .glass-card", 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: { trigger: "#services", start: "top 80%" },
                y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", clearProps: "all"
            }
        );

        // 3. Stats Section
        gsap.fromTo(".counter-box", 
            { scale: 0.8, opacity: 0 },
            {
                scrollTrigger: { trigger: ".counter-box", start: "top 85%" },
                scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)", clearProps: "all"
            }
        );

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
        gsap.fromTo("#portfolio .project-card", 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: { trigger: "#portfolio", start: "top 80%" },
                y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", clearProps: "all"
            }
        );

        // 6. Blog Articles
        gsap.fromTo("#blog .glass-card", 
            { y: 50, opacity: 0 },
            {
                scrollTrigger: { trigger: "#blog", start: "top 80%" },
                y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", clearProps: "all"
            }
        );

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
