const jwt = require('jsonwebtoken');
const { celebrate, Joi } = require('celebrate');
const Unauthorized = require('../errors/Unauthorized');

module.exports.authorization = (req, res, next) => {
  const payload = req.cookies.jwt;
  if (!payload) {
    throw new Unauthorized('Для продолжения необходимо авторизоваться');
  }
  return next();
};

module.exports.getUserId = (req) => {
  return jwt.decode(req.cookies.jwt, { complete: true }).payload._id;
};

module.exports.protectionRoute = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
