document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.log("No token found, Please log in");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/api/tasks", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const tasks = await response.json();

        const list = document.getElementById('task-list');
        list.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.textContent = task.description;
            list.appendChild(li);

            const check = document.createElement('input');
            check.type = 'checkbox'
            check.checked = task.completed
            li.appendChild(check);

            if (check.checked) {
                li.classList.add('completed');
            }
            
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
                } catch (err) {
                    console.error(err);
                }
            });

            const btn = document.createElement('button');
            btn.textContent = "X";
            li.appendChild(btn);
            btn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:5000/api/tasks/${task.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to delete task.');
                    }
                    li.remove()
                } catch (err) {
                    console.error(err);
                }
            });
        });
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
    }
});

document.getElementById('add-task').addEventListener('click', async () => {
    const input = document.getElementById('task-input');
    const description = input.value.trim();
    if (description === '') return

    const token = localStorage.getItem('access_token');
    if (!token) {
        console.log('Please log in to add tasks');
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

        if (!response.ok) {
            throw new Error('Failed to create a task');
        }
    } catch (err) {
        console.error(err);
    }
});