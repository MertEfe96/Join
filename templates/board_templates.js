/**
 * Generates the HTML structure for a large task card.
 *
 * @param {string} key - The unique identifier of the task.
 * @returns {string} The HTML string representing the large task card.
 */
function templateTaskCardLarge(key) {
  const {
    category,
    title,
    description,
    assignedTo,
    priority,
    subtasks,
    dueDate,
    categoryClass,
  } = getTaskData(key);
  return `
        <div class="taskCardLargeContent">
          <div class="categoryCardLargeTop"> <div id="categoryCardLarge${key}" class="categoryCardLarge ${categoryClass}">${category}</div> <img onclick="closetaskCardLarge()" class="closeButtonLargeView" src=./assets/icons/close.png></div>
          <div class="titleCardLarge">${title}</div>
          <div class="descriptionCardLarge">${description}</div>
          <div class="dueDateCardLarge"><div class="headingsFontColor">Due Date:</div> <div>${dueDate}</div></div>
          <div class="dueDateCardLarge"><div class="headingsFontColor">Priority:</div> <div class="prioLargeViewRight"> <div id="priorityCardLarge${key}"></div> <div class="prioImgLargeView">${priority}</div> </div></div>
          <div class="assignedToCardLarge"><div class="headingsFontColor">Assigned To:</div> <div class="assignedToLargeViewBottom">${assignedTo}</div></div>
          <div class="subtasksLarge">
            <div class="headerSubtasks headingsFontColor">Subtasks</div>
            <div id="subtasksToClickLarge${key}" class="subTasksToClickLarge"></div>    
          </div>
          <div class="bottomCardLarge">
            <div> <img onclick="deleteTaskCardLarge('${key}')" class="deleteButtonLargeView" src=./assets/icons/deleteTask.png> Delete </div>
            <div> <img onclick="getDataForEditTask('${key}')" class="deleteButtonLargeView" src=./assets/icons/editTask.png> Edit </div>
          </div>
        </div>
      `;
}
