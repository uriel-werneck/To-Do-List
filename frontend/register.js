document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('access_token');
    console.log('loaded')
    if (token) {
        window.location.href = 'index.html';
    }
});

document.getElementById('register-btn').addEventListener('click', async () => {
    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('pwd-input').value;
    const repeatedPassword = document.getElementById('repeat-pwd-input').value;

    if (password === repeatedPassword) {
        console.log('same password')
        try {
            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    repeatedPassword: repeatedPassword
                })
            });

            if (response.ok) {
                window.location.href='login.html';
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    } else {
        alert('Passwords must be the same!');
    }
})