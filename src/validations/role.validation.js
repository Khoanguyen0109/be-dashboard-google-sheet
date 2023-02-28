const Joi = require('joi');

const createRole = {
  body: Joi.object().keys({
    roleName: Joi.string().required(),
  }),
};

module.exports = {
  createRole,
};
