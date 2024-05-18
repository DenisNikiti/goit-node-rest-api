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
  registerUsersShema,
} from "../schemas/contactsSchemas.js";
import contacts from "../models/Contacts.js";
import Users from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllContacts = async (req, res) => {
  const data = await contacts.find({ owner: req.user.id });

  res.status(200).send(data);
  return;
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;

  const data = await contacts.findById(id);

  if (data === null) {
    return res.status(404).send({ message: "Not Found" });
  }
  if (data.owner.toString() !== req.user.id) {
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
    ownner: req.user.id,
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
    const data = await contacts.findByIdAndUpdate(id, contact, { new: true });

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

  if (typeof favorite !== "boolean") {
    res.status(400).send({ message: "Body must have true/false" });
    return;
  }

  const contact = await updateStatusContact(id, favorite);

  const data = await contacts.findByIdAndUpdate(id, contact, { new: true });
  if (data == null) {
    res.status(400).send({ message: "Not found" });
  }
  res.status(200).send(data);
};

export const register = async (req, res) => {
  const { email, password } = req.body;
  const normalaziEmail = email.toLowerCase();
  const user = {
    email: normalaziEmail,
    password,
  };
  const { error, value } = registerUsersShema.validate(user, {
    convert: false,
  });

  if (typeof error !== "undefined") {
    res.status(400).send({ message: error.message });
    return;
  }

  const data = await Users.findOne({ email: normalaziEmail });

  if (user !== null) {
    return res.status(409).send({
      message: "Email in use",
    });
  }

  const passwordhash = await bcrypt.hash(password, 20);
  const result = await Users.create({
    email: normalaziEmail,
    password: passwordhash,
  });
  res.status(201).send({ message: "Registration " });
};

export const login = async (req, body) => {
  const { email, password } = req.body;
  const normalaziEmail = email.toLowerCase();
  const user = {
    email: normalaziEmail,
    password,
  };
  const { error, value } = registerUsersShema.validate(user, {
    convert: false,
  });

  if (typeof error !== "undefined") {
    res.status(400).send({ message: error.message });
    return;
  }
  const data = await Users.findOne({ email: normalaziEmail });
  if (data === null) {
    return res.status(401).send({
      message: "Email or password is wrong",
    });
  }
  const isMath = await bcrypt.compare(password, data.password);
  if (isMath === false) {
    return res.status(401).send({
      message: "Email or password is wrong",
    });
  }
  const token = jwt.sign(
    { id: data._id, email: data.email },
    process.env.JWT_SECRET,
    {}
  );
  await contacts.findByIdAndUpdate(data._id, { token });
  res.status(200).send({
    token,
    user: {
      email: data.email,
      subscription: "starter",
    },
  });
};

export const logout = async (req, res) => {
  await contacts.findByIdAndUpdate(req.user.id, { token: null });
  res.status(204).end();
};

export const currentUsers = async (req, res) => {
  const { email } = req.user;
  return res.status(200).send({
    email,
    subscription: "starter",
  });
};
