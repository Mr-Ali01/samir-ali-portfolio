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

    // 3. Share Button Interaction
    $('.glass-panel button').on('click', function() {
        const url = window.location.href;
        if (navigator.share) {
            navigator.share({
                title: 'Samir Ali - Resume',
                text: 'Check out Samir Ali\'s curriculum vitae and professional portfolio.',
                url: url
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            const $temp = $("<input>");
            $("body").append($temp);
            $temp.val(url).select();
            document.execCommand("copy");
            $temp.remove();
            
            // Visual feedback
            const $btn = $(this);
            const $original = $btn.html();
            $btn.html('<i data-lucide="check" class="w-6 h-6 text-green-500"></i>');
            lucide.createIcons();
            setTimeout(() => {
                $btn.html($original);
                lucide.createIcons();
            }, 2000);
        }
    });

    // 4. Document Entry Animation
    // We can add a slight reveal effect to sections as user scrolls
    $(window).scroll(function() {
        // Logic for specialized section highlights if needed
    });

    console.log("📄 Resume page operations initialized successfully.");
});
