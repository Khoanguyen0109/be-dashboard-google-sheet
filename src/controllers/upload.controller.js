const stream = require('stream');
const path = require('path');
const httpStatus = require('http-status');
const multer = require('multer');
const { google } = require('googleapis');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const YOUR_ROOT_FOLDER = '1RalMtKUyNgeWG-vbqZZ_eRdyaLjKz9VQ';
const credentialFilename = path.join(__dirname, '../../', 'my_credentials.json');
const scopes = ['https://www.googleapis.com/auth/drive'];

const uploadFile = async (fileObject) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.buffer);
  const auth = new google.auth.GoogleAuth({ keyFile: credentialFilename, scopes });

  const { data } = await google.drive({ version: 'v3', auth }).files.create({
    media: {
      mimeType: fileObject.mimeType,
      body: bufferStream,
    },
    requestBody: {
      name: fileObject.originalname,
      parents: [YOUR_ROOT_FOLDER],
    },
  });
  return data;
};
const uploadGoogleDrive = catchAsync(async (req, res) => {
  const { body, files } = req;

  // eslint-disable-next-line no-await-in-loop
  const data = await uploadFile(files[[0]]);

  res.status(200).send(data);
});

module.exports = {
  uploadGoogleDrive,
};
