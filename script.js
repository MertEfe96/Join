const BASE_URL =
  "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";

let userLocal = [];

function showDropDown() {
  dropdownHeader.classList.toggle("show");
}

function checkIfLogedIn() {
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      renderLogin();
    }
  }
}

function initAddTask() {
  addTaskNav();
  pullContactsToAssign();
  checkIfLogedIn();
  setMinDate();
}

function initBoard() {
  pullTasks();
  checkIfLogedIn();
}

function initContacts() {
  pullContacts();
  checkIfLogedIn();
}

function initSumary() {
  fetchAmounts("/tasks");
  summaryGreeting();
  renderUserIcon();
  checkIfLogedIn();
}
