const { celebrate, Joi } = require('celebrate');
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

router.delete('/:id', deleteCard);
router.put('/:id/likes', putLikeCard);
router.delete('/:id/likes', deleteLikeCard);

module.exports = router;
