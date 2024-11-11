function renderContactsSmallTemplate(key, contact) {
  return `
<div class="contactCardSmall" id="${key}" onclick="openContact(${key})">
  <div class="contactInitialsSmall">AM</div>
  <div class="contactInfoSmall">
    <div class="contactName">${contact.name}</div>
    <div class="contactMail">${contact.email}</div>
  </div>
</div>
`;
}
