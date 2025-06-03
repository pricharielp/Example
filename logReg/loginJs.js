document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.querySelector('input[name="role"]:checked').value;

        sessionStorage.setItem('userRole', role);
        
        if (role === 'parent') {
            window.location.href = '../dashboard/dash.html';
        } else {
            window.location.href = '../babysitter/bshome.html';
        }
    });
});