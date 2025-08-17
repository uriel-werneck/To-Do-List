/* Use <div> or alert() to show errors
Disable buttons, show spinners, or change button text during an ongoing request
to prevent multiple clicks and inform the user.
*/

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // prevent form from submitting the default way

    const username = document.getElementById('login-input').value.trim();
    const password = document.getElementById('pwd-input').value;
    const messageContainer = document.getElementById('message-container');
    const loginButton = document.getElementById('login-btn');

    // Clear and hide any previous messages
    messageContainer.textContent = '';
    messageContainer.className = 'message-container';

    // Disable the button and change text to indicate a pending action
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';

    // if username or password is empty, show an error message
    if (!username || !password) {
        messageContainer.textContent = 'Username and password cannot be empty.';
        messageContainer.classList.add('active', 'error');
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
        return;
    }
    
    try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login successful
            localStorage.setItem('access_token', data.token);
            // Optional: show a success message before redirecting
            messageContainer.textContent = 'Login successful!';
            messageContainer.classList.add('active', 'success');
            
            // Wait a bit before redirecting for better user experience
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);

        } else {
            // Login failed, display the specific error message from the server
            // The `data.message` is an assumption of how your API responds
            const errorMessage = data.message || 'An unexpected error occurred. Please try again.';
            messageContainer.textContent = errorMessage;
            messageContainer.classList.add('active', 'error');
        }
    } catch (err) {
        console.error('Network or server error:', err);
        messageContainer.textContent = 'Could not connect to the server. Please check your internet connection.';
        messageContainer.classList.add('active', 'error');
    } finally {
        // Re-enable the button and reset its text
        loginButton.disabled = false;
        loginButton.textContent = 'Login';
    }
});