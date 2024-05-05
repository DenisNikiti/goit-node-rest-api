import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  // ...твій код. Повертає масив контактів.
  const data = await fs.readFile(contactsPath, { encoding: "utf8" });

  return JSON.parse(data);
}

async function getContactById(id) {
  // ...твій код. Повертає об'єкт контакту з таким id. Повертає null, якщо контакт з таким id не знайдений.

  const data = await listContacts();

  const contact = data.find((contact) => contact.id === id);

  if (contact === undefined) {
    return null;
  }
  return contact;
}

async function removeContact(id) {
  // ...твій код. Повертає об'єкт видаленого контакту. Повертає null, якщо контакт з таким id не знайдений.
  const data = await listContacts();
  const index = data.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  const removeContact = data[index];
  data.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return removeContact;
}

async function addContact({ name, email, phone }) {
  // ...твій код. Повертає об'єкт доданого контакту (з id).
  const data = await listContacts();
  const newContact = { name, email, phone, id: crypto.randomUUID() };

  await fs.writeFile(contactsPath, JSON.stringify([...data, newContact]));
  return newContact;
}

async function updatecontact(id, contact) {
  const data = await listContacts();

  const index = data.findIndex((contact) => contact.id === id);
  if (index === -1) {
    return null;
  }
  const oldContact = data[index];

  const {
    name = oldContact.name,
    email = oldContact.email,
    phone = oldContact.phone,
  } = contact;
  console.log(contact);
  const newConctact = { ...oldContact, name, email, phone };

  data.splice(index, newConctact);
  await fs.writeFile(contactsPath, JSON.stringify(data));
  return newConctact;
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updatecontact,
};
