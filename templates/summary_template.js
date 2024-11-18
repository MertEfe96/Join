function summaryBoardTemplate(count) {
  return `
  <div class="upperRow">
    <div class="toDoDisplay">
      <div class="editIconContainer">
        <img class="editIconSummary" src="assets/icons/editSummary.png" alt="Edit">
      </div>
      <div class="displayRightSection">
        <div class="toDoDoneAmount">${count}</div>
        <div class="toDoDone">To-do</div>
      </div>
    </div>
    <div class="doneDisplay">
      <div class="editIconContainer">
        <img class="doneIconSummary" src="assets/icons/doneSummary.png" alt="Done">
      </div>
      <div class="displayRightSection">
        <div class="toDoDoneAmount">1</div>
        <div class="toDoDone">Done</div>
      </div>
    </div>
  </div>
  <div class="middleRow">
    <div class="deadlineLeftSection">
      <div class="deadlineUrgencyStatusIcon">
        <img class="urgentIcon" src="assets/icons/urgentIcon.png" alt="Urgent">
      </div>
      <div class="amountStatusContainer">
        <div class="deadlineAmount">1</div>
        <div class="urgencyStatus">Urgent</div>
      </div>
    </div>
    <div class="seperatingLine"></div>
    <div class="deadlineRightSection">
      <div class="deadlineDate">October 16, 2022</div>
      <div>Upcoming Deadline</div>
    </div>
  </div>
  <div class="lowerRow">
    <div class="tasksBoardDisplay lowerRowSubContainer">
      <div class="lowerRowAmount">5</div>
      <div class="lowerRowType">Tasks in <br> Board</div>
    </div>
    <div class="tasksProgressDisplay lowerRowSubContainer">
      <div class="lowerRowAmount">2</div>
      <div class="lowerRowType">Tasks in <br> Progress</div>
    </div>
    <div class="feedbackDisplay lowerRowSubContainer">
      <div class="lowerRowAmount">2</div>
      <div class="lowerRowType">Awaiting <br> Feedback</div>
    </div>
  </div>
  `;
}