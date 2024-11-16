function templateAddTask(status) {
  return `
    <div class="addTaskMain">
            <div class="headlineAddTaskWindow">
              <b>Add Task</b>
              <img
                class="contactCloseIcon"
                src="assets/icons/close.png"
                alt="Close"
                onclick="closeAddTask()"
              />
            </div>
            <div>
              <div class="inputContainer">
                <form action="" onsubmit="return false">
                  <div class="inputSubContainer">
                  Title
                  <input
                    id="addTaskInputTitle"
                    type="text"
                    placeholder="Enter a Title"
                  />
                </div>
                <div class="inputSubContainer">
                  Description
                  <textarea
                    id="addTaskInputDescription"
                    type="text"
                    placeholder="Enter a Description"
                  ></textarea>
                </div>
                <div class="inputSubContainer">
                    <label for="category">Select task category:</label>
                    <select name="category" id="addTaskInputCategory">
                      <option value="userStory">Technical Task</option>
                      <option value="TechnicalTask">User Story</option>
                    </select>
                </div>
                <div class="editOverlayButtonContainer">
                  <button
                    onclick="closeAddTask()"
                    class="overlayDeleteButton addTaskCancelButton"
                  >
                    Cancel
                    <img
                      class="addContactCancelIcon"
                      src="assets/icons/close.png"
                      alt="Cancel"
                    />
                  </button>
                  <button
                    onclick="saveTask('${status}')"
                    class="overlaySaveButton createContactButtonOverlay"
                  >
                    Create Task
                    <img
                      class="contactCheckIcon"
                      src="assets/icons/check.png"
                      alt="Check"
                    />
                  </button>
                </div>
                </form>
              </div>
            </div>
            </div>
    `;
}

function templateAddTaskNav(status) {
  return `
    <div class="addTaskMain">
            <div class="headlineAddTaskWindow">
              <b>Add Task</b>
            </div>
            <div>
              <div class="inputContainer">
                <form action="" onsubmit="return false">
                  <div class="inputSubContainer">
                  Title
                  <input
                    id="addTaskInputTitle"
                    type="text"
                    placeholder="Enter a Title"
                  />
                </div>
                <div class="inputSubContainer">
                  Description
                  <textarea
                    id="addTaskInputDescription"
                    type="text"
                    placeholder="Enter a Description"
                  ></textarea>
                </div>
                <div class="inputSubContainer">
                    <label for="category">Select task category:</label>
                    <select name="category" id="addTaskInputCategory">
                      <option value="userStory">Technical Task</option>
                      <option value="TechnicalTask">User Story</option>
                    </select>
                </div>
                <div class="editOverlayButtonContainer">
                  <button
                    onclick="closeAddTask()"
                    class="overlayDeleteButton addTaskCancelButton"
                  >
                    Cancel
                    <img
                      class="addContactCancelIcon"
                      src="assets/icons/close.png"
                      alt="Cancel"
                    />
                  </button>
                  <button
                    onclick="saveTask('${status}')"
                    class="overlaySaveButton createContactButtonOverlay"
                  >
                    Create Task
                    <img
                      class="contactCheckIcon"
                      src="assets/icons/check.png"
                      alt="Check"
                    />
                  </button>
                </div>
                </form>
              </div>
            </div>
            </div>
    `;
}
