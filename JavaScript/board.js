let currentDraggedElement;

/**
 * This function opens add-contact-form
 */
function addTask(status = "to-do") {
  const addTaskMain = document.getElementById("addTaskMain");
  const addTask = document.getElementById("addTask");
  addTaskMain.style.display = "flex";
  setTimeout(() => addTaskMain.classList.add("show"), 10);
  setTimeout(() => addTask.classList.add("show"), 10);
  addTask.innerHTML = templateAddTask(status);
  assignedAddTaks = document.getElementById("assignedAddTaks");
}

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
    ".subtasksLarge, .dueDateCardLarge"
  );
  elem.forEach((element) => {
    element.style.display = "flex";
  });

  renderSubtasksLargeView(key);
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
  addTask.classList.remove("show");
  setTimeout(() => {
    addTaskMain.classList.remove("show");
    setTimeout(() => {
      addTaskMain.style.display = "none";
    }, 100);
  }, 100);
}

/**
 * This function saves the tasks in the API
 *
 * @param {string} [status="to-do"] The status of the task (default is "to-do").
 * @param {Object} [data=""] Optional task data; if not provided, it is constructed from input fields.
 *
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
    renderGroupedTasks(tasks);
  }
  renderUserIcon();
}

/**
 * This function renders tasks and after sorting them according to their status
 *
 * @param {*} tasks this is the whole tasklist saved in the API,
 *                      given by the pullTasks() funtion
 */
function renderGroupedTasks(tasks) {
  let taskListToDo = document.getElementById("ToDoCard");
  let taskListInProgress = document.getElementById("InProgressCard");
  let taskListAwaitFeedback = document.getElementById("AwaitFeedbackCard");
  let taskListDone = document.getElementById("DoneCard");
  taskListToDo.innerHTML = "";
  taskListInProgress.innerHTML = "";
  taskListAwaitFeedback.innerHTML = "";
  taskListDone.innerHTML = "";

  Object.entries(tasks).forEach(([key, taskdetails]) => {
    // wenn man Object.entries(tasks) aufruft, erhält man ein alle tasks beinhaltendes Array von Arrays mit zwei einrtägen[key,{Title:"..",Description:"..",...}]
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
  });

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
  loadAssignedContacts(key, taskdetails.AssignedTo, taskDiv);
  loadPrio(key, taskdetails.Priority, taskDiv);
  loadSubtasks(key, taskdetails.Subtasks, taskDiv);
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
<div class="titleCard">${taskdetails.Title}</div>
<div class="descriptionCard">${taskdetails.Description}</div>
<div class="dueDateCardLarge" id="dueDate${key}">${taskdetails.DueDate}</div>
<div id="subtasksCard${key}" class="subtasksCard"></div>
<div class="bottomCard">
  <div class="assignedToCard" id="assignedToCard${key}"></div>
  <div id="priorityCard${key}"></div>
</div>`;
}

async function loadAssignedContacts(key, assignedTo, taskDiv) {
  const assignedToContainer = taskDiv.querySelector(`#assignedToCard${key}`);
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();

  console.log("Type of assignedTo:", typeof assignedTo);
  console.log(assignedTo);
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
      <div 
        class="contactInitialsBoard" 
        style="background-color: ${backgroundColor};">
        ${initials}
      </div>`;
    }
  }
}

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

async function loadSubtasks(key, subtasks, taskDiv) {
  const subtasksContainer = taskDiv.querySelector(`#subtasksCard${key}`);
  subtasksContainer.innerHTML = "";

  console.log("Type of subtasks:", typeof subtasks);
  console.log(subtasks);

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
    const { doneCount, totalSubtasks } = await renderDoneSubtasksCount(key);
    move(key, doneCount, totalSubtasks);
  } else {
    subtasksContainer.classList.add("displayNone");
  }
}

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
    const { doneCount, totalSubtasks } = await renderDoneSubtasksCount(key);
    move(key, doneCount, totalSubtasks);
  } catch (error) {
    console.error("Fehler beim Ändern des Subtask-Status:", error);
  }
}

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

  return { doneCount, totalSubtasks };
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
