const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Unauthorize = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: (error) => `${error.value} не является e-mail адресом`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
  },
  avatar: {
    type: String,
    required: [false, 'Введите ссылку в формате http(s)://'],
    validate: {
      validator(value) {
        return /https?:\/{2}\S+/gi.test(value);
      },
      message: (props) => `Ссылка ${props.value} введена не верна.`,
    },
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
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
      return token;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
