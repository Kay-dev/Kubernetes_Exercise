const apiUrl = '/api';  // This will route through your ingress

async function fetchTodos() {
    try {
        const response = await fetch(apiUrl);
        const todos = await response.json(); 
        if (response.ok && todos.length > 0) {
            todos.forEach(todo => {
                insertTodo(todo);
            });
        } 
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
        insertTodo(todo);
    } catch (error) {
        console.error('Error creating todo:', error);
    }
}

function insertTodo(todo) {
    const ul = document.getElementById('todos');
    const li = document.createElement('li');
    li.setAttribute('data-id', todo.id);
    const todoText = document.createElement('span');    
    todoText.textContent = todo.data;
    li.appendChild(todoText);

    const doneButton = document.createElement('button');
    doneButton.textContent = 'x';
    doneButton.addEventListener('click', () => {
        deleteTodo(todo.id);
    });
    li.appendChild(doneButton);
    
    if (todo.done) {
        li.classList.add('done');
    }
    ul.appendChild(li);
}

async function deleteTodo(id) {
    try {
        const response = await fetch(`${apiUrl}/todos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const li = document.querySelector(`li[data-id="${id}"]`);
            li.remove();
        } else {
            console.error('Error deleting todo:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

async function toggleDone(id) {
    try {
        const response = await fetch(`${apiUrl}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (response.ok) {
            const li = document.querySelector(`li[data-id="${id}"]`);
            li.classList.toggle('done');
        } else {
            console.error('Error toggling done status:', response.statusText);
        }
    } catch (error) {
        console.error('Error toggling done status:', error);
    }
}

// add event listeners for li click : toggleDone
const ul = document.getElementById('todos');
ul.addEventListener('click', (event) => {
    if (event.target && event.target.tagName === 'SPAN') {
        console.log(event.target.parentElement.getAttribute('data-id'));
        toggleDone(event.target.parentElement.getAttribute('data-id'));
    }
});

document.getElementById('button').addEventListener('click', createTodo);
fetchTodos();