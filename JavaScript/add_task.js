let assignedContacts = [];
let subtasksArray = [];

function renderAssignedContactsInAddTask() {
  let div = document.getElementById("assignedContactsImgDiv");
  div.innerHTML = "";
  assignedContacts.forEach((obj) => {
    div.innerHTML += assignedContactInitialsTemplate(obj.initials, obj.color);
  });
}

function assignContactToTask(key, ini, c, i) {
  checkBox = document.getElementById(key);
  let obj = {id: key, initials: ini, color: c};
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
  let subtask = document.getElementById("addTaskInputSubtask").value;
  let div = document.getElementById("subtasksList");
  div.innerHTML = "";
  if (subtask) {
    subtasksArray.push({task: subtask, undone: true});
  }
  subtasksArray.forEach((task, index) => {
    div.innerHTML += subtaskTemplate(task.task, index);
  });
}

async function setDataForTask(status = "to-do") {
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
  await postTask(data);
  addTaskNav();
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

  addTask();
  closetaskCardLarge();
  fillInputsEditTask();
}

function fillInputsEditTask(dataTask) {
  let title = document.getElementById("addTaskInputTitle").value;
  let description = document.getElementById("addTaskInputDescription").value;
  description = description.replace("<", ".");
  let assigned = assignedContacts;
  let date = document.getElementById("addTaskInputDate").value;
  /*let prio = document.getElementsByClassName("chosenPrio")[0].id;*/
  let category = document.getElementById("addTaskInputCategory").value;
  let subtasks = subtasksArray;
  title = dataTask.Title;
  /*description = dataTask.Description;*/
}

async function editTask(data, key) {
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
  const sortedContacts = sortContacts(contacts);
  sortedContacts.forEach(([key, contact], index) => {
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
function editSubtask() {
  let task = document.getElementById;
}
