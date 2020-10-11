const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

module.exports.getAllCards = (req, res, next) => {
  Card.find({}).then((cards) => {
    if (!cards) {
      throw new NotFound('Не удается загрузить карточки');
    }
    return res.status(200).send(cards);
  }).catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user }).then((card) => res.status(201).send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findOne({ _id: id }).then((currentCard) => {
    if (!currentCard) {
      throw new NotFound('Карточка не существует, либо уже была удалена.');
    }
    if (currentCard.owner.toString() !== req.user._id) {
      throw new Forbidden('Вы не можете удалять чужую карточку');
    }
    return Card.deleteOne({ _id: id }).then(() => res.status(200).send('Карточка удалена.'));
  }).catch(next);
};

module.exports.putLikeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(id,
    { $addToSet: { likes: req.user } },
    { new: true }).then((findCard) => {
    if (!findCard) {
      throw new NotFound('Вы не можете поставить лайк — карточки не существует.');
    }
    return res.status(200).send(findCard);
  }).catch(next);
};

module.exports.deleteLikeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(id,
    { $pull: { likes: req.user._id } },
    { new: true }).then((findCard) => {
    if (!findCard) {
      throw new NotFound('Вы не можете удалить лайк — карточки не существует.');
    }
    return res.status(200).send(findCard);
  }).catch(next);
};
