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

function addTaskNav() {
  const addTaskMain = document.getElementById("addTaskMain");
  const addTask = document.getElementById("addTask");
  addTask.innerHTML = templateAddTaskNav();
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
async function saveTask(status = "to-do", data = "") {
  let title = document.getElementById("addTaskInputTitle").value;
  let description = document.getElementById("addTaskInputDescription").value;
  description.replace("<", ".");
  let category = document.getElementById("addTaskInputCategory").value;
  let assignedTo = document.getElementById("inputAssignContacts").value;
  if (status == "") {
    status = "to-do";
  }
  data = {
    Title: title,
    Description: description,
    Category: category,
    Status: status,
    AssignedTo: assignedTo,
  };
  let response = await fetch(BASE_URL + "tasks/.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
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
    taskDiv.ondragstart = function (event) {
      startDragging(key);
    };
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
  assignedTo = assignedTo.split(",").map((name) => name.trim());
  assignedToContainer.innerHTML = "";

  assignedTo.forEach((contactName) => {
    let contactData = Object.values(data.contacts || {}).find(
      (contact) => contact.name === contactName
    );
    let backgroundColor = contactData?.color || "#ccc";
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
  });
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
