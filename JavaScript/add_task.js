function openDropDownAssignContacts() {
  let dropdown = document.getElementById("dropdownContent");
  let arrow = document.getElementById("fakeInputArrow");
  if (dropdown.classList.contains("show")) {
    return;
  } else {
    dropdown.classList.toggle("show");
    arrow.classList.toggle("rotate");
  }
  if (dropdown.classList.contains("show")) {
    pullContactsToAssign(dropdown);
  }
}
