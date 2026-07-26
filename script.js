document.addEventListener('DOMContentLoaded', async () => {
    // Replace these values with your actual Supabase project URL and anon key
    // You can find these in the Supabase Dashboard -> Settings -> API
    const SUPABASE_URL = 'https://yxzdairbamirugrxgkmr.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_yOgCucOQjK8QirL88NGPBw_CADBBu4i';

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token_hash = urlParams.get('token_hash');
    const type = urlParams.get('type');

    // VERIFY PAGE LOGIC
    const verifyCard = document.getElementById('verify-card');
    if (verifyCard) {
        const verifyLoading = document.getElementById('verify-loading');
        const verifySuccess = document.getElementById('verify-success');
        const verifyError = document.getElementById('verify-error');
        const verifyErrorMsg = document.getElementById('verify-error-msg');

        if (!token_hash || type !== 'signup') {
            verifyLoading.style.display = 'none';
            verifyError.style.display = 'block';
            verifyErrorMsg.textContent = 'Verification link is invalid or missing parameters.';
            return;
        }

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                token_hash: token_hash,
                type: 'signup'
            });

            verifyLoading.style.display = 'none';

            if (error) {
                verifyError.style.display = 'block';
                verifyErrorMsg.textContent = error.message || 'Verification link is invalid or expired.';
            } else {
                verifySuccess.style.display = 'block';
            }
        } catch (err) {
            verifyLoading.style.display = 'none';
            verifyError.style.display = 'block';
            verifyErrorMsg.textContent = 'An unexpected error occurred.';
        }
        return; // End verify page logic
    }

    // RESET PASSWORD PAGE LOGIC
    const resetCard = document.getElementById('reset-card');
    if (resetCard) {
        const resetLoading = document.getElementById('reset-loading');
        const resetContent = document.getElementById('reset-content');
        const resetSuccess = document.getElementById('reset-success');
        const resetError = document.getElementById('reset-error');
        const resetErrorMsg = document.getElementById('reset-error-msg');
        
        const resetForm = document.getElementById('reset-form');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        const submitBtn = document.getElementById('submit-btn');
        const errorMessage = document.getElementById('error-message');

        if (!token_hash || type !== 'recovery') {
            resetLoading.style.display = 'none';
            resetError.style.display = 'block';
            resetErrorMsg.textContent = 'Reset link is invalid or missing parameters.';
            return;
        }

        try {
            // Verify the OTP first to establish a session
            const { data, error } = await supabase.auth.verifyOtp({
                token_hash: token_hash,
                type: 'recovery'
            });

            resetLoading.style.display = 'none';

            if (error) {
                resetError.style.display = 'block';
                resetErrorMsg.textContent = error.message || 'Verification link is invalid or expired.';
                return;
            }

            // Session established, show the reset form
            resetContent.style.display = 'block';

        } catch (err) {
            resetLoading.style.display = 'none';
            resetError.style.display = 'block';
            resetErrorMsg.textContent = 'An unexpected error occurred.';
            return;
        }

        // Handle form submission
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            errorMessage.style.display = 'none';

            const newPassword = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (newPassword !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match.';
                errorMessage.style.display = 'block';
                return;
            }

            if (newPassword.length < 6) {
                errorMessage.textContent = 'Password must be at least 6 characters.';
                errorMessage.style.display = 'block';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';

            try {
                const { data, error } = await supabase.auth.updateUser({
                    password: newPassword
                });

                if (error) {
                    throw error;
                }

                resetContent.style.display = 'none';
                resetSuccess.style.display = 'block';
                
            } catch (error) {
                errorMessage.textContent = error.message || 'An error occurred while updating the password.';
                errorMessage.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Update Password';
            }
        });
        // Handle show/hide password toggles
        const toggleButtons = document.querySelectorAll('.toggle-password');
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const input = document.getElementById(targetId);
                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        btn.textContent = '🙈';
                    } else {
                        input.type = 'password';
                        btn.textContent = '👁️';
                    }
                }
            });
        });
    }
});
