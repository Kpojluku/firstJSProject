/**
 * Форма для записи список дел
 * Есть возможность омечать как выполненное
 * Добавление новой задачи также возможно с кнопки Enter
 * Счетчик всех и выполненных задач
 * Присутсвуют все CRUD операции
 */

const TASK_KEY = "newTaskArr";

const inputForm = document.getElementById('inputForm');
const btnAdd = document.querySelector('.plus');
const elementToReplace = document.getElementById('defaultTaskContent');
const newElement = document.createElement('div');
newElement.id = 'newTask';
newElement.classList.add('tasks-content');

refreshList();

btnAdd.addEventListener('click', addNewTask);
document.addEventListener('keydown', (event) => {
    if (event.code === 'Enter') {
        addNewTask();
    }
});

function addNewTask() {
    const textContent = inputForm.value;
    if (textContent !== null && !(textContent.trim() === "")) {
        replaceDiv();
        saveNewTaskData(textContent);
        refreshList();
    }
}

function saveNewTaskData(data) {
    const spanTeg = `<span class="span">${data}</span>`;
    let taskArray = [spanTeg];
    const taskArrayJson = localStorage.getItem(TASK_KEY);
    if (taskArrayJson !== null) {
        taskArray = JSON.parse(taskArrayJson);
        taskArray.push(spanTeg);
    }
    localStorage.setItem(TASK_KEY, JSON.stringify(taskArray));
}

function replaceDiv() {
    if (elementToReplace !== null && elementToReplace.parentNode !== null) {
        elementToReplace.parentNode.replaceChild(newElement, elementToReplace);
    }
}

function addNewRowTask(span) {
    newElement.innerHTML += `<div class="new-task-row">${span}<button class="delete">Delete</button></div>`;
}

function refreshList() {
    newElement.innerHTML = "";
    const taskArrayJson = localStorage.getItem(TASK_KEY);
    if (taskArrayJson !== null) {
        replaceDiv();
        const taskArray = JSON.parse(taskArrayJson);
        for (const data of taskArray) {
            addNewRowTask(data);
        }
    }
    statisticCount();
    addListeners();
}

function statisticCount() {
    const spans = document.querySelectorAll('.span');
    const taskCountElement = document.getElementById('taskCount');
    const taskCompletedElement = document.getElementById('taskCompleted');
    const taskCount = spans.length;
    const taskCompleted = Array.from(spans).filter(f => f.hasAttribute('style')).length;
    taskCountElement.innerHTML = taskCount;
    taskCompletedElement.innerHTML = taskCompleted;
}

function addListeners() {
    let spans = document.querySelectorAll('.span');
    let deleteButtons = document.querySelectorAll('.delete');
    console.log(deleteButtons);
    spans.forEach((span, index) => {
        span.addEventListener('dblclick', () => {
            if (span.hasAttribute('style')) {
                span.removeAttribute('style');
            } else {
                span.setAttribute("style", "text-decoration: line-through");
            }
            const taskArrayJson = localStorage.getItem(TASK_KEY);
            const taskArray = JSON.parse(taskArrayJson);
            taskArray[index] = span.outerHTML;
            localStorage.setItem(TASK_KEY, JSON.stringify(taskArray));
            statisticCount();
        });
    });

    deleteButtons.forEach((deleteBtn, index) => {
        deleteBtn.addEventListener('click', () => {
            const taskArrayJson = localStorage.getItem(TASK_KEY);
            const taskArray = JSON.parse(taskArrayJson);
            taskArray.splice(index, 1);
            localStorage.setItem(TASK_KEY, JSON.stringify(taskArray));
            refreshList();
        });
    });
}
