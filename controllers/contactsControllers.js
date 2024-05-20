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

  if (id.length < 24) {
    return res.status(404).send({ message: "Not Found" });
  }
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
    const data = await updatecontact(id, contact, { new: true });

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
  contact.favorite = favorite;

  return contact;
}

export const updateFavorite = async (req, res) => {
  const { id } = req.params;

  const { favorite } = req.body;

  const { error, value } = updateFavoriteSchema.validate(
    { favorite },
    {
      convert: false,
    }
  );

  if (typeof error !== "undefined") {
    res.status(400).send({ message: error.message });
    return;
  }

  const contact = await updateStatusContact(id, favorite);

  const data = await contacts.findByIdAndUpdate(id, contact, { new: true });
  if (data == null) {
    res.status(400).send({ message: "Not found" });
    return;
  }
  res.status(200).send(data);
};
