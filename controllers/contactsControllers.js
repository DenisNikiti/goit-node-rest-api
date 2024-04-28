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
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const data = await listContacts();

  res.status(200).send(data);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const data = await getContactById(id);
  if (data === null) {
    res.status(404).send("Not Found");
  }

  res.status(200).send(JSON.stringify(data));
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const data = await removeContact(id);
  if (data === null) {
    res.status(404).send("Not Found");
  }
  res.status(200).send(JSON.stringify(data));
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
    res.status(400).send("Bad Request");
  }

  const data = await addContact(contact);
  res.status(201).send({ data });
};

export const updateContact = async (req, res) => {
  const { error, value } = updateContactSchema.validate(req.body, {
    convert: false,
  });
  if (typeof error !== "undefined") {
    res.status(400).send("Bad Request");
  }
  const { id } = req.params;
  const data = await updatecontact(id, req.body);

  if (data === null) {
    res.status(400).send("Bad Request");
  }
  res.status(200).send(data);
};
