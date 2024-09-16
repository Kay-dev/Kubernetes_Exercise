const apiUrl = '/api';  // This will route through your ingress

async function fetchTodos() {
    try {
        const response = await fetch(apiUrl);
        const todos = await response.json(); 
        const ul = document.getElementById('todos');
        ul.innerHTML = '';

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo.data;
            ul.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

async function createTodo() {
    const input = document.getElementById('input');
    const text = input.value;
    input.value = '';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'data': text })
        });
        const todo = await response.json();
        const ul = document.getElementById('todos');
        const li = document.createElement('li');
        li.textContent = todo.data;
        ul.appendChild(li);
    } catch (error) {
        console.error('Error creating todo:', error);
    }
}

document.getElementById('button').addEventListener('click', createTodo);
fetchTodos();