document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // 🔴 stop the default form submission

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
                window.location.href = 'login.html';
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    } else {
        alert('Passwords must be the same!');
    }
});
