import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updatecontact,
} from "../services/contactsServices.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";
import contacts from "../models/Contacts.js";

export const getAllContacts = async (req, res) => {
  const data = await contacts.find();

  res.status(200).send(data);
  return;
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;

  const data = await contacts.findById(id);

  if (data === null) {
    return res.status(404).send({ message: "Not Found" });
  }

  res.status(200).send(data);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const data = await contacts.findByIdAndDelete(id);
  if (data === null) {
    res.status(404).send({ message: "Not Found" });
    return;
  }

  res.status(200).send(data);
};

export const createContact = async (req, res) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const { error, value } = createContactSchema.validate(contact, {
    convert: false,
  });
  if (typeof error !== "undefined") {
    res.status(400).send({ message: error.message });
    return;
  }

  const data = await contacts.create(contact);
  res.status(201).send(data);
};

export const updateContact = async (req, res) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const { error, value } = updateContactSchema.validate(contact, {
    convert: false,
  });
  if (typeof error !== "undefined") {
    res.status(400).send({ message: error.message });
    return;
  }
  if (
    contact.name !== undefined ||
    contact.email !== undefined ||
    contact.phone !== undefined
  ) {
    const { id } = req.params;
    const data = await updatecontact(id, contact);

    if (data === null) {
      res.status(400).send({ message: "Not found" });
      return;
    }
    res.status(200).send(data);
    return;
  }

  res.status(400).send({ message: "Body must have at least one field" });
};
async function updateStatusContact(id, favorite) {
  const contact = await contacts.findById(id);

  if (contact === null) {
    return null;
  }

  const data = await contacts.findByIdAndUpdate(
    id,
    { ...contact, favorite },
    { new: true }
  );
  return data;
}

export const updateFavorite = async (req, res) => {
  const { id } = req.params;

  const { isFavorite } = req.body;

  const { error, value } = updateFavoriteSchema.validate(isFavorite, {
    convert: false,
  });

  if (typeof error !== "undefined") {
    res.status(400).send(error.message);
  }

  const data = await updateStatusContact(id, isFavorite);
  if (data == null) {
    res.status(400).send({ message: "Not found" });
  }
  res.status(200).send(data);
};
