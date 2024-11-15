/**
 * This function opens add-contact-form
 */
function addTask() {
  const addTaskMain = document.getElementById("addTaskMain");
  const addTask = document.getElementById("addTask");
  addTaskMain.style.display = "flex";
  setTimeout(() => addTaskMain.classList.add("show"), 10);
  setTimeout(() => addTask.classList.add("show"), 10);
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
  emptyInputAddTask();
}

/**
 * THis function empties input-value from add-contact-form
 */
function emptyInputAddTask() {
  document.getElementById("addTaskInputTitle").value = "";
  document.getElementById("addTaskInputDescription").value = "";
  document.getElementById("addTaskInputCategory").value = "";
  document.getElementById("addTaskInputSatus").value = "";
}

/**
 * This function saves the tasks in the API
 */
async function saveTask(data = "") {
  let title = document.getElementById("addTaskInputTitle").value;
  let description = document.getElementById("addTaskInputDescription").value;
  let category = document.getElementById("addTaskInputCategory").value;
  let status = document.getElementById("addTaskInputSatus").value;
  data = {
    Title: title,
    Description: description,
    Category: category,
    Status: status,
  };
  let response = await fetch(BASE_URL + "contacts/.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  pullTasks();
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
 * This function sorts and renders contacts and calls associated functions
 *
 * @param {*} tasks this is the whole contacs list saved in the API,
 *                      given by the pullContacts() funtion
 */
function renderGroupedTasks(tasks) {
  let contactsList = document.getElementById("contactsList");
  contactsList.innerHTML = "";
  const sortedContacts = sortContacts(tasks);
  let currentLetter = "";
  console.log(sortedContacts);

  sortedContacts.forEach(([key, contact], index) => {
    const firstLetter = contact.name[0].toUpperCase();

    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      renderLetterHeader(currentLetter, contactsList);
    }
    renderContactCard(key, contact, index, contactsList);
  });
}
