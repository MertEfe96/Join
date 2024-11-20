let assignedContacts = [];

function renderAssignedContactsInAddTask() {
  let div = document.getElementById("assignedContactsImgDiv");
  div.innerHTML = "";
  assignedContacts.forEach((obj) => {
    div.innerHTML += assignedContactInitialsTemplate(obj.initials);
  });
}

function assignContactToTask(key, i, ini) {
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
  renderAssignedContactsInAddTask();
}

function renderSubtasks() {
  let subtask = document.getElementById("addTaskInputSubtask");
  let div = document.getElementById("subtasksList");
  div.innerHTML += subtaskTemplate(subtask.value);
}

function setDataForTask() {
  let title = document.getElementById("addTaskInputTitle").value;
  let description = document.getElementById("addTaskInputDescription").value;
  let assigned = assignedContacts;
  let date = document.getElementById("addTaskInputTitle").value;
  let prio = document.getElementsByClassName("chosenPrio")[0].id;
  let category = document.getElementById("addTaskInputCategory").value;
  let subtasks = document.getElementById("addTaskInputTitle").value;
  let data = {};
  pushTask(data);
}

async function pushTask(data) {}
