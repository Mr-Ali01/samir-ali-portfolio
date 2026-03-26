$(document).ready(function () {
    // 1. Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }

    // 2. Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    let selectedType = '';
    const formData = {
        budget: '',
        timeline: '',
        communication: ''
    };

    // 3. Step 1: Selection Logic
    $('.inquiry-card').on('click', function () {
        const type = $(this).data('type');
        const title = $(this).find('h3').text();
        
        // Visual indicator
        $('.inquiry-card').removeClass('active');
        $(this).addClass('active');

        // State update
        selectedType = type;
        $('#form-title').text(title);

        // Transition logic
        $('#select-hint').fadeOut(300, function() {
            $('#step-2').fadeIn(500).removeClass('hidden');
            
            // Dynamic Form Layout
            updateFormLayout(type);
            
            // Scroll to form
            $('html, body').animate({
                scrollTop: ($('#step-2').offset().top - 120)
            }, 800);
        });
    });

    // 4. Back Button logic
    $('#back-to-step-1').on('click', function() {
        $('#step-2').fadeOut(300, function() {
            $(this).addClass('hidden');
            $('#select-hint').fadeIn(500);
            $('.inquiry-card').removeClass('active');
             $('html, body').animate({
                scrollTop: ($('#step-1').offset().top - 120)
            }, 800);
        });
    });

    // 5. Dynamic Form Layout Logic
    function updateFormLayout(type) {
        // Types that show Project Context section:
        const showContext = ['freelance', 'collaboration', 'technical'];
        
        // Show/Hide Project Type dropdown
        if (showContext.includes(type)) {
            $('#project-type-container').slideDown(300).removeClass('hidden');
            $('#project-context-section').slideDown(300).removeClass('hidden');
        } else {
            $('#project-type-container').slideUp(300).addClass('hidden');
            $('#project-context-section').slideUp(300).addClass('hidden');
        }

        // Update Textarea placeholder
        let placeholder = "Describe your project...";
        if (type === 'job') placeholder = "Tell me about the role...";
        if (type === 'internship') placeholder = "Tell me about your background...";
        if (type === 'general') placeholder = "Anything else on your mind?";
        
        $('textarea[name="message"]').attr('placeholder', placeholder);
    }

    // 6. Chip Selection Logic (Reusable)
    function handleChipSelect(selector, dataKey) {
        $(selector + ' .chip').on('click', function() {
            $(selector + ' .chip').removeClass('active');
            $(this).addClass('active');
            formData[dataKey] = $(this).data('value');
        });
    }

    handleChipSelect('#budget-chips', 'budget');
    handleChipSelect('#timeline-chips', 'timeline');
    handleChipSelect('#comm-chips', 'communication');

    // 7. Form Submission Simulation
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        
        const $btn = $('#submit-btn');
        const $originalContent = $btn.html();

        // 1. Loading State
        $btn.html('<div class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending...');
        $btn.addClass('pointer-events-none opacity-80');

        // 2. Mock API delay
        setTimeout(() => {
            // 3. Success Transition
            $('#step-1, #step-2').fadeOut(400, function() {
                $('#success-state').fadeIn(600).removeClass('hidden');
                
                // Update success message based on type
                $('#success-message').text(`Thanks for your ${selectedType} inquiry. I'll review it and get back to you within 24-48 hours.`);
                
                // Scroll to top
                $('html, body').animate({ scrollTop: 0 }, 500);
            });
        }, 1500);
    });

    // 8. Reset Form Logic
    $('#reset-form-btn').on('click', function() {
        $('#success-state').fadeOut(400, function() {
            $(this).addClass('hidden');
            $('#step-1').fadeIn(500);
            $('#contact-form')[0].reset();
            $('.inquiry-card').removeClass('active');
            $('.chip').removeClass('active');
            $('#select-hint').show();
        });
    });

    console.log("📬 Contact form engine initialized successfully.");
});
