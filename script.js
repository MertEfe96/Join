const BASE_URL =
  "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";

function renderSignUp() {
  let div = document.getElementById("loginContent");
  div.innerHTML = signUpTemplate();
}

function closeLogin() {
  let div = document.getElementById("loginContent");
  div.innerHTML = "";
}

function renderLogin() {
  let div = document.getElementById("loginContent");
  div.innerHTML = loginTemplate();
}

document.addEventListener("click", function (e) {
  let dropdown = document.getElementById("dropdownContent");
  let arrow = document.getElementById("fakeInputArrow");
  let assignedAddTasks = document.getElementById("assignedAddTaks");
  if (dropdown && arrow && assignedAddTasks) {
    let isInsideDropdown = dropdown.contains(e.target);
    let isInsideAssignedAddTasks = assignedAddTasks.contains(e.target);
    if (
      !isInsideDropdown &&
      !isInsideAssignedAddTasks &&
      dropdown.classList.contains("show")
    ) {
      dropdown.classList.remove("show");
      arrow.classList.remove("rotate");
    }
    if (isInsideAssignedAddTasks && !dropdown.classList.contains("show")) {
      dropdown.classList.add("show");
      arrow.classList.add("rotate");
      pullContactsToAssign(dropdown);
    }
  }
});

async function pullContactsToAssign(dropdown) {
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  let contacts = data.contacts;

  if (contacts) {
    renderContactsToAssign(dropdown, contacts);
  }
}

function renderContactsToAssign(dropdown, contacts) {
  dropdown.innerHTML = "";
  const sortedContacts = sortContacts(contacts);
  sortedContacts.forEach(([key, contact], index) => {
    dropdown.innerHTML += assigneContactTemplate(key, contact, index);
  });
}

function changePrio(prio) {
  const prioritieIcons = ["prioUrgent", "prioMedium", "prioLow"];
  let prioId = prioritieIcons.indexOf(prio);
  prioritieIcons.forEach((prioritie, i) => {
    document.getElementById(prioritie).classList.add(prioritie + "Color");
    document.getElementById(prioritie).classList.remove(prioritie + "White");
    document
      .getElementById(prioritie + "Div")
      .classList.remove(prioritie + "ColorDiv");
  });
  document
    .getElementById(prioritieIcons[prioId])
    .classList.add(prioritieIcons[prioId] + "White");
  document.getElementById(prioritieIcons[prioId]).classList.add("chosenPrio");
  document
    .getElementById(prioritieIcons[prioId] + "Div")
    .classList.add(prioritieIcons[prioId] + "ColorDiv");
  document
    .getElementById(prioritieIcons[prioId])
    .classList.remove(prioritieIcons[prioId] + "Color");
}

function setMinDate() {
  const today = new Date().toISOString().slice(0, 10);

  document.getElementsByName("date")[0].min = today;
}

async function postSignUp(data = "") {
  let nameSignup = document.getElementById("nameSignUp").value;
  let emailSignUp = document.getElementById("emailSignUp").value;
  let passwordSignUp = document.getElementById("passwordSignUp").value;
  let passwordConfirmSignUp = document.getElementById(
    "passwordConfirmSignUp"
  ).value;
  let userColor = AddColorToUser();
  let signUpCheckbox = document.getElementById("signUpCheckbox").checked;

  if (
    !nameSignup ||
    !emailSignUp ||
    !passwordSignUp ||
    !passwordConfirmSignUp
  ) {
    alert("Bitte füllen Sie alle Felder aus.");
    return;
  }
  if (passwordSignUp !== passwordConfirmSignUp) {
    alert("Passwörter stimmen nicht überein.");
    return;
  }
  if (!signUpCheckbox) {
    alert("Bitte stimmen Sie den Bedingungen zu.");
    return;
  }
  data = {
    name: nameSignup,
    email: emailSignUp,
    password: passwordSignUp,
    passwordconfirm: passwordConfirmSignUp,
    color: userColor,
  };
  await fetch(BASE_URL + "users/.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  clearInputSignUp();
  renderLogin();
}

async function loginRequest() {
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  let users = data.users;
  let emailLogin = document.getElementById("emailLogin").value;
  let passwordLogin = document.getElementById("passwordLogin").value;

  for (let userId in users) {
    if (
      users[userId].email === emailLogin &&
      users[userId].password === passwordLogin
    ) {
      console.log("Erfolgreich Angemeldet");
      clearInputLogin();
      break;
    } else {
      console.log("Email oder Password ist Falsch !");
    }
  }
}
async function loginRequest() {
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  let users = data.users;
  let emailLogin = document.getElementById("emailLogin").value;
  let passwordLogin = document.getElementById("passwordLogin").value;

  for (let userId in users) {
    if (
      users[userId].email === emailLogin &&
      users[userId].password === passwordLogin
    ) {
      console.log("Erfolgreich Angemeldet");
      clearInputLogin();
      break;
    } else {
      console.log("Email oder Password ist Falsch !");
    }
  }
}

function clearInputSignUp() {
  document.getElementById("nameSignUp").value = "";
  document.getElementById("emailSignUp").value = "";
  document.getElementById("passwordSignUp").value = "";
  document.getElementById("passwordConfirmSignUp").value = "";
}
function clearInputSignUp() {
  document.getElementById("nameSignUp").value = "";
  document.getElementById("emailSignUp").value = "";
  document.getElementById("passwordSignUp").value = "";
  document.getElementById("passwordConfirmSignUp").value = "";
}

function clearInputLogin() {
  document.getElementById("emailLogin").value = "";
  document.getElementById("passwordLogin").value = "";
}

function showPassword() {
  let input = document.getElementById("passwordSignUp");
  input.type = input.type === "password" ? "text" : "password";
}

function showConfirmPassword() {
  let input = document.getElementById("passwordConfirmSignUp");
  input.type = input.type === "password" ? "text" : "password";
}

function showDropDown() {
  dropdownHeader.classList.toggle("show");
}
