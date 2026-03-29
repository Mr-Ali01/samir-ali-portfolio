/* Admin Login Logic - Dynamic API Driven */

// 1. Google Credential Handler (Triggered by SDK)
function handleCredentialResponse(response) {
    const id_token = response.credential;
    
    // UI: Show Loading Overlay
    $('#loading-overlay').removeClass('translate-y-full').addClass('translate-y-0');
    $('#error-box').addClass('hidden');

    // 2. Transmit Token to Backend for Secure Validation
    // API: POST /api/v1/auth/google
    fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: id_token })
    })
    .then(async (res) => {
        const data = await res.json();
        
        if (res.status === 200 && data.success) {
            // AUTH SUCCESS: Save user session if needed (but backend handles via httpOnly cookie)
            // Show Success UI or redirect immediately
            setTimeout(() => {
                window.location.href = 'admin/dashboard.html'; 
            }, 1000);
        } else {
            // AUTH FAILURE: Rejecting Unauthorized User
            const errorMsg = data.details ? `Auth Error: ${data.details}` : (data.error || 'Access Denied: Unauthorized Admin');
            handleError(errorMsg);
        }
    })
    .catch((err) => {
        console.error('Network Auth Error:', err);
        handleError('System error connection failed. Please try again.');
    });
}

// 3. Central Error Handling UI
function handleError(message) {
    $('#loading-overlay').addClass('translate-y-full').removeClass('translate-y-0');
    $('#error-message').text(message);
    $('#error-box').removeClass('hidden').addClass('animate-shake');
    
    // Remove shake after animation (so it can re-animate on next fail)
    setTimeout(() => {
        $('#error-box').removeClass('animate-shake');
    }, 500);
}

// 4. Initial Auth state check & Dev Bypass (Shield Click)
$(document).ready(function() {
    $('#admin-shield').click(function() {
        console.log('🛡️ Stealth Bypass Triggered');
        handleCredentialResponse({ credential: 'dev-mock-token' });
    });
});
