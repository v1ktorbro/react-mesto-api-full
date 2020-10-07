const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const EmailError = require('../errors/EmailError');

module.exports.registerUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((findEmail) => {
    if (findEmail) {
      throw new EmailError(`${findEmail.email} уже зарегистрирован`);
    }
    return bcrypt.hash(password, 10).then((hash) => {
      User.create({
        email,
        password: hash,
        name: 'Заполните имя',
        about: 'Напишите немного о себе',
        avatar: 'https://...',
      }).then((user) => {
        return res.status(201).send({ data: { email } });
      }).catch(next);
    });
  }).catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password).then((jwt) => {
    return res.status(200).send({ token: jwt });
  }).catch(next);
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({}).then((users) => {
    if (!users) {
      throw new NotFound('Не удается загрузить список пользователей');
    }
    return res.status(200).send(users);
  }).catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id).then((user) => {
    if (!user) {
      throw new NotFound('Нет пользователя с таким id');
    }
    return res.status(200).send(user);
  }).catch(next);
};

module.exports.aboutMySelf = (req, res, next) => {
  User.findById(req.user).then((user) => {
    if (!user) {
      throw new NotFound('Неправильно передан id пользователя');
    }
    return res.status(200).send(user);
  }).catch(next);
};

module.exports.updInfoProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user,
    { name, about },
    { new: true, runValidators: true }).then((user) => {
    if (!user) {
      throw new NotFound('Неправильно передан id пользователя');
    }
    return res.status(200).send(user);
  }).catch(next);
};

module.exports.updAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user,
    { avatar },
    { new: true, runValidators: true }).then((user) => {
    if (!user) {
      throw new NotFound('Неправильно передан id пользователя');
    }
    return res.status(200).send(user);
  }).catch(next);
};
