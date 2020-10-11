const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const router = require('express').Router();
const {
  getAllCards, createCard, deleteCard, putLikeCard, deleteLikeCard,
} = require('../controllers/cards');

router.get('/', getAllCards);

router.post('/', celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().regex(/https?:\/{2}\S+/).required(),
  }),
}), createCard);

router.delete('/:id', celebrate({
  params: Joi.object({
    id: Joi.objectId(),
  }),
}), deleteCard);

router.put('/:id/likes', celebrate({
  params: Joi.object({
    id: Joi.objectId(),
  }),
}), putLikeCard);

router.delete('/:id/likes', celebrate({
  params: Joi.object({
    id: Joi.objectId(),
  }),
}), deleteLikeCard);

module.exports = router;
