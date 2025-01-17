// Переменная-счётчик для уникальных ID карточек
let taskIdCounter = 4;

// Глобальная переменная для хранения ID перетаскиваемой карточки
let draggedTaskId = null;

//подсчет колонок
let columnCounter = 4;

// Функция для начала перетаскивания карточки
function drag(event) {
    draggedTaskId = event.target.id; // Сохраняем id перетаскиваемой карточки
    event.dataTransfer.effectAllowed = 'move'; // Разрешаем перемещение
    event.target.classList.add('dragging'); //анимация перемещения
}

// Функция для разрешения сброса карточки (по умолчанию сброс запрещён)
function allowDrop(event) {
    event.preventDefault(); // Отменяем стандартное поведение, чтобы разрешить сброс
	event.currentTarget.classList.add('drag-over'); // Добавляем выделение при перетаскивании
}

// Функция для сброса карточки в новую колонку
function drop(event, columnId) {
    event.preventDefault(); // Отменяем стандартное поведение
	event.currentTarget.classList.remove('drag-over'); // Убираем выделение при сбросе
    event.target.classList.remove('dragging'); //анимация перемещения
    
    // Получаем перетаскиваемую карточку и колонку, куда её сбрасывают
    const draggedTask = document.getElementById(draggedTaskId);
    const dropColumn = document.getElementById(columnId);

    // Находим кнопку "Добавить задачу" и вставляем карточку перед ней
    const addButton = dropColumn.querySelector('.add-card');
    dropColumn.insertBefore(draggedTask, addButton);
    
    // Сбрасываем ID перетаскиваемой карточки
    draggedTaskId = null;
}

// Функция для добавления новой карточки в соответствующую колонку
function addCard(columnId) {
    // Найдем колонку по ID
    const column = document.getElementById(columnId);
	
	 // Уникальный ID для новой карточки
    const taskId = `task-${taskIdCounter++}`;
	
    // Создаем новую карточку задачи
    const newCard = document.createElement('div');
    newCard.classList.add('task-card');
	
    // Добавляем содержимое новой карточки и ее атрибуты
	newCard.setAttribute('id', taskId);
    newCard.setAttribute('draggable', 'true');
    newCard.setAttribute('ondragstart', 'drag(event)');
    
    newCard.innerHTML = `
        <div class="task-header">
			<div class="task-label" onclick="editTask(this)">Новая задача</div>
				<button class="del-card" onclick="deleteCard('`+ taskId + `')">Х</button>
			</div>
			<div class="subtasks">
				<!-- Сюда будут добавляться подзадачи -->
			</div>
			<div class="task-details">
				<span>Выполнено: <span class="completed-tasks">0</span>/<span class="total-tasks">0</span></span>
				<span>Дедлайн: <span onclick="editDate(this)">dd.mm</span></span>
			</div>
		<button class="add-btn" onclick="addSubtask(this)">+</button>
    `;

    // Находим кнопку "Добавить задачу" и вставляем карточку перед ней
    const addButton = column.querySelector('.add-card');
    column.insertBefore(newCard, addButton);
}

// Функция для редактирования карточки
function editTask(taskLabel) {
    // Сохраняем текущий текст карточки
    const currentText = taskLabel.innerText;

    // Создаем текстовое поле для редактирования
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.classList.add('edit-input');
    taskLabel.replaceWith(input); // Заменяем текст на поле ввода

    // Слушаем событие потери фокуса (выхода из редактирования)
    input.addEventListener('blur', function () {
        
    });

    // Также слушаем нажатие клавиши Enter для завершения редактирования
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const newText = input.value;

			// Создаем новый элемент с обновленным текстом карточки
			const updatedTaskLabel = document.createElement('div');
			updatedTaskLabel.classList.add('task-label');
			updatedTaskLabel.innerText = newText;
			updatedTaskLabel.setAttribute('onclick', 'editTask(this)'); // Добавляем возможность редактировать снова

			input.replaceWith(updatedTaskLabel); // Заменяем поле ввода на новый текст
        }
    });

    // Автоматически устанавливаем фокус на текстовое поле
    input.focus();
}

// Функция для редактирования деталей карточки (в одном поле)
function editDate(taskDetails) {
    const currentDetails = taskDetails.innerText; // Получаем текущие детали как текст

    // Создаем текстовое поле для редактирования всех деталей
    const textarea = document.createElement('input');
	textarea.type = 'date';
    textarea.value = currentDetails;
    textarea.classList.add('edit-textarea');

    // Заменяем текущие детали на текстовое поле
    taskDetails.innerHTML = '';
    taskDetails.appendChild(textarea);

// Завершаем редактирование при потере фокуса или нажатии Enter
function finishEditing() {
	// Пишем новое значение поля
        const rawDetales = textarea.value;
		const dd = rawDetales[8] + rawDetales[9];
		const mm = rawDetales[5] + rawDetales[6];
		const yy = rawDetales[2] + rawDetales[3];
		const newDetails = dd + "." + mm + "." + yy;

        // Создаем элемент с обновленными деталями
        const updatedDetails = document.createElement('span');
		updatedDetails.fontcolor = "#ad6b6b";
        updatedDetails.innerText = newDetails;
        taskDetails.innerHTML = '';
        taskDetails.appendChild(updatedDetails);

        // Возвращаем событие клика для редактирования
        taskDetails.setAttribute('onclick', 'editDate(this)');
    }

    // При потере фокуса или нажатии Enter сохраняем изменения
    textarea.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            finishEditing(); // Завершаем редактирование
        }
    });

    textarea.focus(); // Автоматически фокусируемся на текстовом поле
}

//Функция удаления карточки
function deleteCard(CardId){
	const element = document.getElementById(CardId);
	element.remove();
}

//функция добавления подзадачи
function addSubtask(taskCardElement) {
    const subtasksContainer = taskCardElement.parentNode.querySelector('.subtasks');
	const subtaskId = `subtask-${taskIdCounter++}`;
    const subtask = document.createElement('div');
	subtask.setAttribute('id', subtaskId);
    subtask.classList.add('subtask');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', updateTaskCompletion);
    checkbox.classList.add('checkbox');
    
    const label = document.createElement('input');
    label.type = 'text';
    label.value = 'Новая подзадача';
    label.classList.add('edit-input');
	
	const cross = document.createElement('button');
	cross.textContent = "X";
	cross.classList.add('cross');
	cross.addEventListener('click', () => removeCross(subtaskId));
    
    subtask.appendChild(checkbox);
    subtask.appendChild(label);
	subtask.appendChild(cross);
    subtasksContainer.appendChild(subtask);
    
    updateTaskCompletion();
}

//Функция удаления подзадачи
function removeCross(subtaskId){
	const element = document.getElementById(subtaskId);
	element.remove();
}

//подсчет выполненых подзадач
function updateTaskCompletion() {
    const taskCards = document.querySelectorAll('.task-card');
    taskCards.forEach(card => {
        const subtasks = card.querySelectorAll('.subtask input[type="checkbox"]');
        const completedSubtasks = Array.from(subtasks).filter(checkbox => checkbox.checked).length;
        
        card.querySelector('.completed-tasks').textContent = completedSubtasks;
        card.querySelector('.total-tasks').textContent = subtasks.length;
    });
}