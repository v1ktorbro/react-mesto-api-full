const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getAllUsers, getUser, updInfoProfile, updAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/:id', getUser);

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
