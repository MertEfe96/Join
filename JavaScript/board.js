/**
 * This function opens add-contact-form
 */
function addTask(status = "") {
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
async function saveTask(status = "", data = "") {
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
 * This function renders tasks and calls associated functions
 *
 * @param {*} tasks this is the whole tasklist saved in the API,
 *                      given by the pullTasks() funtion
 */
function renderGroupedTasks(tasks) {
  let taskList = document.getElementById("ToDoCard");
  taskList.innerHTML = "";

  Object.entries(tasks).forEach(([key, taskdetails]) => {
    // wenn man Object.entries(tasks) aufruft, erhält man ein alle tasks beinhaltenden Array von Arrays mit zwei einrtägen[key,{Title:"..",Description:"..",...}]
    let taskDiv = document.createElement("div");
    taskDiv.innerHTML = `<b>Category</b>: ${taskdetails.Category} <br> <b>Title</b>: ${taskdetails.Title} <br> <b>Description</b>: ${taskdetails.Description} <br> <br> <br>`;
    taskList.appendChild(taskDiv);
  });
}
