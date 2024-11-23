let assignedContacts = [];
let subtasksArray = [];

function renderAssignedContactsInAddTask(color) {
  let div = document.getElementById("assignedContactsImgDiv");
  div.innerHTML = "";
  assignedContacts.forEach((obj) => {
    div.innerHTML += assignedContactInitialsTemplate(obj.initials, color);
  });
}

function assignContactToTask(key, ini, color) {
  checkBox = document.getElementById(key);
  let obj = {id: key, initials: ini};
  if (checkBox.checked == true) {
    checkBox.checked = false;
    const pos = assignedContacts.map((e) => e.id).indexOf(key);
    assignedContacts.splice(pos, 1);
  } else {
    checkBox.checked = true;
    assignedContacts.push(obj);
  }
  renderAssignedContactsInAddTask(color);
}

function renderSubtasks() {
  let subtask = document.getElementById("addTaskInputSubtask").value;
  let div = document.getElementById("subtasksList");
  if (subtask) {
    div.innerHTML += subtaskTemplate(subtask);
    subtasksArray.push({task: subtask, undone: true});
  }
}

function setDataForTask(status = "to-do") {
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
  postTask(data);
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
