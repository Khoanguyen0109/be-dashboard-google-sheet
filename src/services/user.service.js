/* eslint-disable no-param-reassign */
const { v4: uuidv4 } = require('uuid');

const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const getDoc = require('../gg-sheet');
const ApiError = require('../utils/ApiError');
const roleService = require('./role.service');
const levelService = require('./level.service');

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
    return null;
  }
  const userRes = normalizeUser(user);

  return userRes;
};

const getUserByEmail = async (email) => {
  const { rows } = await getDoc(sheetID);
  const user = rows.find((row) => row.email === email);
  if (!user) {
    return null;
  }
  const userRes = normalizeUser(user);

  return userRes;
};

const isPasswordMatch = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

const createUser = async (userBody) => {
  const { sheet, rows } = await getDoc(sheetID);
  const exitsUserEmail = await getUserByEmail(userBody.email);
  if (exitsUserEmail) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  userBody.password = bcrypt.hashSync(userBody.password, 10);
  userBody.id = uuidv4();
  userBody.createdDate = new Date();
  await sheet.addRow(userBody);
  return userBody;
};

const queryUsers = async (filter, options) => {
  const { rows } = await getDoc(sheetID);
  return rows.map((row) => normalizeUser(row));
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
