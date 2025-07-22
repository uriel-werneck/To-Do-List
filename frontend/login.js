/* 
Use <div> or alert() to show errors
Disable buttons, show spinners, or change button text during an ongoing request
to prevent multiple clicks and inform the user.
*/

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        window.location.href = 'index.html';
    }
});

document.getElementById('login-btn').addEventListener('click', async () => { // is this really async?
    const username = document.getElementById('login-input').value.trim();
    const password = document.getElementById('pwd-input').value;
    
    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // store token and redirect to the main page
            localStorage.setItem('access_token', data.token);
            window.location.href = 'index.html';
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
    } catch (err) {
        console.error(err);
    }
});