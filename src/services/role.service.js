/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const getDoc = require('../gg-sheet');
const ApiError = require('../utils/ApiError');

const sheetID = '1TpWCs27V0wmIzPvLbZno7vy8CCDgLBpHrIe6O2qt48o';

const normalizeRole = (role) => {
  return {
    id: role.id,
    roleName: role.roleName,
  };
};
const getRoleById = async (id) => {
  const { doc } = await getDoc(sheetID);
  const sheet = doc.sheetsByIndex[2];
  const rows = await sheet.getRows();
  const role = rows.find((row) => row.id.toString() === id.toString());
  if (!role) {
    return null;
  }
  return normalizeRole(role);
};

const getRoleByName = async (roleName) => {
  const { doc } = await getDoc(sheetID);
  const sheet = doc.sheetsByIndex[2];
  const rows = await sheet.getRows();
  const role = rows.find((row) => row.roleName === roleName);
  if (!role) {
    return null;
  }
  return normalizeRole(role);
};

const createRole = async (body) => {
  const { doc } = await getDoc(sheetID);
  const sheet = doc.sheetsByIndex[2];
  const exits = await getRoleByName(body.roleName);
  if (exits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Role already taken');
  }
  body.id = uuidv4();
  await sheet.addRow(body);
  return body;
};

const queryRoles = async (filter, options) => {
  const { doc } = await getDoc(sheetID);
  const sheet = doc.sheetsByIndex[2];
  const rows = await sheet.getRows();
  return rows.map((row) => normalizeRole(row));
};

module.exports = {
  getRoleById,
  createRole,
  queryRoles,
  getRoleByName,
};
