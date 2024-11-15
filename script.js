const BASE_URL =
  "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";

function renderLogin() {
  let div = document.getElementById("loginContent");
  div.innerHTML = loginTemplate();
}

function closeLogin() {
  let div = document.getElementById("loginContent");
  div.innerHTML = "";
}
