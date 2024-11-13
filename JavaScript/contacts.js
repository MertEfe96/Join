let userColorsArray = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8", "#1FD7C1", "#FF745E", "#FFA35E", "#FC71FF", "#FFC701", "#0038FF", "#C3FF2B", "#FFE62B", "#FF4646", "#FFBB2B"];


function AddColorToUser() {
  let randomNumber = Math.floor(Math.random() * 15);
  let userColor = userColorsArray[randomNumber];
  return userColor;
}

/**
 * This function opens contact-details after
 * a contact has been clicked at the cantact-list
 *
 * @param {*} key the key is the ID of the contact in the API
 * @param {*} name the name of the contact
 * @param {*} mail the E-Mail adress of the contact
 * @param {*} number the phone number of the contact
 */
function openContact(key, name, mail, number,color) {
  const contactMainContainer = document.getElementById("contactMainContainer");
  const toggleCheckBox = document.getElementById("toggleContactCard");
  contactMainContainer.style.display = "flex";
  contactMainContainer.innerHTML = renderContactLargeTemplate(
    key,
    name,
    mail,
    number,
    color
  );
  setTimeout(() => contactMainContainer.classList.add("show"), 10);
}

/**
 * This function closes contact-details and contact-card
 */
function closeContact() {
  let contactMainContainer = document.getElementById("contactMainContainer");
  let labelContactCard = document.getElementById("labelContactCard");
  let contactOverlayEditMain = document.getElementById(
    "contactOverlayEditMain"
  );

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
 * This function opens the overlay-window to edit a contact
 *
 * @param {*} key the key is the ID of the contact in the API
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

/**
 * THis function is used to edid a contact and save the changes in the API
 *
 * @param {*} key the key is the ID of the contact in the API
 */
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
 * This function closes overlay-window
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
 * This function opens add-contact-form
 */
function addContact() {
  const addContactMain = document.getElementById("addContactMain");
  const addContact = document.getElementById("addContact");
  addContactMain.style.display = "flex";
  setTimeout(() => addContactMain.classList.add("show"), 10);
  setTimeout(() => addContact.classList.add("show"), 10);
}

/**
 * This function closes add-contact-form
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
 * THis function empties input-value from add-contact-form
 */
function emptyInputAddContact() {
  document.getElementById("addContactInputName").value = "";
  document.getElementById("addContactInputMail").value = "";
  document.getElementById("addContactInputPhone").value = "";
}

/**
 * This function saves the contact in the API
 */
async function saveContact(data = "") {
  let name = document.getElementById("addContactInputName").value;
  let mail = document.getElementById("addContactInputMail").value;
  let phone = document.getElementById("addContactInputPhone").value;
  let userColor = AddColorToUser();
  data = {name: name, email: mail, number: phone,color: userColor};
  let response = await fetch(BASE_URL + "contacts/.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  pullContacts();
  closeAddContact();
}

/**
 * This function fetches the contacts saved in the API
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
 * This function sorts and renders contacts and calls associated functions
 *
 * @param {*} contacts this is the whole contacs list saved in the API,
 *                      given by the pullContacts() funtion
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
 * This function sorts the contacts by name
 *
 * @param {*} contacts this is the whole contacs list saved in the API,
 *                      given by the pullContacts() funtion
 * @returns an array of arrays with the soreted names
 */
function sortContacts(contacts) {
  return Object.entries(contacts).sort((a, b) =>
    a[1].name.localeCompare(b[1].name)
  );
}

/**
 * This function is used to create the headline for each new first letter
 * in the contact list
 *
 * @param {*} letter is the list letter of a name in the contact list
 * @param {*} container is the div with the ID="contactsList", used to show
 *                      all the contacts
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
 *
 * @param {*} inedx the index of the for-loop in the renderGroupedContacts()
 *              function. Used to get the correct div in which the icon it to be displayed
 * @param {*} contact this is the object given in the renderGroupedContacts()
 *              function wich houses the contact information
 * @param {*} container is the div with the ID="contactsList", used to show
 *                      all the contacts
 * @param {*} key the key is the ID of the contact in the API
 */
function renderContactCard(key, contact, index, container) {
  const contactDiv = document.createElement("div");
  contactDiv.innerHTML = renderContactsSmallTemplate(key, contact, index);
  container.appendChild(contactDiv);
  setIcon(index, contact);
}

/**
 * This function is used to get the contact info from the API to be used
 * in the openEditContact() funtion
 *
 * @param {*} key the key is the ID of the contact in the API
 * @returns the contact info of the fetched contact
 */
async function pullSingleContact(key) {
  let response = await fetch(BASE_URL + "contacts/" + key + "/.json");
  let responseToJson = await response.json();
  return responseToJson;
}

/**
 * This function is used to delete a contact from the API
 *
 * @param {*} key the key is the ID of the contact in the API
 */
async function deleteContact(key) {
  let response = await fetch(BASE_URL + "contacts/" + key + "/.json", {
    method: "DELETE",
  });
  pullContacts();
  closeContact();
}

/**
 * This function uses the first to letters of the contacts name to create
 * the Icon displayed in the contact list
 *
 * @param {*} i i is the index of the for-loop in the renderGroupedContacts()
 *              function. Used to get the correct div in which the icon it to be displayed
 * @param {*} contact this is the object given in the renderGroupedContacts()
 *              function wich houses the contact information
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





