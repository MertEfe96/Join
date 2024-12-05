/**
 * Loads and displays the assigned contacts for a specific task.
 * It fetches the contact data from the API and extracts the contact's name and color and generates the initials.
 *
 * @param {string} key - The unique identifier of the task, used to select the corresponding container.
 * @param {Array} assignedTo - An array of objects representing the assigned contacts, each containing an `id` and `initials`.
 * @param {HTMLElement} taskDiv - The DOM element of the task card where the contacts will be displayed.
 *
 */
async function loadAssignedContacts(key, assignedTo, taskDiv) {
  const assignedToContainer = taskDiv.querySelector(`#assignedToCard${key}`);
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  assignedToContainer.innerHTML = "";

  for (let index = 0; index < assignedTo.length; index++) {
    const element = assignedTo[index];
    const assignedId = element.id;

    if (data.contacts && data.contacts.hasOwnProperty(assignedId)) {
      let contactName = data.contacts[assignedId].name;
      let backgroundColor = data.contacts[assignedId].color || "#ccc";
      const initials = contactName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
      assignedToContainer.innerHTML += htmlAssignedContacts(
        backgroundColor,
        initials,
        contactName
      );
    }
  }
}

/**
 * This function returns the html structured assigned contacts
 */
function htmlAssignedContacts(backgroundColor, initials, contactName) {
  return `
            <div class="assignedToContainer">
              <div class="contactInitialsBoard" style="background-color: ${backgroundColor};">
                ${initials}
              </div>
              <div class="hideSmallView">
                ${contactName}
              </div>
            </div>`;
}

/**
 * Loads and displays the priority icon for a specific task.
 *
 * @param {string} key - The unique identifier of the task, used to select the corresponding priority container.
 * @param {string} priority - The priority level of the task
 * @param {HTMLElement} taskDiv - The DOM element of the task card where the priority icon will be displayed.
 *
 */
function loadPrio(key, priority, taskDiv) {
  const prioContainer = taskDiv.querySelector(`#priorityCard${key}`);
  prioContainer.innerHTML = "";
  if (priority === "prioUrgent") {
    prioContainer.innerHTML = `<img src=./assets/icons/urgentColor.svg>`;
  } else if (priority === "prioMedium") {
    prioContainer.innerHTML = `<img src=./assets/icons/mediumColor.svg>`;
  } else if (priority === "prioLow") {
    prioContainer.innerHTML = `<img src=./assets/icons/lowColor.svg>`;
  }
}

/**
 * Loads and displays the subtasks for a specific task.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {Array} subtasks - An array of subtask objects.
 * @param {HTMLElement} taskDiv - The task card element where subtasks will be displayed.
 *
 */
async function loadSubtasks(key, subtasks, taskDiv) {
  const subtasksContainer = taskDiv.querySelector(`#subtasksCard${key}`);
  subtasksContainer.innerHTML = "";
  if (Array.isArray(subtasks) && subtasks.length > 0) {
    subtasksContainer.classList.remove("displayNone");
    subtasksContainer.innerHTML = htmlsubtaskSmallView(key);
    const { doneCount, totalSubtasks } = await renderDoneSubtasksCount(key);
    move(key, doneCount, totalSubtasks);
  } else {
    subtasksContainer.classList.add("displayNone");
  }
}

/**
 * This function returns the html structured subtasks for the small view task cards
 */
function htmlsubtaskSmallView(key) {
  return `
          <div class="subtasksSmall">
            <div class="myProgress">
              <div class="myBar" id="myBar${key}"></div>
            </div>
            <div class="subtasksCount">
              <div class="doneSubtasksCount" id="doneSubtasksCount${key}"></div>
              <div> &nbsp;Subtasks</div>
            </div>
          </div>
    `;
}

/**
 * Updates the width of the progress bar based on completed subtasks.
 *
 * @param {string} key - The unique identifier of the task.
 * @param {number} doneCount - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 *
 */
async function move(key, doneCount, totalSubtasks) {
  let doneSubtasksBar = document.getElementById(`myBar${key}`);
  if (doneCount > 0) {
    let width = (100 / totalSubtasks) * doneCount;
    doneSubtasksBar.style.width = `${width}%`;
  } else {
    doneSubtasksBar.style.width = "0%";
  }
}

/**
 * Loads and displays the subtasks in the large view for a specific task.
 *
 * @param {string} key - The unique identifier of the task.
 *
 */
async function renderSubtasksLargeView(key) {
  let subTasksLarge = document.getElementById(`subtasksToClickLarge${key}`);
  subTasksLarge.innerHTML = "";
  let response = await fetch(`${BASE_URL}tasks/${key}/Subtasks.json`);
  let subtasks = await response.json();
  for (let index = 0; index < subtasks.length; index++) {
    const subtask = subtasks[index];
    const div = document.createElement(`subtask${key}-${index}`);
    div.classList.add("subtaskClickDiv");
    let subtaskTask = subtask.task;
    div.innerHTML = htmlSubtasksLargeView(key, index, subtaskTask);
    subTasksLarge.appendChild(div);
    renderCheckButton(subtask, key, index);
  }
}

/**
 * This function returns the html structured subtasks for the large view task cards
 */
function htmlSubtasksLargeView(key, index, subtaskTask) {
  return `
    <div id="subtaskClickButton${key}-${index}" class="subtaskClickButton" onclick="changeCheckbox('${key}', '${index}')"></div>
    <div class="singleSubtaskClick">${subtaskTask}</div>
    `;
}

/**
 * Renders the check button image based on the subtask's completion status.
 *
 * @param {Object} subtask - The subtask object containing its properties.
 * @param {string} key - The unique identifier of the task.
 * @param {number} index - The index of the subtask within the task's subtasks array.
 */
function renderCheckButton(subtask, key, index) {
  let checkButton = document.getElementById(
    `subtaskClickButton${key}-${index}`
  );
  if (subtask.undone === true) {
    checkButton.innerHTML = `
      <img src=./assets/icons/uncheckedButton.png >
      `;
  } else {
    checkButton.innerHTML = `
      <img src=./assets/icons/checkedButton.png >
      `;
  }
}

/**
 * Toggles the completion status of a subtask saves it in the API and renders the new subtasks status
 *
 * @async
 * @param {string} key - The unique identifier of the task.
 * @param {number} index - The index of the subtask within the task's subtasks array.
 *
 */
async function changeCheckbox(key, index) {
  try {
    await toggleUndoneStatus(key, index);
    let updatedSubtasksResponse = await fetch(
      `${BASE_URL}tasks/${key}/Subtasks.json`
    );
    let updatedSubtasks = await updatedSubtasksResponse.json();
    let taskDiv = document.getElementById(`singleTaskCard${key}`);
    await loadSubtasks(key, updatedSubtasks, taskDiv);
    await renderSubtasksLargeView(key);
    const { doneCount, totalSubtasks } = await renderDoneSubtasksCount(key);
    move(key, doneCount, totalSubtasks);
  } catch (error) {
    console.error("Fehler beim Ändern des Subtask-Status:", error);
  }
}

/**
 * Toggles the completion status of a subtask.
 */
async function toggleUndoneStatus(key, index) {
  let response = await fetch(
    `${BASE_URL}tasks/${key}/Subtasks/${index}/undone.json`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  let undone = await response.json();
  undone = !undone;
  await updateUndoneStatus(key, index, undone);
}

/**
 * Updates the completion status of a specific subtask in the database.
 *
 * @async
 * @param {string} key - The unique identifier of the task.
 * @param {number} index - The index of the subtask within the task's subtasks array.
 * @param {boolean} undone - The new completion status of the subtask.
 */
async function updateUndoneStatus(key, index, undone) {
  const updateResponse = await fetch(
    `${BASE_URL}tasks/${key}/Subtasks/${index}/undone.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(undone),
    }
  );
  if (!updateResponse.ok) {
    throw new Error(`HTTP error! Status: ${updateResponse.status}`);
  }
}

/**
 * Counts and displays the number of completed subtasks for a task.
 *
 * @param {string} key - The unique identifier of the task.
 * @returns {Promise<Object>} An object containing `doneCount` and `totalSubtasks`.
 */
async function renderDoneSubtasksCount(key) {
  let doneSubtasksCountDiv = document.getElementById(`doneSubtasksCount${key}`);
  let response = await fetch(`${BASE_URL}tasks/${key}/Subtasks.json`);
  let subtasks = await response.json();
  let totalSubtasks = subtasks.length;
  doneCount = 0;
  for (let index = 0; index < subtasks.length; index++) {
    const subtaskDoneStatus = subtasks[index].undone;
    if (subtaskDoneStatus === false) {
      doneCount = doneCount + 1;
    }
  }
  doneSubtasksCountDiv.innerHTML = htmlSubtaskCount(doneCount, totalSubtasks);
  return { doneCount, totalSubtasks };
}

/**
 * This function returns the html structured done and total counts of the subtasks
 */
function htmlSubtaskCount(doneCount, totalSubtasks) {
  return `
            <div> ${doneCount}/ </div>
            <div> ${totalSubtasks} </div>
           `;
}

/**
 * Displays the priority level text based on the priority icon.
 *
 * @param {string} priority - The HTML string of the priority icon.
 * @param {string} key - The unique identifier of the task.
 *
 */
function renderPrioWord(priority, key) {
  let prioWordContainer = document.getElementById(`priorityCardLarge${key}`);
  if (priority.includes("urgentColor.svg")) {
    prioWordContainer.innerHTML = "Urgent";
  } else if (priority.includes("mediumColor.svg")) {
    prioWordContainer.innerHTML = "Medium";
  } else if (priority.includes("lowColor.svg")) {
    prioWordContainer.innerHTML = "Low";
  }
}

/**
 * This function sets the identifier of the currently dragged task.
 *
 * @param {*} key This the created key of the task when saved in the API,
 *                      given by the pullTasks() funktion
 */
function startDragging(key) {
  currentDraggedElement = key;
}
/**
 * This function allows an element to be dropped into a drop target.
 *
 * @param {DragEvent} ev The drag event triggered when an element is dragged over a valid drop target.
 *                       The event is used to prevent the default behavior, enabling the drop action.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * This function updates the status of the currently dragged task in the database.
 *
 * @param {string} status The new status to assign to the task (e.g., "to-do", "in-progress", etc.).
 *
 */
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

/**
 * This function checks if the given task lists are empty and updates their content accordingly.
 *
 * @param {HTMLElement} taskListToDo The DOM element representing the "To Do" task list.
 * @param {HTMLElement} taskListInProgress The DOM element representing the "In Progress" task list.
 * @param {HTMLElement} taskListAwaitFeedback The DOM element representing the "Awaiting Feedback" task list.
 * @param {HTMLElement} taskListDone The DOM element representing the "Done" task list.
 */
function checkTasklistEmpty(
  taskListToDo,
  taskListInProgress,
  taskListAwaitFeedback,
  taskListDone
) {
  updateCard(taskListDone, "No tasks done");
  updateCard(taskListInProgress, "No tasks in progress");
  updateCard(taskListToDo, "No tasks to do");
  updateCard(taskListAwaitFeedback, "No tasks awaiting feedback");
}

/**
 * This function updates the visual state and content of a task list based on its emptiness.
 *
 * @param {HTMLElement} taskList The DOM element representing the task list to be updated.
 * @param {string} emptyMessage The message to display if the task list is empty.
 */
function updateCard(taskList, emptyMessage) {
  if (taskList.children.length === 0) {
    taskList.classList.add("dragAreaEmpty");
    taskList.classList.remove("drag-area");
    taskList.innerHTML = emptyMessage;
  } else {
    taskList.classList.remove("dragAreaEmpty");
    taskList.classList.add("drag-area");
  }
}
