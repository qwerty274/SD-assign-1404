// Find the task form so JavaScript can respond when it is submitted.
const form = document.getElementById('todo-form');

// Find the input where the user types a task name.
const input = document.getElementById('todo-input');

// Find the list where task rows will be displayed.
const list = document.getElementById('todo-list');

// Find the date input used for each task's due date.
const dateInput = document.getElementById('todo-date');

// Find the dropdown used to choose a task priority.
const priorityInput = document.getElementById('todo-priority');

// Find the container holding the task filter buttons.
const filters = document.getElementById('filters');

const priorityChartCanvas = document.getElementById('priority-chart');
const weeklyChartCanvas = document.getElementById('weekly-chart');
const previousMonthButton = document.getElementById('previous-month');
const nextMonthButton = document.getElementById('next-month');


// Load saved tasks from this browser, or use an empty list on the first visit.
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let priorityChart; // Variable to hold the priority chart instance
let weeklyChart; // Variable to hold the weekly chart instance
let chartMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Month currently shown in the weekly chart.

// Save the current task list in browser storage.
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Draw tasks that match the selected filter.
function showTasks(filter = 'all') {
  // Clear the old rows before drawing the current ones.
  list.innerHTML = '';

  // Keep all tasks or only active or completed tasks, depending on the filter.
  const visibleTasks = tasks.filter(function(task) {
    if (filter === 'active') return !task.completed;
    if (filter === 'overdue-task') return isOverdue(task);
    if (filter === 'done') return task.completed;
    return true;
  });

  // Group all tasks by due month when the All filter is selected.
  const tasksToRender = filter === 'all'
    ? groupTasksByMonth(visibleTasks)
    : [{ monthLabel: '', tasks: visibleTasks }];

  // Create a section for each month and draw its tasks.
  tasksToRender.forEach(function(group) {
    if (group.monthLabel) {
      const monthHeading = document.createElement('li');
      monthHeading.className = 'month-heading';
      monthHeading.textContent = `${group.monthLabel} (${group.tasks.length})`;
      list.appendChild(monthHeading);
    }

    group.tasks.forEach(function(task) {
    // Create the task row and its child elements.
    const listItem = document.createElement('li');
    const taskText = document.createElement('span');
    const priorityDot = document.createElement('span');
    const taskDetails = document.createElement('span');

    // Add the completed class so CSS can style finished tasks.
    listItem.classList.toggle('is-complete', task.completed);

    // Give the priority dot a class based on the task priority.
    priorityDot.className = `status-dot priority-${String(task.priority || 'medium').toLowerCase()}`;

    // Add accessible text and a hover label to the priority dot.
    priorityDot.setAttribute('aria-label', `${task.priority || 'Medium'} priority`);
    priorityDot.title = `${task.priority || 'Medium'} priority`;

    // Assign styling classes to the task text containers.
    taskDetails.className = 'task-details';
    taskText.className = 'task-title';

    // Show the task name and due date as plain text.
    taskText.textContent = `${task.text} | Due: ${task.dueDate || 'No date'}`;

    // Show a red badge when an unfinished task's due date has passed.
    if (isOverdue(task)) {
      const overdueBadge = document.createElement('span');
      overdueBadge.className = 'overdue-badge';
      overdueBadge.textContent = 'Overdue';
      taskDetails.appendChild(overdueBadge);
    }

    // Tell the user that double-clicking the task name starts editing.
    taskText.title = 'Double-click to edit this task';

    // Replace the task name with an input when it is double-clicked.
    taskText.addEventListener('dblclick', function() {
      // Create and configure an input for editing the task name.
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = task.text;
      editInput.className = 'edit-input';

      // Put the edit input in place of the task text.
      taskDetails.replaceChild(editInput, taskText);

      // Focus the edit box and select its current text.
      editInput.focus();
      editInput.select();

      // Save the new task name and redraw the task list.
      function saveEdit() {
        const newText = editInput.value.trim();

        if (newText !== '') {
          task.text = newText;
          saveTasks();
        }

        showTasks(filter);
      }

      // Save on Enter and cancel on Escape.
      editInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          saveEdit();
        }

        if (event.key === 'Escape') {
          editInput.removeEventListener('blur', saveEdit);
          showTasks(filter);
        }
      });

      // Save the edit if the input loses focus.
      editInput.addEventListener('blur', saveEdit);
    });

    // Put the task name inside its details container.
    taskDetails.appendChild(taskText);

    // Add a green completion dot to completed tasks.
    if (task.completed) {
      const doneDot = document.createElement('span');
      doneDot.className = 'status-dot done-dot';
      doneDot.setAttribute('aria-label', 'Completed');
      doneDot.title = 'Completed';
      listItem.appendChild(doneDot);
    }

    // Create a button that toggles the task's completion state.
    const doneButton = document.createElement('button');
    doneButton.textContent = task.completed ? 'Mark as active' : 'Mark as done';
    doneButton.className = 'done-button';

   doneButton.addEventListener('click', function() {
  task.completed = !task.completed;

  if (task.completed) {
    task.completedAt = new Date().toISOString();
  } else {
    task.completedAt = null;
  }

  saveTasks();
  showTasks(filter);
});

    // Add the priority marker, task details, and completion button to the row.
    listItem.appendChild(priorityDot);
    listItem.appendChild(taskDetails);
    listItem.appendChild(doneButton);

    // Add the finished row to the page.
      list.appendChild(listItem);
    });
  });

  // Refresh both charts whenever the task list is redrawn.
  drawPriorityChart();
  drawWeeklyChart();
}

// Organize tasks by due month and year, with undated tasks in their own group.
function groupTasksByMonth(taskList) {
  const groups = new Map();

  taskList.forEach(function(task) {
    const taskDate = task.dueDate ? new Date(`${task.dueDate}T12:00:00`) : null;
    const monthLabel = taskDate
      ? taskDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
      : 'No due date';
    const sortKey = task.dueDate ? task.dueDate.slice(0, 7) : '9999-99';

    if (!groups.has(sortKey)) {
      groups.set(sortKey, { monthLabel: monthLabel, tasks: [] });
    }

    groups.get(sortKey).tasks.push(task);
  });

  return Array.from(groups.entries())
    .sort(function(first, second) {
      return first[0].localeCompare(second[0]);
    })
    .map(function(entry) {
      return entry[1];
    });
}

// Add a task when the user submits the form.
form.addEventListener('submit', function(event) {
  // Keep the browser from reloading the page.
  event.preventDefault();

  // Read the task name and remove extra surrounding spaces.
  const taskText = input.value.trim();

  // Do not add a task with an empty name.
  if (taskText === '') {
    return;
  }

  // Build an object containing all details for this task.
  const task = {
    text: taskText,
    dueDate: dateInput.value || getTodayDate(),
    priority: priorityInput.value,
    completed: false,
    completedAt: null
  };

  // Add the task, save it, and refresh the displayed list.
  tasks.push(task);
  saveTasks();
  showTasks();

  // Clear the task name field for the next entry.
  input.value = '';
});

// Show the selected task filter when a filter button is clicked.
filters.addEventListener('click', function(event) {
  // Ignore clicks that did not come from a filter button.
  if (event.target.tagName !== 'BUTTON') {
    return;
  }

  // Redraw the list using the clicked button's filter value.
  showTasks(event.target.dataset.filter);
});
function getTodayDate() {
    const today = new Date();
    const year= new Date().getFullYear();
    const month= String(today.getMonth() + 1).padStart(2, '0');
    const day= String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Check that a task has a past due date and is not already completed.
function isOverdue(task) {
  return Boolean(task.dueDate && task.dueDate < getTodayDate() && !task.completed);
}
// Draw saved tasks when the page first loads.

function drawWeeklyChart() {
    if (weeklyChart) {
  weeklyChart.destroy();
}
  const year = chartMonth.getFullYear();
  const month = chartMonth.getMonth();
  const monthName = chartMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const currentMonth = new Date();
  nextMonthButton.disabled = year === currentMonth.getFullYear() && month === currentMonth.getMonth();
  const weeks = [0, 0, 0, 0, 0];

  tasks.forEach(task => {
    if (!task.completed || !task.completedAt) return;

    const completedDate = new Date(task.completedAt);

    if (
      completedDate.getFullYear() === year &&
      completedDate.getMonth() === month
    ) {
      const weekIndex = Math.floor((completedDate.getDate() - 1) / 7);
      weeks[weekIndex]++;
    }
  });

 weeklyChart = new Chart(weeklyChartCanvas, {
    type: 'bar',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
      datasets: [{
        label: `Tasks completed - ${monthName}`,
        data: weeks,
        backgroundColor: '#9b8cff'
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

// Move the weekly chart back one month when the previous arrow is clicked.
previousMonthButton.addEventListener('click', function() {
  chartMonth.setMonth(chartMonth.getMonth() - 1);
  drawWeeklyChart();
});

// Move the weekly chart forward one month, but never past the current month.
nextMonthButton.addEventListener('click', function() {
  const currentMonth = new Date();
  if (chartMonth.getFullYear() === currentMonth.getFullYear() && chartMonth.getMonth() === currentMonth.getMonth()) return;
  chartMonth.setMonth(chartMonth.getMonth() + 1);
  drawWeeklyChart();
});
function drawPriorityChart() {
    if (priorityChart) {
  priorityChart.destroy();
}
  const high = tasks.filter(task => task.priority === 'high').length;
  const medium = tasks.filter(task => task.priority === 'medium').length;
  const low = tasks.filter(task => task.priority === 'low').length;

priorityChart = new Chart(priorityChartCanvas, {
    type: 'pie',
    data: {
      labels: ['High', 'Medium', 'Low'],
      datasets: [{
        data: [high, medium, low],
        backgroundColor: ['#ff4d5e', '#ffd447', '#ff963d']
      }]
    }

  });
  
}  
showTasks();
drawPriorityChart();
drawWeeklyChart();
