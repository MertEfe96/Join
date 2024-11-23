/**
 * Onload function that calls fetchAmounts to retrieve task data
 */
function init() {
  fetchAmounts("/tasks");
}

/**
 * Passes task status variables to the template function for rendering
 * 
 * @param {number} countToDo - The Number of tasks with "to-do" status
 * @param {number} countInProgress - The Number of tasks with "in-progress" status
 * @param {number} countAwaitFeedback - The Number of tasks with "await-feedback" status
 * @param {number} countDone - The Number of tasks with "done" status
 * @param {number} taskCount - Total number of tasks
 */
function renderAmountSummary(countToDo, countInProgress, countAwaitFeedback, countDone, taskCount, prioUrgent) {
  let summaryBoardContainer = document.getElementById('summaryBoardContainer');
  summaryBoardContainer.innerHTML = summaryBoardTemplate(countToDo, countInProgress, countAwaitFeedback, countDone, taskCount, prioUrgent);
}

/**
 * Function retrieves data from BASE_URL and converts it to JSON
 * 
 * @param {string} path - The path added to the BASE_URL for fetching data
 */
async function fetchAmounts(path = "") {
  let response = await fetch(BASE_URL + path + ".json");
  let data = await response.json();
  filterStatus(data);
  console.log(data);
  
}

/**
 * Function filters status/priority of tasks and count them
 * 
 * @param {Object} data - An object containing task data, where each value has a "Status" or "Priority" property
 */
function filterStatus(data) {
  const asArray = Object.entries(data); 
  const filteredToDo = asArray.filter(([key, value]) => value.Status === "to-do");
  const filteredInProgress = asArray.filter(([key, value]) => value.Status === "in-progress");
  const filteredAwaitFeedback = asArray.filter(([key, value]) => value.Status === "await-feedback");
  const filteredDone = asArray.filter(([key, value]) => value.Status === "done");
  const filteredPrio = asArray.filter(([key, value]) => value.Priority === "prioUrgent");

  let countToDo = filteredToDo.length;
  let countInProgress = filteredInProgress.length;
  let countAwaitFeedback = filteredAwaitFeedback.length;
  let countDone = filteredDone.length;
  let taskCount = asArray.length;
  let prioUrgent = filteredPrio.length;
  renderAmountSummary(countToDo, countInProgress, countAwaitFeedback, countDone, taskCount, prioUrgent);
}