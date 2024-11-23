function templateTaskCardLarge(key) {
  let taskDiv = document.getElementById(`singleTaskCard${key}`);
  let category = taskDiv.querySelector(`#categoryCard${key}`).innerHTML;
  let title = taskDiv.querySelector(`.titleCard`).innerHTML;
  let description = taskDiv.querySelector(`.descriptionCard`).innerHTML;
  let assignedTo = taskDiv.querySelector(`#assignedToCard${key}`).innerHTML;
  let priority = taskDiv.querySelector(`#priorityCard${key}`).innerHTML;
  let subtasks = taskDiv.querySelector(`#subtasksCard${key}`).innerHTML;
  let dueDate = taskDiv.querySelector(`#dueDate${key}`).innerHTML;

  return `
        <div class="taskCardLargeContent">
          <div id="categoryCardLarge${key}" class="categoryCardLarge">${category}</div>
          <div class="titleCardLarge">${title}</div>
          <div class="descriptionCardLarge">${description}</div>
          <div class="dueDateCardLarge">Due Date: ${dueDate}</div>
          <div class="subtasksCardLarge">${subtasks}</div>
          <div class="assignedToCardLarge">${assignedTo}</div>
          <div id="priorityCardLarge${key}">${priority}</div>
          <div class="subtasksLarge">
        <div class="headerSubtasks">Subtasks</div>
        <div id="subtasksToClickLarge${key}" class="subTasksToClickLarge"></div>    
      </div>
        </div>
      `;
}
