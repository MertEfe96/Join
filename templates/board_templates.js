/**
 * Generates the HTML structure for a large task card.
 *
 * @param {string} key - The unique identifier of the task.
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
            <div class="hoverEffectDeleteEditTask" onclick="deleteTaskCardLarge('${key}')"> <div class="deleteButtonLargeView"></div><div class="hoverBlue">Delete</div></div>
            <div class="mobileNoShow">|</div>
            <div class="hoverEffectDeleteEditTask" onclick="getDataForEditTask('${key}')"> <div class="editButtonLargeView"></div> <div class="hoverBlue">Edit</div> </div>
          </div>
        </div>
      `;
}
