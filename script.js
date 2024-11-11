const BASE_URL =
  "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";

let contactsArray = [];

/**
 * Function opens contact-details after a contact has been clicked at the cantact-list
 */
function openContact(key, name, mail, number) {
  const contactMainContainer = document.getElementById("contactMainContainer");
  const toggleCheckBox = document.getElementById("toggleContactCard");

  contactMainContainer.style.display = "flex";
  contactMainContainer.innerHTML = renderContactLargeTemplate(
    key,
    name,
    mail,
    number
  );
  setTimeout(() => contactMainContainer.classList.add("show"), 10);
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
  let name = document.getElementById("addContactInputName").value;
  let mail = document.getElementById("addContactInputMail").value;
  let phone = document.getElementById("addContactInputPhone").value;
  data = {name: name, email: mail, number: phone};
  let response = await fetch(BASE_URL + "contacts/.json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

async function pullContacts() {
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json(); // Beinhaltet das gesamte Objekt aus der Datenbank
  let contacts = data.contacts; // Zugriff auf das 'contacts' Objekt
  let contactsList = document.getElementById("contactsList");
  contactsList.innerHTML = ""; // Lösche vorherige Inhalte

  // Überprüfe, ob Kontakte geladen wurden und iteriere durch sie
  if (contacts) {
    let i = 0;
    for (let key in contacts) {
      let contact = contacts[key];
      // Erstelle für jeden Kontakt ein neues div und füge es dem contactsList hinzu
      let contactDiv = document.createElement("div");
      contactDiv.innerHTML = renderContactsSmallTemplate(key, contact, i);
      contactsList.appendChild(contactDiv);
      setIcon(i, contact);
      i++;
    }
  }
  console.log("Kontakte geladen: ", contacts);
}

function setIcon(i, contact) {
  let str = contact.name;
  let matches = str.match(/\b(\w)/g); // ['J','S','O','N']
  let acronym = matches.join(""); // JSON
  let iconDiv = document.getElementById(`contactInitialsSmall${i}`);
  iconDiv.innerHTML = acronym;
}

async function deleteContact(key) {
  let response = await fetch(BASE_URL + "contacts/" + key + "/.json", {
    method: "DELETE",
  });
}
