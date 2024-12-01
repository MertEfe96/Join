let currentDraggedElement;

/**
 * This function opens add-contact-form
 */

function addTask(status = "to-do", editTask = false, key = "") {
  const addTaskMain = document.getElementById("addTaskMain");
  const addTask = document.getElementById("addTask");
  addTaskMain.style.display = "flex";
  setTimeout(() => addTaskMain.classList.add("show"), 10);
  setTimeout(() => addTask.classList.add("show"), 10);

  if (editTask === true) {
    addTask.innerHTML = templateAddTask(status, key);
    const elements = addTask.querySelectorAll(
      ".overlaySaveButton, .overlayDeleteButton"
    );
    elements.forEach((element) => {
      element.style.display = "none";
    });
    const elem = addTask.querySelector(".overlayEditButton");
    elem.style.display = "flex";
  } else {
    addTask.innerHTML = templateAddTask(status);
  }
  pullContactsToAssign();
  setMinDate();
}

/**
 * This function opens large view of Task
 */
function taskCardLarge(key) {
  const taskCardLargeMain = document.getElementById("taskCardLargeMain");
  const taskCardLarge = document.getElementById("taskCardLarge");
  taskCardLargeMain.style.display = "flex";
  setTimeout(() => taskCardLargeMain.classList.add("show"), 10);
  setTimeout(() => taskCardLarge.classList.add("show"), 10);
  taskCardLarge.innerHTML = `${templateTaskCardLarge(key)}`;
  const elements = taskCardLarge.querySelectorAll(".subtasksSmall");
  elements.forEach((element) => {
    element.style.display = "none";
  });
  const elem = taskCardLarge.querySelectorAll(
    ".subtasksLarge, .dueDateCardLarge, .hideSmallView"
  );
  elem.forEach((element) => {
    element.style.display = "flex";
  });

  const assignedToClass = taskCardLarge.querySelectorAll(
    ".assignedToContainer"
  );
  assignedToClass.forEach((element) => {
    element.classList.add("assignedToContainerLarge");
    element.classList.remove("assignedToContainer");
  });
  renderSubtasksLargeView(key);
  let taskDiv = document.getElementById(`singleTaskCard${key}`);
  let priority = taskDiv.querySelector(`#priorityCard${key}`).innerHTML;
  renderPrioWord(priority, key);
}

function getTaskData(key) {
  const taskDiv = document.getElementById(`singleTaskCard${key}`);
  return {
    category: taskDiv.querySelector(`#categoryCard${key}`).innerHTML,
    title: taskDiv.querySelector(`#titleCard${key}`).innerHTML,
    description: taskDiv.querySelector(`#descriptionCard${key}`).innerHTML,
    assignedTo: taskDiv.querySelector(`#assignedToCard${key}`).innerHTML,
    priority: taskDiv.querySelector(`#priorityCard${key}`).innerHTML,
    subtasks: taskDiv.querySelector(`#subtasksCard${key}`).innerHTML,
    dueDate: taskDiv.querySelector(`#dueDate${key}`).innerHTML,
    categoryClass:
      taskDiv.querySelector(`#categoryCard${key}`).innerHTML ===
      "Technical Task"
        ? "technicalTaskColor"
        : "userStoryColor",
  };
}

function addTaskNav() {
  const addTaskMain = document.getElementById("addTaskMain");
  const addTask = document.getElementById("addTask");
  addTask.innerHTML = templateAddTaskNav();
  renderUserIcon();
}

/**
 * This function closes add-contact-form
 */
function closeAddTask() {
  const addTaskMain = document.getElementById("addTaskMain");
  const addTask = document.getElementById("addTask");
  assignedContacts = [];
  addTask.classList.remove("show");
  setTimeout(() => {
    addTaskMain.classList.remove("show");
    setTimeout(() => {
      addTaskMain.style.display = "none";
    }, 100);
  }, 100);
}

/**
 * This function closes large view of Task
 */
function closetaskCardLarge() {
  const taskCardLargeMain = document.getElementById("taskCardLargeMain");
  const taskCardLarge = document.getElementById("taskCardLarge");
  taskCardLarge.classList.remove("show");
  setTimeout(() => {
    taskCardLargeMain.classList.remove("show");
    setTimeout(() => {
      taskCardLargeMain.style.display = "none";
    }, 100);
  }, 100);

  const elements = taskCardLarge.querySelectorAll(".subtasksSmall");
  elements.forEach((element) => {
    element.style.display = "flex";
  });
  const elem = taskCardLarge.querySelectorAll(
    ".subtasksLarge, .dueDateCardLarge, .hideSmallView"
  );
  elem.forEach((element) => {
    element.style.display = "none";
  });

  const assignedToClass = taskCardLarge.querySelectorAll(
    ".assignedToContainerLarge"
  );
  assignedToClass.forEach((element) => {
    element.classList.add("assignedToContainer");
    element.classList.remove("assignedToContainerLarge");
  });
}

/**
 * This function saves the tasks in the API
 *
 * @param {string} [status="to-do"] The status of the task (default is "to-do"). *
 */

async function saveTask(status = "to-do") {
  setDataForTask(status);
  pullTasks();
  closeAddTask();
}

/**
 * This function fetches the tasks saved in the API
 */
async function pullTasks() {
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  let tasks = data.tasks;
  if (tasks) {
    await renderGroupedTasks(tasks);
  }
  renderUserIcon();
}

/**
 * This function renders tasks and after sorting them according to their status
 *
 * @param {*} tasks this is the whole tasklist saved in the API,
 *                      given by the pullTasks() funtion
 */
async function renderGroupedTasks(tasks) {
  let taskListToDo = document.getElementById("ToDoCard");
  let taskListInProgress = document.getElementById("InProgressCard");
  let taskListAwaitFeedback = document.getElementById("AwaitFeedbackCard");
  let taskListDone = document.getElementById("DoneCard");
  taskListToDo.innerHTML = "";
  taskListInProgress.innerHTML = "";
  taskListAwaitFeedback.innerHTML = "";
  taskListDone.innerHTML = "";

  let renderPromises = Object.entries(tasks).map(async ([key, taskdetails]) => {
    let taskDiv = document.createElement("div");
    taskDiv.draggable = true;
    taskDiv.classList.add("singleTaskCard");
    taskDiv.id = `singleTaskCard${key}`;
    taskDiv.ondragstart = function (event) {
      startDragging(key);
    };
    taskDiv.addEventListener("click", (event) => {
      taskCardLarge(key);
    });
    let categoryClass =
      taskdetails.Category === "Technical Task"
        ? "technicalTaskColor"
        : "userStoryColor";
    sortTasks(
      key,
      taskdetails,
      categoryClass,
      taskDiv,
      taskListToDo,
      taskListInProgress,
      taskListAwaitFeedback,
      taskListDone
    );
    await loadAssignedContacts(key, taskdetails.AssignedTo, taskDiv);
    loadPrio(key, taskdetails.Priority, taskDiv);
    loadSubtasks(key, taskdetails.Subtasks, taskDiv);
  });

  await Promise.all(renderPromises);

  checkCardEmpty(
    taskListToDo,
    taskListInProgress,
    taskListAwaitFeedback,
    taskListDone
  );
}

/**
 * This function sorts tasks according to their status
 *
 * @param {*} key this is the created key of the task when saved in the API,
 *                      given by the pullTasks() funktion
 * @param {*} taskdetails this is the whole information of the task when saved in the API
 * @param {*} categoryClass this is the task category
 * @param {*} taskDiv this is the created taskDiv
 * @param {*} taskList these are all four taskLists (ToDo, InProgress, AwaitFeedback, Done)
 */
function sortTasks(
  key,
  taskdetails,
  categoryClass,
  taskDiv,
  taskListToDo,
  taskListInProgress,
  taskListAwaitFeedback,
  taskListDone
) {
  taskDiv.innerHTML = renderTaskCard(key, taskdetails, categoryClass);
  if (taskdetails.Status === "to-do") {
    taskListToDo.appendChild(taskDiv);
  } else if (taskdetails.Status === "in-progress") {
    taskListInProgress.appendChild(taskDiv);
  } else if (taskdetails.Status === "await-feedback") {
    taskListAwaitFeedback.appendChild(taskDiv);
  } else if (taskdetails.Status === "done") {
    taskListDone.appendChild(taskDiv);
  }
}

/**
 * This function returns the html structured TaskCards
 *
 * @param {*} key this the created key of the task when saved in the API,
 *                      given by the pullTasks() funktion
 * @param {*} taskdetails this is the whole information of the task when saved in the API
 * @param {*} categoryClass this is the task category
 */
function renderTaskCard(key, taskdetails, categoryClass) {
  return `
<div id="categoryCard${key}" class="categoryCard ${categoryClass}">${taskdetails.Category}</div>
<div id="titleCard${key}" class="titleCard">${taskdetails.Title}</div>
<div id="descriptionCard${key}" class="descriptionCard">${taskdetails.Description}</div>
<div class="dueDateCardLarge" id="dueDate${key}">${taskdetails.DueDate}</div>
<div id="subtasksCard${key}" class="subtasksCard"></div>
<div class="bottomCard">
  <div class="assignedToCard" id="assignedToCard${key}"></div>
  <div id="priorityCard${key}"></div>
</div>`;
}

/**
 * Loads and displays the assigned contacts for a specific task.
 * It fetches the contact data from the API and iterates over the `assignedTo` array.
 * For each contact, it checks if the contact exists in the fetched data and extracts the contact's name and color, generates the initials,
 * and appends the formatted contact information to the task card's assigned contacts container.
 *
 * @param {string} key - The unique identifier of the task, used to select the corresponding container.
 * @param {Array} assignedTo - An array of objects representing the assigned contacts, each containing an `id` and `initials`.
 * @param {HTMLElement} taskDiv - The DOM element of the task card where the contacts will be displayed.
 *
 */
async function loadAssignedContacts(key, assignedTo, taskDiv) {
  const assignedToContainer = taskDiv.querySelector(`#assignedToCard${key}`);
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  assignedToContainer.innerHTML = "";

  for (let index = 0; index < assignedTo.length; index++) {
    const element = assignedTo[index];
    const assignedId = element.id;

    if (data.contacts && data.contacts.hasOwnProperty(assignedId)) {
      let contactName = data.contacts[assignedId].name;
      let backgroundColor = data.contacts[assignedId].color || "#ccc";
      const initials = contactName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();

      assignedToContainer.innerHTML += `
            <div class="assignedToContainer">
      <div 
        class="contactInitialsBoard" 
        style="background-color: ${backgroundColor};">
        ${initials}
      </div>
      <div class="hideSmallView">${contactName}</div>
      </div>`;
    }
  }
}

/**
 * Loads and displays the priority icon for a specific task.
 *
 * @param {string} key - The unique identifier of the task, used to select the corresponding priority container.
 * @param {string} priority - The priority level of the task
 * @param {HTMLElement} taskDiv - The DOM element of the task card where the priority icon will be displayed.
 *
 */
function loadPrio(key, priority, taskDiv) {
  const prioContainer = taskDiv.querySelector(`#priorityCard${key}`);
  prioContainer.innerHTML = "";
  if (priority === "prioUrgent") {
    prioContainer.innerHTML = `<img src=./assets/icons/urgentColor.svg>`;
  } else if (priority === "prioMedium") {
    prioContainer.innerHTML = `<img src=./assets/icons/mediumColor.svg>`;
  } else if (priority === "prioLow") {
    prioContainer.innerHTML = `<img src=./assets/icons/lowColor.svg>`;
  }
}

/**
 * Loads and displays the subtasks for a specific task.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {Array} subtasks - An array of subtask objects.
 * @param {HTMLElement} taskDiv - The task card element where subtasks will be displayed.
 *
 */
async function loadSubtasks(key, subtasks, taskDiv) {
  const subtasksContainer = taskDiv.querySelector(`#subtasksCard${key}`);
  subtasksContainer.innerHTML = "";
  if (Array.isArray(subtasks) && subtasks.length > 0) {
    subtasksContainer.classList.remove("displayNone");
    subtasksContainer.innerHTML = `
        <div class="subtasksSmall">
    <div class="myProgress">
      <div class="myBar" id="myBar${key}"></div>
      </div>
      <div class="subtasksCount"><div class="doneSubtasksCount" id="doneSubtasksCount${key}"></div> <div> &nbsp;Subtasks</div></div>
    </div>
  `;
    const {doneCount, totalSubtasks} = await renderDoneSubtasksCount(key);
    move(key, doneCount, totalSubtasks);
  } else {
    subtasksContainer.classList.add("displayNone");
  }
}

/**
 * Updates the width of the progress bar based on completed subtasks.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {number} doneCount - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 *
 */
async function move(key, doneCount, totalSubtasks) {
  let doneSubtasksBar = document.getElementById(`myBar${key}`);
  console.log(totalSubtasks);
  console.log(doneCount);
  if (doneCount > 0) {
    let width = (100 / totalSubtasks) * doneCount;
    doneSubtasksBar.style.width = `${width}%`;
  } else {
    doneSubtasksBar.style.width = "0%";
  }
}

/**
 * Loads and displays the subtasks in the large view for a specific task.
 *
 * @param {string} key - The unique identifier of the task.
 *
 */
async function renderSubtasksLargeView(key) {
  let subTasksLarge = document.getElementById(`subtasksToClickLarge${key}`);
  subTasksLarge.innerHTML = "";
  let response = await fetch(`${BASE_URL}tasks/${key}/Subtasks.json`);
  let subtasks = await response.json();
  for (let index = 0; index < subtasks.length; index++) {
    const subtask = subtasks[index];
    const div = document.createElement(`subtask${key}-${index}`);
    div.classList.add("subtaskClickDiv");
    div.innerHTML = `
    <div id="subtaskClickButton${key}-${index}" class="subtaskClickButton" onclick="changeCheckbox('${key}', '${index}')"></div>
    <div class="singleSubtaskClick">${subtask.task}</div>
    `;
    subTasksLarge.appendChild(div);
    renderCheckButton(subtask, key, index);
  }
}

/**
 * Renders the check button image based on the subtask's completion status.
 *
 * @param {Object} subtask - The subtask object containing its properties.
 * @param {string} key - The unique identifier of the task.
 * @param {number} index - The index of the subtask within the task's subtasks array.
 */
function renderCheckButton(subtask, key, index) {
  let checkButton = document.getElementById(
    `subtaskClickButton${key}-${index}`
  );
  if (subtask.undone === true) {
    checkButton.innerHTML = `
    <img src=./assets/icons/uncheckedButton.png >
    `;
  } else {
    checkButton.innerHTML = `
    <img src=./assets/icons/checkedButton.png >
    `;
  }
}

/**
 * Toggles the completion status of a subtask.
 *
 * @async
 * @param {string} key - The unique identifier of the task.
 * @param {number} index - The index of the subtask within the task's subtasks array.
 *
 */
async function changeCheckbox(key, index) {
  try {
    let response = await fetch(
      `${BASE_URL}tasks/${key}/Subtasks/${index}/undone.json`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let undone = await response.json();
    undone = !undone;
    await updateUndoneStatus(key, index, undone);

    let updatedSubtasksResponse = await fetch(
      `${BASE_URL}tasks/${key}/Subtasks.json`
    );
    let updatedSubtasks = await updatedSubtasksResponse.json();
    let taskDiv = document.getElementById(`singleTaskCard${key}`);
    await loadSubtasks(key, updatedSubtasks, taskDiv);
    await renderSubtasksLargeView(key);
    const {doneCount, totalSubtasks} = await renderDoneSubtasksCount(key);
    move(key, doneCount, totalSubtasks);
  } catch (error) {
    console.error("Fehler beim Ändern des Subtask-Status:", error);
  }
}

/**
 * Updates the completion status of a specific subtask in the database.
 *
 * @async
 * @param {string} key - The unique identifier of the task.
 * @param {number} index - The index of the subtask within the task's subtasks array.
 * @param {boolean} undone - The new completion status of the subtask.
 */
async function updateUndoneStatus(key, index, undone) {
  const updateResponse = await fetch(
    `${BASE_URL}tasks/${key}/Subtasks/${index}/undone.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(undone),
    }
  );
  if (!updateResponse.ok) {
    throw new Error(`HTTP error! Status: ${updateResponse.status}`);
  }
}

/**
 * Counts and displays the number of completed subtasks for a task.
 *
 * @param {string} key - The unique identifier of the task.
 * @returns {Promise<Object>} An object containing `doneCount` and `totalSubtasks`.
 */
async function renderDoneSubtasksCount(key) {
  let doneSubtasksCountDiv = document.getElementById(`doneSubtasksCount${key}`);
  let response = await fetch(`${BASE_URL}tasks/${key}/Subtasks.json`);
  let subtasks = await response.json();
  let totalSubtasks = subtasks.length;
  doneCount = 0;
  for (let index = 0; index < subtasks.length; index++) {
    const subtaskDoneStatus = subtasks[index].undone;
    if (subtaskDoneStatus === false) {
      doneCount = doneCount + 1;
    }
  }
  doneSubtasksCountDiv.innerHTML = `
  <div> ${doneCount}/ </div>
  <div> ${totalSubtasks} </div>
  `;

  return {doneCount, totalSubtasks};
}

/**
 * Displays the priority level text based on the priority icon.
 *
 * @param {string} priority - The HTML string of the priority icon.
 * @param {string} key - The unique identifier of the task.
 *
 */
function renderPrioWord(priority, key) {
  let prioWordContainer = document.getElementById(`priorityCardLarge${key}`);
  if (priority.includes("urgentColor.svg")) {
    prioWordContainer.innerHTML = "Urgent";
  } else if (priority.includes("mediumColor.svg")) {
    prioWordContainer.innerHTML = "Medium";
  } else if (priority.includes("lowColor.svg")) {
    prioWordContainer.innerHTML = "Low";
  }
}

/**
 * This function sets the identifier of the currently dragged task.
 *
 * @param {*} key This the created key of the task when saved in the API,
 *                      given by the pullTasks() funktion
 */
function startDragging(key) {
  currentDraggedElement = key;
}

/**
 * This function allows an element to be dropped into a drop target.
 *
 * @param {DragEvent} ev The drag event triggered when an element is dragged over a valid drop target.
 *                       The event is used to prevent the default behavior, enabling the drop action.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * This function updates the status of the currently dragged task in the database.
 *
 * @param {string} status The new status to assign to the task (e.g., "to-do", "in-progress", etc.).
 *
 */
async function moveTo(status) {
  let response = await fetch(
    BASE_URL + `tasks/${currentDraggedElement}/Status/.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(status),
    }
  );
  pullTasks();
}

/**
 * This function checks if the given task lists are empty and updates their content accordingly.
 *
 * @param {HTMLElement} taskListToDo The DOM element representing the "To Do" task list.
 * @param {HTMLElement} taskListInProgress The DOM element representing the "In Progress" task list.
 * @param {HTMLElement} taskListAwaitFeedback The DOM element representing the "Awaiting Feedback" task list.
 * @param {HTMLElement} taskListDone The DOM element representing the "Done" task list.
 */
function checkCardEmpty(
  taskListToDo,
  taskListInProgress,
  taskListAwaitFeedback,
  taskListDone
) {
  updateCard(taskListDone, "No tasks done");
  updateCard(taskListInProgress, "No tasks in progress");
  updateCard(taskListToDo, "No tasks to do");
  updateCard(taskListAwaitFeedback, "No tasks awaiting feedback");
}

/**
 * This function updates the visual state and content of a task list based on its emptiness.
 *
 * @param {HTMLElement} taskList The DOM element representing the task list to be updated.
 * @param {string} emptyMessage The message to display if the task list is empty.
 */
function updateCard(taskList, emptyMessage) {
  if (taskList.children.length === 0) {
    taskList.classList.add("dragAreaEmpty");
    taskList.classList.remove("drag-area");
    taskList.innerHTML = emptyMessage;
  } else {
    taskList.classList.remove("dragAreaEmpty");
    taskList.classList.add("drag-area");
  }
}
