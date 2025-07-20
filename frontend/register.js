document.getElementById('register-btn').addEventListener('click', async () => {
    const username = document.getElementById('username-input');
    const password = document.getElementById('pwd-input');
    const repeatedPassword = document.getElementById('repeat-pwd-input');

    if (password.value === repeatedPassword.value) {
        console.log('same password')
        try {
            const response = await fetch('http://127.0.0.1:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                    repeatedPassword: repeatedPassword.value
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }

            const data = await response.json()
            console.log(data);

        } catch (err) {
            console.error(err);
        }
    } else {
        alert('Passwords must be the same!');
    }
})