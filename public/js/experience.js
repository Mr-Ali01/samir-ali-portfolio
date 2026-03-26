$(document).ready(function () {
    // 1. Navbar Scroll Effect (Handled by global script.js)
    
    // 2. Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    // 3. Lucide Icons Instance Refresh
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 4. Interactive Timeline Line Animation
    // We can simulate the line growing as we scroll
    $(window).scroll(function() {
        // Logic for timeline line if needed
    });

    // 5. Card Hover Tracking (Optional for deeper 3D effect)
    $('.glass-panel').on('mousemove', function(e) {
        // Advanced 3D effect logic if desired
    });

    // 6. Theme Toggle Support Sync (Global script.js handles the logic, but we can add extras here)
    $(document).on('click', '#theme-toggle', function() {
        // Extra refresh for experience-specific elements if needed
    });

    console.log("🚀 Experience page initialized successfully.");
});
