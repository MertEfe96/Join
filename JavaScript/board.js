let currentDraggedElement;

/**
 * This function adjusts add-contact-form for the edit Task Window
 *  * @param {*} addTask The DOM Element in which the addTask Window will be shown
 */

function editTaskTemplateAdjustemt(status, key, addTask) {
  addTask.innerHTML = templateAddTask(status, key);
  const elements = addTask.querySelectorAll(
    ".overlaySaveButton, .overlayDeleteButton, .headlineAddTask"
  );
  elements.forEach((element) => {
    element.style.display = "none";
  });
  const elem = addTask.querySelector(".overlayEditButton");
  elem.style.display = "flex";
  const headlineWindow = addTask.querySelector(".headlineAddTaskWindow");
  headlineWindow.style.justifyContent = "flex-end";
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
  adjustLargeView(taskCardLarge);
  renderSubtasksLargeView(key);
  let taskDiv = document.getElementById(`singleTaskCard${key}`);
  let priority = taskDiv.querySelector(`#priorityCard${key}`).innerHTML;
  renderPrioWord(priority, key);
}
/**
 * This function adjusts the large view Template
 *  * @param {*} taskCardLarge The DOM Element in which the large Task Card View will be shown
 */
function adjustLargeView(taskCardLarge) {
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
}

/**
 * This function returns the Task Infos from each single Task Card for the large view
 */
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

/**
 * This function closes large view of the task
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

  adjustElements(taskCardLarge);
}

/**
 * This function adjusts classlists from elements when closing the large view of the task
 */
function adjustElements(taskCardLarge) {
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
  await setDataForTask(status);
  closeAddTask();
  await pullTasks();
}

/**
 * This function fetches the tasks saved in the API
 */
async function pullTasks(search = "") {
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  let tasks = data.tasks;
  if (tasks) {
    await renderGroupedTasks(tasks, search);
  }
  renderUserIcon();
}

/**
 * This function renders tasks and sorts them according to their status
 *
 * @param {*} tasks this is the whole tasklist saved in the API,
 *                      given by the pullTasks() funtion
 */
async function renderGroupedTasks(tasks, search) {
  const {
    taskListToDo,
    taskListInProgress,
    taskListAwaitFeedback,
    taskListDone,
  } = initializeTaskLists();
  let renderPromises = Object.entries(tasks).map(async ([key, taskdetails]) => {
    let taskDiv = createTaskDiv(key);
    setupDragEvents(taskDiv, key);
    await setupTaskDetails(
      taskDiv,
      key,
      taskdetails,
      taskListToDo,
      taskListInProgress,
      taskListAwaitFeedback,
      taskListDone,
      search
    );
    await loadAssignedContacts(key, taskdetails.AssignedTo, taskDiv);
    loadPrio(key, taskdetails.Priority, taskDiv);
    loadSubtasks(key, taskdetails.Subtasks, taskDiv);
  });
  await Promise.all(renderPromises);
  checkTasklistEmpty(
    taskListToDo,
    taskListInProgress,
    taskListAwaitFeedback,
    taskListDone
  );
}

/**
 * This function initializes the four different tasklists
 */
function initializeTaskLists() {
  let taskListToDo = document.getElementById("ToDoCard");
  let taskListInProgress = document.getElementById("InProgressCard");
  let taskListAwaitFeedback = document.getElementById("AwaitFeedbackCard");
  let taskListDone = document.getElementById("DoneCard");
  taskListToDo.innerHTML = "";
  taskListInProgress.innerHTML = "";
  taskListAwaitFeedback.innerHTML = "";
  taskListDone.innerHTML = "";
  return {
    taskListToDo,
    taskListInProgress,
    taskListAwaitFeedback,
    taskListDone,
  };
}

/**
 * This function creates the container for every task card
 */
function createTaskDiv(key) {
  let taskDiv = document.createElement("div");
  taskDiv.draggable = true;
  taskDiv.classList.add("singleTaskCard");
  taskDiv.id = `singleTaskCard${key}`;

  return taskDiv;
}

/**
 * This function sets up drag events on every task card
 */
function setupDragEvents(taskDiv, key) {
  taskDiv.ondragstart = function (event) {
    startDragging(key);

    const dragImage = taskDiv.cloneNode(true);
    dragImage.style.transform = "rotate(15deg)";
    dragImage.style.position = "absolute";
    dragImage.style.pointerEvents = "none";
    dragImage.style.zIndex = "1000";
    dragImage.style.width = `${taskDiv.offsetWidth}px`;
    dragImage.style.height = `${taskDiv.offsetHeight}px`;

    document.body.appendChild(dragImage);

    const moveDragImage = (e) => {
      dragImage.style.left = `${e.pageX - taskDiv.offsetWidth / 2}px`;
      dragImage.style.top = `${e.pageY - taskDiv.offsetHeight / 2}px`;
    };

    document.addEventListener("dragover", moveDragImage);

    taskDiv.addEventListener("dragend", () => {
      document.body.removeChild(dragImage);
      document.removeEventListener("dragover", moveDragImage);
      removeAllPlaceholders();
    });

    const currentListId = taskDiv.closest(".taskCard").id;
    addNeighborPlaceholders(currentListId);
    event.dataTransfer.setDragImage(new Image(), 0, 0);
  };
  taskDiv.ondragover = function (event) {
    event.preventDefault();
  };
}

/**
 * This function sets up the detailed informations on every task card
 */
async function setupTaskDetails(
  taskDiv,
  key,
  taskdetails,
  taskListToDo,
  taskListInProgress,
  taskListAwaitFeedback,
  taskListDone,
  search
) {
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
    taskListDone,
    search
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
 * @param {*} search this is the input.value of the searchbar give nfrom the eventlistener
 */
function sortTasks(
  key,
  taskdetails,
  categoryClass,
  taskDiv,
  taskListToDo,
  taskListInProgress,
  taskListAwaitFeedback,
  taskListDone,
  search
) {
  const searchLowerCase = search.toLowerCase();
  const matchesSearch =
    !search ||
    taskdetails.Title.toLowerCase().includes(searchLowerCase) ||
    taskdetails.Description.toLowerCase().includes(searchLowerCase);

  if (matchesSearch) {
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
}
const searchTaskInput = document.getElementById("findTask");
searchTaskInput.addEventListener("input", (e) => {
  pullTasks(e.target.value);
});

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
