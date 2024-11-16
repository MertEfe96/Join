const BASE_URL =
  "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";

function renderLogin() {
  let div = document.getElementById("loginContent");
  div.innerHTML = loginTemplate();
}

function closeLogin() {
  let div = document.getElementById("loginContent");
  div.innerHTML = "";
}

function showDropDown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function onClickListAssigneesEventListener() {
  document
    .getElementById("assignedAddTaks")
    .addEventListener("mouseover", function () {
      listAssignees(0, "edit");
    });

  document
    .getElementById("assignedAddTaks")
    .addEventListener("click", function (event) {
      event.stopPropagation(); // Verhindert das Schließen der Liste beim Klicken
    });

  document
    .getElementById("assignedAddTaks")
    .addEventListener("click", function (event) {
      let dropdown = document.getElementById("dropdown-content");
      if (
        !dropdown.contains(event.target) &&
        event.target.id !== "assignedAddTaks"
      ) {
        dropdown.style.display = "none";
      }
    });
}
