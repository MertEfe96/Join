async function test() {
  let URL =
    "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";
  let response = await fetch(URL + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}

/**
 * Function opens contact-details after a contact has been clicked at the cantact-list
 */
function openContact() {
  const contactMainContainer = document.getElementById('contactMainContainer');
  contactMainContainer.style.display = 'flex';
  setTimeout(() => contactMainContainer.classList.add('show'), 10);
  
  document.getElementById('contactCardSmall').classList.add('bgContactFocus');
  document.getElementById('contactCardSmall').classList.remove('contactCardSmall');
}

/**
 * Function opens overlay-window to edit a contact
 */
function editContact() {
  const overlayMain = document.getElementById('contactOverlayEditMain');
  overlayMain.style.display = 'flex';

  const overlayEdit = document.getElementById('contactOverlayEdit');
  setTimeout(() => overlayEdit.classList.add('show'), 10);
}

/**
 * Function closes edit-overlay-window
 */
function closeContactEdit() {
  const overlayEdit = document.getElementById('contactOverlayEdit');
  
  overlayEdit.classList.remove('show');
  setTimeout(() => {
    document.getElementById('contactOverlayEditMain').style.display = 'none';
  }, 200);
}