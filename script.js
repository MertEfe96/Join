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
  const overlayEdit = document.querySelector('.contactOverlayEdit');
  
  overlayMain.style.display = 'flex';
  setTimeout(() => overlayMain.classList.add('show'), 10);
  setTimeout(() => overlayEdit.classList.add('show'), 10);
}

/**
 * Function closes overlay-window
 */
function closeContactEdit() {
  const overlayEdit = document.querySelector('.contactOverlayEdit');
  const overlayMain = document.getElementById('contactOverlayEditMain');

  overlayEdit.classList.remove('show');
  setTimeout(() => {
    overlayMain.classList.remove('show');
    
    setTimeout(() => {
      overlayMain.style.display = 'none';
    }, 100);
  }, 100);
}