async function test() {
  let URL =
    "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";
  let response = await fetch(URL + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}

function openContact() {
  const contactMainContainer = document.getElementById('contactMainContainer');
  contactMainContainer.style.display = 'flex';
  setTimeout(() => contactMainContainer.classList.add('show'), 10);
  
  document.getElementById('contactCardSmall').classList.add('bgContactFocus');
  document.getElementById('contactCardSmall').classList.remove('contactCardSmall');
}