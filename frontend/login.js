document.getElementById('login-btn').addEventListener('click', async () => { // is this really async?
    const username = document.getElementById('login-input');
    const password = document.getElementById('pwd-input');
    
    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.value, password: password.value })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json();
        console.log(data)

    } catch (err) {
        console.error(err);
    }
});