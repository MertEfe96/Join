async function test() {
  let URL =
    "https://join-26d58-default-rtdb.europe-west1.firebasedatabase.app/";
  let response = await fetch(URL + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}
