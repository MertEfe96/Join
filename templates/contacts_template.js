function renderContactsSmallTemplate(key, contact, i) {
  // Dynamically get initials from the contact's name
  const initials = contact.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return `
<div class="contactCardSmall" id="${key}" onclick="openContact('${key}', '${contact.name}', '${contact.email}', '${contact.number}')">
  <div class="contactInitialsSmall" id="contactInitialsSmall${i}">${initials}</div>
  <div class="contactInfoSmall">
    <div class="contactName">${contact.name}</div>
    <div class="contactMail">${contact.email}</div>
  </div>
</div>
  `;
}
// ${key}, ${contact.name}, ${contact.email}, ${contact.number}
function renderContactLargeTemplate(key, name, mail, number) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
  return `
<div class="contactInicialsContainer">
              <div class="contactInitialsSmall contactInicialLarge">${initials}</div>
              <div>
                <div class="contactMainName">${name}</div>
                <div class="editDeleteContainer">
                  <div class="editDeleteSubContainer" onclick="editContact(${key})">
                    <img
                      class="delteEditIcon"
                      src="assets/icons/edit.png"
                      alt="Edit" />
                    <div class="editIconContainer">Edit</div>
                  </div>
                  <div class="editDeleteSubContainer" onclick="deleteContact('${key}')">
                    <img
                      class="delteEditIcon"
                      src="assets/icons/delete.png"
                      alt="Delete" />
                    <div class="deleteIconContainer">Delete</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="contactInfo">Contact Information</div>
            <div class="contactEmailPhoneContainer">
              <div class="contactEmailPhone">Email</div>
              <div class="contactMail">${mail}</div>
            </div>
            <div class="contactEmailPhoneContainer">
              <div class="contactEmailPhone">Phone</div>
              <div>${number}</div>
            </div>
  `;
}
{
  /* <div class="contactInitialsSmall contactInicialLarge" id="contactInitialsLarge${i}>AM</div>
<div>
  <div class=" contactMainName">${name}</div>
<div class="editDeleteContainer">
  <div class="editDeleteSubContainer" onclick="editContact(${key})">
    <img class="delteEditIcon" src="assets/icons/edit.png" alt="Edit" />
    <div class="editIconContainer">Edit</div>
  </div>
  <div class="editDeleteSubContainer" onclick="closeContact(${key})">
    <img class="delteEditIcon" src="assets/icons/delete.png" alt="Delete" />
    <div class="deleteIconContainer">Delete</div>
  </div>
</div>
</div>
<div class="contactInfo">Contact Information</div>
<div class="contactEmailPhoneContainer">
  <div class="contactEmailPhone">Email</div>
  <div class="contactMail">${mail}</div>
</div>
<div class="contactEmailPhoneContainer">
  <div class="contactEmailPhone">Phone</div>
  <div>${number}</div>
</div> */
}
