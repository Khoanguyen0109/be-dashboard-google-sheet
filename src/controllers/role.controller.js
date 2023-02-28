const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');

const createRole = catchAsync(async (req, res) => {
  const user = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getRoles = catchAsync(async (req, res) => {
  const result = await roleService.queryRoles();
  res.send(result);
});

module.exports = {
  createRole,
  getRoles,
};
