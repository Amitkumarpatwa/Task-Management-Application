document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');
    var registerForm = document.getElementById('registerForm');
    var errorMsg = document.getElementById('errorMsg');
    var successMsg = document.getElementById('successMsg');

    // check if already logged in
    fetch('/api/auth/me')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.loggedIn) {
                window.location.href = '/dashboard';
            }
        })
        .catch(function () { });

    // login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            hideMessages();

            var email = document.getElementById('email').value.trim();
            var password = document.getElementById('password').value;

            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }

            fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            })
                .then(function (res) { return res.json().then(function (data) { return { status: res.status, data: data }; }); })
                .then(function (result) {
                    if (result.status === 200) {
                        window.location.href = '/dashboard';
                    } else {
                        showError(result.data.message || 'Login failed');
                    }
                })
                .catch(function () {
                    showError('Something went wrong. Please try again.');
                });
        });
    }

    // register form handler
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            hideMessages();

            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var password = document.getElementById('password').value;
            var confirmPassword = document.getElementById('confirmPassword').value;

            if (!name || !email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, email: email, password: password })
            })
                .then(function (res) { return res.json().then(function (data) { return { status: res.status, data: data }; }); })
                .then(function (result) {
                    if (result.status === 201) {
                        window.location.href = '/dashboard';
                    } else {
                        showError(result.data.message || 'Registration failed');
                    }
                })
                .catch(function () {
                    showError('Something went wrong. Please try again.');
                });
        });
    }

    function showError(msg) {
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.display = 'block';
        }
    }

    function showSuccess(msg) {
        if (successMsg) {
            successMsg.textContent = msg;
            successMsg.style.display = 'block';
        }
    }

    function hideMessages() {
        if (errorMsg) errorMsg.style.display = 'none';
        if (successMsg) successMsg.style.display = 'none';
    }
});
