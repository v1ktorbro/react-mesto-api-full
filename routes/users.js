const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const router = require('express').Router();
const {
  getAllUsers, getUser, updInfoProfile, updAvatar, aboutMySelf,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', celebrate({
  body: Joi.object({
    _id: Joi.objectId(),
  }),
}), aboutMySelf);

router.get('/:id', celebrate({
  params: Joi.object({
    id: Joi.objectId(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required(),
  }),
}), updInfoProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object({
    avatar: Joi.string().regex(/https?:\/{2}\S+/).required(),
  }),
}), updAvatar);

module.exports = router;
