/* 
Use <div> or alert() to show errors
Disable buttons, show spinners, or change button text during an ongoing request
to prevent multiple clicks and inform the user.
*/

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // prevent form from submitting the default way

    const username = document.getElementById('login-input').value.trim();
    const password = document.getElementById('pwd-input').value;
    
    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('access_token', data.token);
            window.location.href = 'index.html';
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (err) {
        console.error(err);
    }
});
