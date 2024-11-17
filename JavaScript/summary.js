function renderAmountSummary() {
  let summaryBoardContainer = document.getElementById('summaryBoardContainer');
  let toDoCard = document.getElementById('ToDoCard');
  let count = toDoCard.childElementCount;
  summaryBoardContainer.innerHTML = summaryBoardTemplate(count);
}