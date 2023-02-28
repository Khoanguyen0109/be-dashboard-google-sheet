/* eslint-disable no-param-reassign */
const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const getDoc = require('../gg-sheet');
const ApiError = require('../utils/ApiError');

const sheetID = '1TpWCs27V0wmIzPvLbZno7vy8CCDgLBpHrIe6O2qt48o';

const normalizeLevel = (level) => {
  return {
    id: level.id,
    levelName: level.levelName,
  };
};
const getLevelById = async (id) => {
  const { doc } = await getDoc(sheetID);
  const sheet = doc.sheetsByIndex[1];
  const rows = await sheet.getRows();
  const level = rows.find((row) => row.id.toString() === id.toString());
  if (!level) {
    return null;
  }
  return normalizeLevel(level);
};

const getLevelByName = async (levelName) => {
  const { doc } = await getDoc(sheetID);
  const sheet = doc.sheetsByIndex[1];
  const rows = await sheet.getRows();
  const level = rows.find((row) => row.levelName === levelName);
  if (!level) {
    return null;
  }
  return normalizeLevel(level);
};

const createLevel = async (body) => {
  const { doc } = await getDoc(sheetID);
  const sheet = doc.sheetsByIndex[1];
  const exits = await getLevelByName(body.levelName);
  if (exits) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Level already taken');
  }
  body.id = uuidv4();
  await sheet.addRow(body);
  return body;
};

const queryLevels = async (filter, options) => {
  const { doc } = await getDoc(sheetID);
  const sheet = doc.sheetsByIndex[1];
  const rows = await sheet.getRows();
  return rows.map((row) => normalizeLevel(row));
};

module.exports = {
  getLevelById,
  createLevel,
  queryLevels,
  getLevelByName,
};
