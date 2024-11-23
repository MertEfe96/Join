function templateAddTask(status) {
  return `
    <div class="headlineAddTaskWindow">
          <b>Add Task</b><img class="addTaskCancelIcon" onclick="closeAddTask()" src="./assets/icons/close.png" alt="">
        </div>
        <div class="inputContainer">
          <form class="formAddTask" onsubmit="return false">
            <div class="addTaskSplit">
              <div class="addTaskPortion">
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Title</p>
                    <p class="star">*</p>
                  </div>
                  <input required
                    id="addTaskInputTitle"
                    type="text"
                    class="inputAddTask"
                    placeholder="Enter a Title" />
                </div>
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Description</p>
                  </div>
                  <textarea
                    name=""
                    class="inputAddTask"
                    placeholder="Enter a Description"
                    id="addTaskInputDescription"></textarea>
                </div>
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Assigned to</p>
                  </div>
                  <label for="assigned" id="assignedAddTaks" class="imgInInput">
                    <input
                    
                      type="text"
                      id="inputAssignContacts"
                      class="inputAddTask"
                      placeholder="Select contacts to assign"
                      oninput="filterContactsShown()" />
                    <div class="" id="fakeInputArrow"></div>
                  </label>
                  <div id="dropdownContent" class="dropdownContent hide"></div>
                  <div id="assignedContactsImgDiv"></div>
                </div>
              </div>
              <div class="divieder"></div>
              <div class="addTaskPortion">
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Due date</p>
                    <p class="star">*</p>
                  </div>
                  <input required
                    type="text"
                    onmouseenter="(this.type='date')"
                    onblur="(this.type='text')"
                    name="date"
                    class="inputAddTask"
                    placeholder="dd/mm/yyyy"
                    id="addTaskInputDate" />
                </div>
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Prio</p>
                  </div>
                  <div class="prioDiv">
                    <div
                      class="prio"
                      id="prioUrgentDiv"
                      onclick="changePrio('prioUrgent')">
                      <p>Urgent</p>
                      <div
                        id="prioUrgent"
                        class="prioUrgentColor prioSvg"></div>
                    </div>
                    <div
                      class="prio"
                      id="prioMediumDiv"
                      onclick="changePrio('prioMedium')">
                      <p>Medium</p>
                      <div
                        id="prioMedium"
                        class="prioMediumColor prioSvg"></div>
                    </div>
                    <div
                      class="prio"
                      id="prioLowDiv"
                      onclick="changePrio('prioLow')">
                      <p>Low</p>
                      <div id="prioLow" class="prioLowColor prioSvg"></div>
                    </div>
                  </div>
                </div>
                <div class="inputSubContainerAddTask">
                  <label for="category"
                    ><div class="inputHeader">
                      <p>Category</p>
                      <p class="star">*</p>
                    </div></label
                  >
                  <select
                    required
                    name="category"
                    class="inputAddTask"
                    id="addTaskInputCategory">
                    <option value>Select a task category</option>
                    <option value="User Story">Technical Task</option>
                    <option value="Technical Task">User Story</option>
                  </select>
                </div>
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Subtasks</p>
                  </div>
                  <div class="centerCopy">
                    <input
                      id="addTaskInputSubtask"
                      type="text"
                      class="inputAddTask"
                      placeholder="Add new subtask" />
                    <div onclick="renderSubtasks()" class="addIcon"></div>
                  </div>
                  <div id="subtasksList"></div>
                </div>
              </div>
            </div>
            <div class="addTaskButtonContainer">
              <div class="textRequired">
                <p class="star">*</p>
                <p class="">This field is Required</p>
              </div>
              <div class="editOverlayButtonContainer">
                <button
                  onclick="closeAddTask()"
                  class="overlayDeleteButton addTaskCancelButton">
                  Cancel
                  <img
                    class="addContactCancelIcon"
                    src="assets/icons/close.png"
                    alt="Cancel" />
                </button>
                <button
                  onclick="saveTask('${status}')"
                  class="overlaySaveButton createContactButtonOverlay">
                  Create Task
                  <img
                    class="contactCheckIcon"
                    src="assets/icons/check.png"
                    alt="Check" />
                </button>
              </div>
            </div>
          </form>
        </div>
    `;
}

function templateAddTaskNav(status) {
  return `
    <div class="headlineAddTaskWindow">
          <b>Add Task</b>
        </div>
        <div class="inputContainer">
          <form class="formAddTask" onsubmit="return false">
            <div class="addTaskSplit">
              <div class="addTaskPortion">
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Title</p>
                    <p class="star">*</p>
                  </div>
                  <input required
                    id="addTaskInputTitle"
                    type="text"
                    class="inputAddTask"
                    placeholder="Enter a Title" />
                </div>
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Description</p>
                  </div>
                  <textarea
                    name=""
                    class="inputAddTask"
                    placeholder="Enter a Description"
                    id="addTaskInputDescription"></textarea>
                </div>
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Assigned to</p>
                  </div>
                  <label for="assigned" id="assignedAddTaks" class="imgInInput">
                    <input
                    
                      type="text"
                      id="inputAssignContacts"
                      class="inputAddTask"
                      placeholder="Select contacts to assign"
                      oninput="filterContactsShown()" />
                    <div class="" id="fakeInputArrow"></div>
                  </label>
                  <div id="dropdownContent" class="dropdownContent hide"></div>
                  <div id="assignedContactsImgDiv"></div>
                </div>
              </div>
              <div class="divieder"></div>
              <div class="addTaskPortion">
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Due date</p>
                    <p class="star">*</p>
                  </div>
                  <input required
                    type="text"
                    onmouseenter="(this.type='date')"
                    onblur="(this.type='text')"
                    name="date"
                    class="inputAddTask"
                    placeholder="dd/mm/yyyy"
                    id="addTaskInputDate" />
                </div>
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Prio</p>
                  </div>
                  <div class="prioDiv">
                    <div
                      class="prio"
                      id="prioUrgentDiv"
                      onclick="changePrio('prioUrgent')">
                      <p>Urgent</p>
                      <div
                        id="prioUrgent"
                        class="prioUrgentColor prioSvg"></div>
                    </div>
                    <div
                      class="prio"
                      id="prioMediumDiv"
                      onclick="changePrio('prioMedium')">
                      <p>Medium</p>
                      <div
                        id="prioMedium"
                        class="prioMediumColor prioSvg"></div>
                    </div>
                    <div
                      class="prio"
                      id="prioLowDiv"
                      onclick="changePrio('prioLow')">
                      <p>Low</p>
                      <div id="prioLow" class="prioLowColor prioSvg"></div>
                    </div>
                  </div>
                </div>
                <div class="inputSubContainerAddTask">
                  <label for="category"
                    ><div class="inputHeader">
                      <p>Category</p>
                      <p class="star">*</p>
                    </div></label
                  >
                  <select
                    required
                    name="category"
                    class="inputAddTask"
                    id="addTaskInputCategory">
                    <option value>Select a task category</option>
                    <option value="User Story">Technical Task</option>
                    <option value="Technical Task">User Story</option>
                  </select>
                </div>
                <div class="inputSubContainerAddTask">
                  <div class="inputHeader">
                    <p>Subtasks</p>
                  </div>
                  <div class="centerCopy">
                    <input
                      id="addTaskInputSubtask"
                      type="text"
                      class="inputAddTask"
                      placeholder="Add new subtask" />
                    <div onclick="renderSubtasks()" class="addIcon"></div>
                  </div>
                  <div id="subtasksList"></div>
                </div>
              </div>
            </div>
            <div class="addTaskButtonContainer">
            <div class="textRequired">
                <p class="star">*</p>
                <p class="">This field is Required</p>
              </div>
              <div class="editOverlayButtonContainer">
                <button
                  onclick="closeAddTask()"
                  class="overlayDeleteButton addTaskCancelButton">
                  Cancel
                  <img
                    class="addContactCancelIcon"
                    src="assets/icons/close.png"
                    alt="Cancel" />
                </button>
                <button
                  onclick="setDataForTask()"
                  class="overlaySaveButton createContactButtonOverlay">
                  Create Task
                  <img
                    class="contactCheckIcon"
                    src="assets/icons/check.png"
                    alt="Check" />
                </button>
              </div>
            </div>
          </form>
        </div>
    `;
}

function assigneContactTemplate(key, contact, i, color) {
  const initials = contact.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return `
  <div class="inDropdown" id="inDropdown${i}" onclick="assignContactToTask('${key}', '${initials}', '${color}')">
  <div style="background-color:${color}" class="contactInitialsExtraSmall">${initials}</div>
  <div class="contactName">${contact.name}</div>
  <input type="checkbox" name="" id="${key}" />
</div>`;
}

function assignedContactInitialsTemplate(initials, color) {
  return `
<div style="background-color:${color}" class="contactInitialsExtraSmall addTaskInitals">${initials}</div>
`;
}

function subtaskTemplate(task) {
  return `<div class="subtask">${task}</div>`;
}
