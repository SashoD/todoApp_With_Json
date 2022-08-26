const dom = {
    'todos': document.querySelector('ul.todo-list-items'),
    'addTodoInput': document.querySelector('.todo-add>input'),
    'addTodoBtn': document.querySelector('.todo-add>.todo-add-btn'),
    'totalItemsCount': document.querySelector('.todo-app .todos-total>.output')
}

const baseUrl = 'http://localhost:3000';

const displayTodoItemsCount = function displayTodoItemsCount(todos) {
    let count = todos.length || 0;
    dom.totalItemsCount.innerHTML = count;
}

let todos = [];

const renderTodos = function renderTodos(todos) {
    dom.todos.innerHTML = '';
    todos.forEach(todo => {
        dom.todos.innerHTML += `
		<li data-id=${todo.id} class="${todo.completed ? 'completed' : ''}">
			<span class="todoID">${todo.id}.</span>
			<span>${todo.title}</span>
			<div class="todo-remove"><i class="far fa-trash-alt"></i></div>
			<div class="todo-togle-complete"><i class="far ${todo.completed ? 'fa-check-square' : 'fa-square'}"></i></div>
		</li>
		`;
    })

    dom.addTodoInput.value = '';

    dom.addTodoInput.focus();

    displayTodoItemsCount(todos);
}

function fetchTodos(url) {
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        })
        .then(data => {
            todos = data;
            renderTodos(todos)
        })
};

function addTodo(url, title) {
    const newTodo = {
        "title": title,
        "completed": false
    };
    fetch(url, {
        method: 'post',
        body: JSON.stringify(newTodo),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            todos.push(data);
            renderTodos(todos)
        })
};

const removeTodo = function removeTodo(url, todoID) {

    todos = todos.filter(todo => todo.id !== todoID)

    // fetch(url, {
    //     method: 'DELETE',
    //     body: JSON.stringify(todos),
    //     headers: {
    //         "Content-Type": "application/json"
    //     }

    // })
    //     .then(response => response.json())
    //     .then(data => {
    //     })
    renderTodos(todos)
};

const toggleComplete = function toggleComplete(todoID) {
    let todo = todos.filter(todo => todo.id === todoID)[0];
    todo.completed = !todo.completed;
    renderTodos(todos)
};

fetchTodos(baseUrl + '/todos');

dom.addTodoBtn.addEventListener('click', function (e) {
    const todoTitle = dom.addTodoInput.value;
    addTodo(baseUrl + '/todos', todoTitle)
});

window.addEventListener('DOMContentLoaded', function (e) {
    renderTodos(todos)
});

dom.addTodoInput.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        addTodo();
    }
});

dom.addTodoInput.addEventListener('click', function (e) {
    addTodo()
});

dom.todos.addEventListener('click', function todoItemsClickHandler(e) {
    const li = e.target.parentElement.parentElement;
    const id = li.dataset.id * 1;

    if (e.target.classList.contains('fa-trash-alt')) {
        removeTodo(id)
    } else if (e.target.classList.contains('fa-check-square') || e.target.classList.contains('fa-square')) {
        toggleComplete(id)
    }
})