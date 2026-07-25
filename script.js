document.addEventListener('DOMContentLoaded', () => {
    // Replace these values with your actual Supabase project URL and anon key
    // You can find these in the Supabase Dashboard -> Settings -> API
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const resetForm = document.getElementById('reset-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const submitBtn = document.getElementById('submit-btn');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    if (!resetForm) return;

    // Check if we have a recovery token in the URL hash
    // Supabase JS client automatically extracts the token and establishes a session
    
    // Listen for auth state changes to detect the recovery session
    supabase.auth.onAuthStateChange((event, session) => {
        if (event == 'PASSWORD_RECOVERY') {
            console.log('Password recovery session established');
        }
    });

    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

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

            successMessage.style.display = 'block';
            resetForm.reset();
            resetForm.style.display = 'none';
            
        } catch (error) {
            errorMessage.textContent = error.message || 'An error occurred while updating the password.';
            errorMessage.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update Password';
        }
    });
});
