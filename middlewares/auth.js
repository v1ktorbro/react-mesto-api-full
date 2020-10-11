const jwt = require('jsonwebtoken');
const { celebrate, Joi } = require('celebrate');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.authorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new Unauthorized('Для продолжения необходимо авторизоваться');
  }
  const token = authorization.replace('Bearer ', '');
  const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  if (!payload) {
    throw new Unauthorized('Для продолжения необходимо авторизоваться');
  }
  req.user = payload;
  return next();
};

module.exports.protectionRoute = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});
