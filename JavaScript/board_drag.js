/**
 * This function sets the identifier of the currently dragged task.
 *
 * @param {*} key This the created key of the task when saved in the API, given by the pullTasks() funktion
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
  removeAllPlaceholders();
  const {
    taskListToDo,
    taskListInProgress,
    taskListAwaitFeedback,
    taskListDone,
  } = initializeTaskLists();
  checkTasklistEmpty(
    taskListToDo,
    taskListInProgress,
    taskListAwaitFeedback,
    taskListDone
  );
}

/**
 * Adds placeholders to neighboring task lists based on the dragged list
 */
function addNeighborPlaceholders(currentListId) {
  const neighborLists = getNeighborLists(currentListId);
  neighborLists.forEach((listId) => {
    const targetList = document.getElementById(listId);
    if (targetList) {
      const placeholder = document.createElement("div");
      placeholder.className = "placeholderDragField";
      placeholder.id = `dragPlaceholder-${listId}`;
      targetList.classList.remove("dragAreaEmpty");
      targetList.classList.add("drag-area");
      if (targetList.children.length === 0) {
        targetList.innerHTML = "";
      }
      targetList.appendChild(placeholder);
    }
  });
}

/**
 * Removes all placeholders from all task lists
 */
function removeAllPlaceholders() {
  document.querySelectorAll(".placeholderDragField").forEach((placeholder) => {
    placeholder.parentNode.removeChild(placeholder);
  });
}

/**
 * Determines neighboring lists based on the current list
 */
function getNeighborLists(currentListId) {
  switch (currentListId) {
    case "ToDoCard":
      return ["InProgressCard"];
    case "InProgressCard":
      return ["ToDoCard", "AwaitFeedbackCard"];
    case "AwaitFeedbackCard":
      return ["InProgressCard", "DoneCard"];
    case "DoneCard":
      return ["AwaitFeedbackCard"];
    default:
      return [];
  }
}
