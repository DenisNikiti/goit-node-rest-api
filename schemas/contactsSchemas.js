import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().required().min(5),
  phone: Joi.number().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(5),
  phone: Joi.number(),
});

export const updateFavoriteSchema = Joi.object({
  isFavorite: Joi.boolean().required(),
});
