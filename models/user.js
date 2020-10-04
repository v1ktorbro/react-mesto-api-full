const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: (error) => {
        return `${error.value} не является e-mail адресом`;
      },
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: [true, 'Введите ссылку в формате http(s)://'],
    validate: {
      validator(value) {
        return /https?:\/{2}\S+/gi.test(value);
      },
      message: (props) => {
        return `Ссылка ${props.value} введена не верна.`;
      },
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
