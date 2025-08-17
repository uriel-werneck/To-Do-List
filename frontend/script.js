// Helper function to show and hide messages (reusable for all event listeners)
const showMessage = (message, type) => {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = message;
    messageContainer.classList.add('active', type);
    setTimeout(() => {
        messageContainer.classList.remove('active');
    }, 5000); // Message fades out after 5 seconds
};

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        // You can add a message here before redirecting, but it will be very quick
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/api/tasks", {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // If token is invalid, log out and redirect
                localStorage.removeItem('access_token');
                window.location.href = 'login.html';
                return;
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const tasks = await response.json();
        const list = document.getElementById('task-list');
        list.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.classList.add("task-item");
            if (task.completed) li.classList.add("completed");

            // Task description
            const span = document.createElement("span");
            span.textContent = task.description;
            span.classList.add("task-text");
            li.appendChild(span);

            // Checkbox
            const check = document.createElement('input');
            check.type = 'checkbox';
            check.classList.add("task-checkbox");
            check.checked = task.completed;
            li.appendChild(check);

            check.addEventListener('click', async () => {
                li.classList.toggle('completed', check.checked);
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/tasks/${task.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ completed: check.checked })
                    });
                    if (!response.ok) {
                        li.classList.toggle('completed', !check.checked); // Revert UI on failure
                        showMessage('Failed to update task status.', 'error');
                    }
                } catch (err) {
                    li.classList.toggle('completed', !check.checked); // Revert UI on failure
                    console.error(err);
                    showMessage('Network error. Failed to update task.', 'error');
                }
            });

            // Delete button
            const btn = document.createElement('button');
            btn.textContent = "✖";
            btn.classList.add("delete-btn");
            li.appendChild(btn);

            btn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/tasks/${task.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete task.');
                    }
                    li.remove();
                    showMessage('Task deleted successfully!', 'success');
                } catch (err) {
                    console.error(err);
                    showMessage('Failed to delete task.', 'error');
                }
            });

            list.appendChild(li);
        });
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        showMessage('Failed to load tasks. Please try logging in again.', 'error');
    }
});

document.getElementById('logout-link').addEventListener('click', () => {
    const token = localStorage.getItem('access_token');
    if (token) {
        localStorage.removeItem('access_token');
        window.location.href = 'login.html';
    }
});

document.getElementById('add-task').addEventListener('click', async () => {
    const input = document.getElementById('task-input');
    const description = input.value.trim();
    const addButton = document.getElementById('add-task');

    // Add a check for an empty task description
    if (description === '') {
        showMessage('Please enter a task description.', 'error');
        return;
    }

    addButton.disabled = true;
    const originalText = addButton.textContent;
    addButton.textContent = 'Adding...';

    const token = localStorage.getItem('access_token');
    if (!token) {
        showMessage('Please log in to add tasks.', 'error');
        addButton.disabled = false;
        addButton.textContent = originalText;
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:5000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ description })
        });
        
        if (response.ok) {
            const newTask = await response.json();
            // Assuming your server returns the new task, you can add it to the list
            const list = document.getElementById('task-list');
            const li = document.createElement("li");
            li.classList.add("task-item");
            const span = document.createElement("span");
            span.textContent = newTask.description;
            span.classList.add("task-text");
            li.appendChild(span);
            // Re-create the checkbox and delete button with event listeners
            // (You can refactor this into a function to avoid repeating code)
            list.appendChild(li);
            input.value = ""; // Clear input after adding
            showMessage('Task added successfully!', 'success');
        } else {
            const data = await response.json();
            const errorMessage = data.message || 'Failed to create a task';
            showMessage(errorMessage, 'error');
        }
    } catch (err) {
        console.error(err);
        showMessage('Could not connect to the server.', 'error');
    } finally {
        addButton.disabled = false;
        addButton.textContent = originalText;
    }
});