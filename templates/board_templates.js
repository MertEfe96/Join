function onload() {
  console.log("test");
  loadData();
}

const BASE_URL =
  "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData() {
  let response = await fetch(BASE_URL + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}
