const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const getDoc = require('../gg-sheet');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

const sheetID = '1TpWCs27V0wmIzPvLbZno7vy8CCDgLBpHrIe6O2qt48o';

const normalizeUser = (user) => {
  return {
    id: user.id,
    createdDate: user.createdDate,
    name: user.name,
    gender: user.gender,
    image: user.image,
    level: user.level,
    phoneNumber: user.phoneNumber,
    email: user.email,
    address: user.address,
    role: user.role,
    permissions: user.permissions,
    password: user.password,
    status: user.status,
  };
};
const getUserById = async (id) => {
  const { rows } = await getDoc(sheetID);

  const user = rows.find((row) => parseInt(row.id, 10) === parseInt(id, 10));
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return normalizeUser(user);
};

const getUserByEmail = async (email) => {
  const { rows } = await getDoc(sheetID);
  const user = rows.find((row) => row.email === email);
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return normalizeUser(user);
};

const isPasswordMatch = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const createUser = async (userBody) => {
  const { sheet } = await getDoc(sheetID);
  const exitsUserEmail = await getUserByEmail(userBody.email);
  if (exitsUserEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  // eslint-disable-next-line no-param-reassign
  userBody.password = bcrypt.hashSync(userBody.password, 10);
  return sheet.addRow(userBody);
};

const queryUsers = async (filter, options) => {
  const { rows } = await getDoc(sheetID);
  return rows.map((row) => row._rawData);
};

const updateUserById = async (userId, updateBody) => {
  const { rows } = await getDoc(sheetID);

  const index = rows.findIndex((row) => parseInt(row.id, 10) === userId);
  if (index === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(rows[index], updateBody);
  await rows[index].save();
  return normalizeUser(rows[index]);
};

const deleteUserById = async (userId) => {
  const { rows } = await getDoc(sheetID);

  const index = rows.findIndex((row) => parseInt(row.id, 10) === userId);
  if (index === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  await rows[index].delete(); // delete a row

  return userId;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  isPasswordMatch,
  normalizeUser,
};
