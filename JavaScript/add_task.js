let assignedContacts = [];
let subtasksArray = [];
let sortedContacts = [];

/**
 * This function opens add-contact-form
 *
 *  * @param {string} [status="to-do"] The status of the task (default is "to-do"). *
 *  * @param {string} [editTask="false"] The editTask value of the task (default is "false"). *
 *  * @param {string} [key=""]  The created key of the task when saved in the API, given by the pullTasks() funktion(default is ""). *
 */

function addTask(status = "to-do", editTask = false, key = "") {
  const addTaskMain = document.getElementById("addTaskMain");
  const addTask = document.getElementById("addTask");
  addTaskMain.style.display = "flex";
  setTimeout(() => addTaskMain.classList.add("show"), 10);
  setTimeout(() => addTask.classList.add("show"), 10);

  if (editTask === true) {
    editTaskTemplateAdjustemt(status, key, addTask);
  } else {
    addTask.innerHTML = templateAddTask(status);
  }
  pullContactsToAssign();
  setMinDate();
}

/**
 * This function opens add-task-form in the add Task Navigation
 */
function addTaskNav() {
  const addTaskMain = document.getElementById("addTaskMain");
  const addTask = document.getElementById("addTask");
  addTask.innerHTML = templateAddTaskNav();
  renderUserIcon();
}

/**
 * This function closes add-task-form
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
  let overlay = document.getElementById("addTask");
  overlay.classList.remove("w600");
}

function renderAssignedContactsInAddTask() {
  let div = document.getElementById("assignedContactsImgDiv");
  div.innerHTML = "";
  assignedContacts.forEach((obj) => {
    div.innerHTML += assignedContactInitialsTemplate(obj.initials, obj.color);
  });
}

function assignContactToTask(key, ini, c, i) {
  checkBox = document.getElementById(key);
  let obj = { id: key, initials: ini, color: c };
  let div = document.getElementById("inDropdown" + i);
  if (div.classList.contains("assignedContactInList")) {
    checkBox.checked = false;
    div.classList.remove("assignedContactInList");
    const pos = assignedContacts.map((e) => e.id).indexOf(key);
    assignedContacts.splice(pos, 1);
  } else {
    checkBox.checked = true;
    div.classList.add("assignedContactInList");
    assignedContacts.push(obj);
  }
  renderAssignedContactsInAddTask();
}

function renderSubtasks() {
  let subtask = document.getElementById("addTaskInputSubtask");
  let div = document.getElementById("subtasksList");
  div.innerHTML = "";
  if (subtask.value) {
    subtasksArray.push({ task: subtask.value, undone: true });
  }
  subtasksArray.forEach((task, index) => {
    div.innerHTML += subtaskTemplate(task.task, index);
  });
  subtask.value = "";
}

async function setDataForTask(status = "to-do", editTask = false, key = "") {
  let title = document.getElementById("addTaskInputTitle").value;
  let description = document.getElementById("addTaskInputDescription").value;
  description = description.replace("<", ".");
  let assigned = assignedContacts;
  let date = document.getElementById("addTaskInputDate").value;
  let prio = document.getElementsByClassName("chosenPrio")[0].id;
  let category = document.getElementById("addTaskInputCategory").value;
  let subtasks = subtasksArray;
  let data = {
    Title: title,
    Description: description,
    AssignedTo: assigned,
    DueDate: date,
    Priority: prio,
    Category: category,
    Subtasks: subtasks,
    Status: status,
  };
  if (editTask === true) {
    await editTaskInDatabase(key, data);
  } else {
    await postTask(data);
    renderPopup("addTask");
    const delay = setTimeout(() => {
      addTaskNav();
      subtasksArray = [];
    }, 1600);
  }
}

async function postTask(data) {
  let response = await fetch(BASE_URL + "tasks/.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function getDataForEditTask(key) {
  let response = await fetch(BASE_URL + `tasks/${key}.json`);
  let dataTask = await response.json();
  let status = dataTask.Status;
  addTask(status, true, key);
  changeWindowToMobile();
  closetaskCardLarge();
  fillInputsEditTask(dataTask);
}

function changeWindowToMobile() {
  let div = document.getElementById("addTaskSplit");
  let overlay = document.getElementById("addTask");
  let portion = document.querySelectorAll(".addTaskPortion").forEach((e) => {
    e.classList.add("portionMobile");
  });
  div.classList.add("editMobile");
  overlay.classList.add("w600");
}

async function fillInputsEditTask(dataTask) {
  let title = document.getElementById("addTaskInputTitle");
  let description = document.getElementById("addTaskInputDescription");
  let date = document.getElementById("addTaskInputDate");
  let category = document.getElementById("addTaskInputCategory");
  date.value = dataTask.DueDate;
  category.value = dataTask.Category;
  subtasksArray = dataTask.Subtasks;
  title.value = dataTask.Title;
  description.value = dataTask.Description;
  await pullContactsToAssign();
  renderEditInputs(dataTask.Priority);
  let assigned = pullContactDetails(dataTask.AssignedTo);
}

async function pullContactDetails(assigned) {
  assigned.forEach(async (contact) => {
    const nameOfContact = await pullAssignedContact(contact.id);
    const index = sortedContacts[0].findIndex(
      (contact) => contact[1]?.name === nameOfContact
    );
    assignContactToTask(contact.id, contact.initials, contact.color, index);
  });
}

async function pullAssignedContact(key) {
  let response = await fetch(BASE_URL + "contacts/" + key + "/name" + "/.json");
  let responseToJson = await response.json();
  return responseToJson;
}

function renderEditInputs(prio) {
  changePrio(prio);
  renderSubtasks();
  renderAssignedContactsInAddTask();
}

async function editTask(key) {
  let response = await fetch(BASE_URL + "tasks/" + key + "/Status" + "/.json");
  let status = await response.json();
  await setDataForTask(status, true, key);
  closeAddTask();
  closetaskCardLarge();
  await pullTasks();
  taskCardLarge(key);
}

async function editTaskInDatabase(key, data) {
  let response = await fetch(BASE_URL + `tasks/${key}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

document.addEventListener("click", function (e) {
  let dropdown = document.getElementById("dropdownContent");
  let arrow = document.getElementById("fakeInputArrow");
  let assignedAddTasks = document.getElementById("assignedAddTaks");
  if (dropdown && arrow && assignedAddTasks) {
    let isInsideDropdown = dropdown.contains(e.target);
    let isInsideAssignedAddTasks = assignedAddTasks.contains(e.target);
    if (
      !isInsideDropdown &&
      !isInsideAssignedAddTasks &&
      dropdown.classList.contains("show")
    ) {
      dropdown.classList.remove("show");
      arrow.classList.remove("rotate");
    }
    if (isInsideAssignedAddTasks && !dropdown.classList.contains("show")) {
      dropdown.classList.add("show");
      arrow.classList.add("rotate");
    }
  }
});

async function deleteTaskCardLarge(key) {
  let response = await fetch(BASE_URL + `tasks/${key}.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  closetaskCardLarge();
  pullTasks();
  renderPopup("delTask");
}

async function pullContactsToAssign() {
  let dropdown = document.getElementById("dropdownContent");
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  let contacts = data.contacts;

  if (contacts) {
    renderContactsToAssign(dropdown, contacts);
  }
}

function renderContactsToAssign(dropdown, contacts) {
  dropdown.innerHTML = "";
  sortedContacts = [];
  sortedContacts.push(sortContacts(contacts));
  sortedContacts[0].forEach(([key, contact], index) => {
    dropdown.innerHTML += assigneContactTemplate(
      key,
      contact,
      index,
      contact.color
    );
  });
}

function changePrio(prio) {
  const prioritieIcons = ["prioUrgent", "prioMedium", "prioLow"];
  let prioId = prioritieIcons.indexOf(prio);
  prioritieIcons.forEach((prioritie, i) => {
    document.getElementById(prioritie).classList.add(prioritie + "Color");
    document.getElementById(prioritie).classList.remove(prioritie + "White");
    document.getElementById(prioritie).classList.remove("chosenPrio");
    document
      .getElementById(prioritie + "Div")
      .classList.remove(prioritie + "ColorDiv");
  });
  document
    .getElementById(prioritieIcons[prioId])
    .classList.add(prioritieIcons[prioId] + "White");
  document.getElementById(prioritieIcons[prioId]).classList.add("chosenPrio");
  document
    .getElementById(prioritieIcons[prioId] + "Div")
    .classList.add(prioritieIcons[prioId] + "ColorDiv");
  document
    .getElementById(prioritieIcons[prioId])
    .classList.remove(prioritieIcons[prioId] + "Color");
}

function setMinDate() {
  const today = new Date().toISOString().slice(0, 10);

  document.getElementsByName("date")[0].min = today;
  renderUserIcon();
}

function showIconsAddTask(i) {
  let div = document.getElementById("subtaskIcons" + i);
  div.classList.toggle("show");
}

function editSubtask(i) {
  let task = document.getElementById("subtaskDiv" + i);
  let subtask = subtasksArray[i].task;
  task.innerHTML = subtaskEditTemplate(subtask, i);
}

function delSubtask(i) {
  subtasksArray.splice(i, 1);
  renderSubtasks();
}

function saveEditSubtask(i) {
  let editTask = document.getElementById("addTaskInputSubtaskEdit" + i);
  subtasksArray[i].task = editTask.value;
  renderSubtasks();
}
