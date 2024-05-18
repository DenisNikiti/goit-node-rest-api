import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
  register,
  login,
  logout,
  currentUsers,
} from "../controllers/contactsControllers.js";
import auth from "./middleware/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", auth, getAllContacts);

contactsRouter.get("/:id", auth, getOneContact);

contactsRouter.delete("/:id", auth, deleteContact);

contactsRouter.post("/", auth, createContact);

contactsRouter.put("/:id", auth, updateContact);
contactsRouter.patch("/:id/favorite", auth, updateFavorite);
contactsRouter.post("/users/register ", auth, register);
contactsRouter.post("/users/login", auth, login);
contactsRouter.post("/users/logout", auth, logout);
contactsRouter.get("/users/current", auth, currentUsers);
export default contactsRouter;
