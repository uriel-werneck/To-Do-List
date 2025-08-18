document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // stop the default form submission

    const username = document.getElementById('username-input').value.trim();
    const password = document.getElementById('pwd-input').value;
    const repeatedPassword = document.getElementById('repeat-pwd-input').value;
    const messageContainer = document.getElementById('message-container');
    const registerButton = document.getElementById('register-btn');

    // Helper function to show and hide messages
    const showMessage = (message, type) => {
        messageContainer.textContent = message;
        messageContainer.classList.add('active', type);
        setTimeout(() => {
            messageContainer.classList.remove('active');
        }, 5000); // Message fades out after 5 seconds
    };

    // Clear previous messages and disable the button
    messageContainer.textContent = '';
    messageContainer.className = 'message-container';
    registerButton.disabled = true;
    registerButton.textContent = 'Registering...';

    // Check for empty fields
    if (!username || !password || !repeatedPassword) {
        showMessage('All fields are required.', 'error');
        registerButton.disabled = false;
        registerButton.textContent = 'Register';
        return;
    }

    // Check if passwords match
    if (password !== repeatedPassword) {
        showMessage('Passwords must match.', 'error');
        registerButton.disabled = false;
        registerButton.textContent = 'Register';
        return;
    }

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

        const data = await response.json();

        if (response.ok) {
                window.location.href = 'login.html';
        } else {
            // Display error message from the API
            const errorMessage = data.message || 'An unexpected error occurred. Please try again.';
            showMessage(errorMessage, 'error');
        }
    } catch (err) {
        console.error(err);
        showMessage('Could not connect to the server. Please check your internet connection.', 'error');
    } finally {
        // Re-enable the button and reset its text
        registerButton.disabled = false;
        registerButton.textContent = 'Register';
    }
});