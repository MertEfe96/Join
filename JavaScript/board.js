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
 */
async function saveTask(status = "to-do", data = "") {
  let title = document.getElementById("addTaskInputTitle").value;
  let description = document.getElementById("addTaskInputDescription").value;
  description.replace("<", ".");
  let category = document.getElementById("addTaskInputCategory").value;
  if (status == "") {
    status = "to-do";
  }
  data = {
    Title: title,
    Description: description,
    Category: category,
    Status: status,
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
 * This function renders tasks
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
    if (taskdetails.Status === "to-do") {
      taskDiv.innerHTML = `<b>Category</b>: ${taskdetails.Category} <br> <b>Title</b>: ${taskdetails.Title} <br> <b>Description</b>: ${taskdetails.Description} <br> <br> <br>`;
      taskListToDo.appendChild(taskDiv);
    } else if (taskdetails.Status === "in-progress") {
      taskDiv.innerHTML = `<b>Category</b>: ${taskdetails.Category} <br> <b>Title</b>: ${taskdetails.Title} <br> <b>Description</b>: ${taskdetails.Description} <br> <br> <br>`;
      taskListInProgress.appendChild(taskDiv);
    } else if (taskdetails.Status === "await-feedback") {
      taskDiv.innerHTML = `<b>Category</b>: ${taskdetails.Category} <br> <b>Title</b>: ${taskdetails.Title} <br> <b>Description</b>: ${taskdetails.Description} <br> <br> <br>`;
      taskListAwaitFeedback.appendChild(taskDiv);
    } else if (taskdetails.Status === "done") {
      taskDiv.innerHTML = `<b>Category</b>: ${taskdetails.Category} <br> <b>Title</b>: ${taskdetails.Title} <br> <b>Description</b>: ${taskdetails.Description} <br> <br> <br>`;
      taskListDone.appendChild(taskDiv);
    }
  });
}

let currentDraggedElement;
function startDragging(key) {
  currentDraggedElement = key;
}

function allowDrop(ev) {
  ev.preventDefault();
}

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

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}
