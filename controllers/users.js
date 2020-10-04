const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const Unauthorize = require('../errors/Unauthorized');
const { getUserId } = require('../middlewares/auth');
const EmailError = require('../errors/EmailError');

const { NODE_ENV, JWT_SECRET } = process.env;

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
        return res.status(201).send(user);
      }).catch(next);
    });
  }).catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new Unauthorize('Пароль и/или почта введены неверно');
    }
    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new Unauthorize('Пароль и/или почта введены неверно');
      }
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '1d' });
      return res.status(200).cookie('jwt', token, {
        maxAge: 360000 * 24,
        httpOnly: true,
      }).send({ message: `Привет, ${user.name}!` }).end();
    });
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

module.exports.updInfoProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = getUserId(req);
  User.findByIdAndUpdate(userId,
    { name, about },
    { new: true, runValidators: true }).then((user) => {
    if (!user) {
      throw new NotFound('Неправильно передан id пользователя');
    }
    return res.status(200).send('Данные профиля успешно обновлены.');
  }).catch(next);
};

module.exports.updAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = getUserId(req);
  User.findByIdAndUpdate(userId,
    { avatar },
    { new: true, runValidators: true }).then((user) => {
    if (!user) {
      throw new NotFound('Неправильно передан id пользователя');
    }
    return res.status(200).send('Аватар успешно обновлен');
  }).catch(next);
};
