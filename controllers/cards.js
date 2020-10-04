const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const { getUserId } = require('../middlewares/auth');

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
  Card.create({ name, link, owner: getUserId(req) }).then((card) => {
    return res.status(201).send(`${card}`);
  }).catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const idDeleteCard = req.params.id;
  Card.findOne({ _id: idDeleteCard }).then((currentCard) => {
    if (!currentCard) {
      throw new NotFound('Карточка не существует, либо уже была удалена.');
    }
    if (currentCard.owner.toString() !== getUserId(req)) {
      throw new NotFound('Вы не можете удалять чужую карточку');
    }
    return Card.deleteOne({ _id: idDeleteCard }).then(() => {
      return res.status(200).send('Карточка удалена.');
    });
  }).catch(next);
};

module.exports.putLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id,
    { $addToSet: { likes: getUserId(req) } },
    { new: true }).then((findCard) => {
    if (!findCard) {
      throw new NotFound('Вы не можете поставить лайк — карточки не существует.');
    }
    return res.status(200).send('Лайк карточке успешно поставлен.');
  }).catch(next);
};

module.exports.deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.id,
    { $pull: { likes: getUserId(req) } },
    { new: true }).then((findCard) => {
    if (!findCard) {
      throw new NotFound('Вы не можете удалить лайк — карточки не существует.');
    }
    return res.status(200).send('Вы удалили лайк у карточки');
  }).catch(next);
};
