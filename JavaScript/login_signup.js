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
  let contactData = {
    name: nameSignup,
    email: emailSignUp,
    color: userColor,
  };
  await postContact(contactData);
  clearInputSignUp();
  renderLogin();
}

async function postContact(contactData) {
  await fetch(BASE_URL + "contacts/.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
}

async function loginRequest() {
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  let users = data.users;
  let emailLogin = document.getElementById("emailLogin").value;
  let passwordLogin = document.getElementById("passwordLogin").value;
  let rememberCheck = document.getElementById("rememberCheck");
  for (let userId in users) {
    if (
      users[userId].email === emailLogin &&
      users[userId].password === passwordLogin
    ) {
      if (rememberCheck.checked) {
        let user = {...users[userId], id: userId}; //Spread-Syntax, kopiert den Objekt fügt danach extra die ID hinzu
        saveUserInLocal(user);
      } else {
        let user = {...users[userId], id: userId};
        saveUserInSession(user);
      }
      console.log("Erfolgreich Angemeldet");
      clearInputLogin();
      window.location.href = "sumary.html";
      userLocal = {...users[userId], id: userId};
    } else {
      console.log("Email oder Password ist Falsch !");
    }
  }
}

async function guestLogin() {
  try {
    let response = await fetch(BASE_URL + ".json");
    let data = await response.json();
    const guestUserId = "guest";
    const guestUser = data.users[guestUserId];

    if (guestUser) {
      console.log("Guest Login erfolgreich!");

      let user = {...guestUser, id: guestUserId};
      renderUserIcon();
      saveUserInSession(user);
      window.location.href = "sumary.html";
    } else {
      console.error("Gastbenutzer nicht gefunden!");
    }
  } catch (error) {
    console.error("Fehler beim Gast-Login:", error);
  }
}

function logOut() {
  localStorage.clear();
  sessionStorage.clear();
  renderLogin();
}

function saveUserInLocal(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

function saveUserInSession(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
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

function renderUserIcon() {
  let userIcon = document.getElementById("userIcon");
  let user = JSON.parse(localStorage.getItem("user"));

  if (user && user.name) {
    let initials = getInitials(user.name);
    userIcon.innerHTML = initials;
  } else {
    user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.name) {
      let initials = getInitials(user.name);
      userIcon.innerHTML = initials;
    }
  }
}

function getInitials(name) {
  let parts = name.split(" ");
  return parts.length > 1
    ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
    : name[0].toUpperCase();
}
