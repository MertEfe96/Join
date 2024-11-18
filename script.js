const BASE_URL =
  "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";

function renderLogin() {
  let div = document.getElementById("loginContent");
  div.innerHTML = signUpTemplate();
}

function closeLogin() {
  let div = document.getElementById("loginContent");
  div.innerHTML = "";
}

document.body.addEventListener("click", function (e) {
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
      pullContactsToAssign(dropdown);
    }
  }
});

async function pullContactsToAssign(dropdown) {
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
    dropdown.innerHTML += assigneContactTemplate(key, contact, index);
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
}

async function pushTask() {}

function setDataForTask() {
  let title = document.getElementById("addTaskInputTitle").value;
  let description = document.getElementById("addTaskInputDescription").value;
  let assigned = document.getElementById("input").value;
  let date = document.getElementById("addTaskInputTitle").value;
  let prio = document.getElementById("addTaskInputTitle").value;
  let category = document.getElementById("addTaskInputTitle").value;
  let subtasks = document.getElementById("addTaskInputTitle").value;
}
