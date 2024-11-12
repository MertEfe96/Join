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
 * function closes/deletes contact-details and contact-card
 */
function closeContact() {
  let contactMainContainer = document.getElementById("contactMainContainer");
  let labelContactCard = document.getElementById("labelContactCard");

  if (contactMainContainer) {
    contactMainContainer.style.display = "none";
  }
  if (labelContactCard) {
    labelContactCard.style.display = "none";
  }
}

/**
 * Function opens overlay-window to edit a contact
 */
async function openEditContact(key) {
  const overlayMain = document.getElementById("contactOverlayEditMain");
  const overlayEdit = document.getElementById("contactOverlayEdit");
  const overlayEditRight = document.getElementById(
    "contactOverlayRightSection"
  );
  let contact = await pullSingleContact(key);
  overlayEditRight.innerHTML = renderEditContactTemplate(contact, key);
  overlayMain.style.display = "flex";
  setTimeout(() => overlayMain.classList.add("show"), 10);
  setTimeout(() => overlayEdit.classList.add("show"), 10);
}

async function editContact(key) {
  let name = document.getElementById("inputEditName").value;
  let mail = document.getElementById("inputEditMail").value;
  let phone = document.getElementById("inputEditNumber").value;
  data = {name: name, email: mail, number: phone};
  let response = await fetch(BASE_URL + "contacts/" + key + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  pullContacts();
  closeContactEdit();
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
 * function saves the contact in the API
 */
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
  pullContacts();
  closeAddContact();
}

/**
 * function fetches the contacts saved in the API
 */
async function pullContacts() {
  let response = await fetch(BASE_URL + ".json");
  let data = await response.json();
  let contacts = data.contacts;
  let contactsList = document.getElementById("contactsList");
  contactsList.innerHTML = "";
  // check if contacts get fetched and iterate throught them
  if (contacts) {
    let i = 0;
    for (let key in contacts) {
      let contact = contacts[key];
      // create a new div for ever contact and render it into the list
      let contactDiv = document.createElement("div");
      contactDiv.innerHTML = renderContactsSmallTemplate(key, contact, i);
      contactsList.appendChild(contactDiv);
      setIcon(i, contact);
      i++;
    }
  }
}

async function pullSingleContact(key) {
  let response = await fetch(BASE_URL + "contacts/" + key + "/.json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * function deletes the contacts saved in the API
 */
async function deleteContact(key) {
  let response = await fetch(BASE_URL + "contacts/" + key + "/.json", {
    method: "DELETE",
  });
  pullContacts();
  closeContact();
}

/**
 * function creates the icon for the contact by taking the
 * first letter of every part of its name
 */
function setIcon(i, contact) {
  const initials = contact.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  let iconDiv = document.getElementById(`contactInitialsSmall${i}`);
  iconDiv.innerHTML = initials;
}
