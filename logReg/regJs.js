// regJs.js
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate form fields
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return false;
        }
        
        // Get form values
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const role = document.querySelector('input[name="role"]:checked').value;
        
        // Store user information
        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            role: role
        };
        
        // Store in localStorage
        localStorage.setItem('registeredUser', JSON.stringify(user));
        sessionStorage.setItem('userRole', role);
        
        // Redirect based on user role
        if (role === 'parent') {
            window.location.href = '../dashboard/dash.html';
        } else {
            window.location.href = '../sitter/sitter-dashboard.html';
        }
    });
    
    // Real-time password match validation
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    confirmPasswordInput.addEventListener('input', function() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity("Passwords don't match");
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    });
});