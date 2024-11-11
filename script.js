// const BASE_URL =
//   "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";

// async function test() {
//   let URL =
//     "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";
//   let response = await fetch(URL + ".json");
//   let responseToJson = await response.json();
//   console.log(responseToJson);
// }

/**
 * Function opens contact-details after a contact has been clicked at the cantact-list
 */
function openContact() {
  const contactMainContainer = document.getElementById("contactMainContainer");
  const toggleCheckBox = document.getElementById("toggleContactCard");

  if (toggleCheckBox.checked) {
    contactMainContainer.style.display = "none";
    contactMainContainer.classList.remove("show");
  } else {
    contactMainContainer.style.display = "flex";
    setTimeout(() => contactMainContainer.classList.add("show"), 10);
  }
}

/**
 * Function opens overlay-window to edit a contact
 */
function editContact() {
  const overlayMain = document.getElementById("contactOverlayEditMain");
  const overlayEdit = document.getElementById("contactOverlayEdit");

  overlayMain.style.display = "flex";
  setTimeout(() => overlayMain.classList.add("show"), 10);
  setTimeout(() => overlayEdit.classList.add("show"), 10);
}

/**
 * Function closes overlay-window
 */
function closeContactEdit() {
  const overlayEdit = document.getElementById("contactOverlayEdit");
  const overlayMain = document.getElementById("contactOverlayEditMain");

  overlayEdit.classList.remove("show");
  setTimeout(() => {
    overlayMain.classList.remove("show");

    setTimeout(() => {
      overlayMain.style.display = "none";
    }, 100);
  }, 100);
}

/**
 * function opens add-contact-form
 */
function addContact() {
  const addContactMain = document.getElementById("addContactMain");
  const addContact = document.getElementById("addContact");

  addContactMain.style.display = "flex";
  setTimeout(() => addContactMain.classList.add("show"), 10);
  setTimeout(() => addContact.classList.add("show"), 10);
}

/**
 * function closes add-contact-form
 */
function closeAddContact() {
  const addContactMain = document.getElementById("addContactMain");
  const addContact = document.getElementById("addContact");

  addContact.classList.remove("show");
  setTimeout(() => {
    addContactMain.classList.remove("show");
    setTimeout(() => {
      addContactMain.style.display = "none";
    }, 100);
  }, 100);
  emptyInputAddContact();
}

/**
 * function empties input-value from add-contact-form
 */
function emptyInputAddContact() {
  document.getElementById("addContactInputName").value = "";
  document.getElementById("addContactInputMail").value = "";
  document.getElementById("addContactInputPhone").value = "";
}

/**
 * function closes/deletes contact-details and contact-card
 */
function closeContact() {
  document.getElementById("contactMainContainer").style.display = "none";
  document.getElementById("labelContactCard").style.display = "none";
}

async function saveContact(path = "", data = "") {
  const BASE_URL =
    "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";
  let name = document.getElementById("addContactInputName").value;
  let mail = document.getElementById("addContactInputMail").value;
  let phone = document.getElementById("addContactInputPhone").value;
  data = {name: name, email: mail, number: phone};
  path = name.toLowerCase();
  let response = await fetch(BASE_URL + "contacts/" + path + "/.json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
