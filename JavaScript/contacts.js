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
  let contactOverlayEditMain = document.getElementById("contactOverlayEditMain");

  if (contactMainContainer) {
    contactMainContainer.style.display = "none";
  }
  if (labelContactCard) {
    labelContactCard.style.display = "none";
  }
  if (contactOverlayEditMain) {
    contactOverlayEditMain.style.display = "none";
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

  if (contacts) {
    renderGroupedContacts(contacts);
  }
}

/**
 * function sorts contacts and calls associated functions
 */
function renderGroupedContacts(contacts) {
  let contactsList = document.getElementById("contactsList");
  contactsList.innerHTML = "";
  const sortedContacts = sortContacts(contacts);
  let currentLetter = "";
  sortedContacts.forEach(([key, contact], index) => {
    const firstLetter = contact.name[0].toUpperCase();

    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      renderLetterHeader(currentLetter, contactsList);
    }
    renderContactCard(key, contact, index, contactsList);
  });
}

/**
 * function sorts contacts after name
 */
function sortContacts(contacts) {
  return Object.entries(contacts).sort((a, b) =>
    a[1].name.localeCompare(b[1].name)
  );
}

/**
 * function creates header for first-letter
 */
function renderLetterHeader(letter, container) {
  const parentDiv = document.createElement("div");
  parentDiv.className = "contactLetterHeader";

  const childDiv = document.createElement("div");
  childDiv.className = "contactLetter";
  childDiv.innerText = letter;

  const lineDiv = document.createElement("div");
  lineDiv.className = "contactLine";

  parentDiv.appendChild(lineDiv);
  parentDiv.appendChild(childDiv);
  container.appendChild(parentDiv);
}

/**
 * function creates contact-card for each contact
 */
function renderContactCard(key, contact, index, container) {
  const contactDiv = document.createElement("div");
  contactDiv.innerHTML = renderContactsSmallTemplate(key, contact, index);
  container.appendChild(contactDiv);
  setIcon(index, contact);
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
