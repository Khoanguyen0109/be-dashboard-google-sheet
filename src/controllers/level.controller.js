const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');
const { levelService } = require('../services');

const createLevel = catchAsync(async (req, res) => {
  const user = await levelService.createLevel(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getLevels = catchAsync(async (req, res) => {
  const result = await levelService.queryLevels();
  res.send(result);
});

module.exports = {
  createLevel,
  getLevels,
};
