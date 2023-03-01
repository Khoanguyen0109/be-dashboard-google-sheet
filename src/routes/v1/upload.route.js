const express = require('express');
const multer = require('multer');
const { uploadController } = require('../../controllers');
const auth = require('../../middlewares/auth');

const router = express.Router();
const upload = multer();

router.route('/').post(auth(), upload.any(), uploadController.uploadGoogleDrive);
module.exports = router;
