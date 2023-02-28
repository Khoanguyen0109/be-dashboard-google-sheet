const express = require('express');
const { roleController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { roleValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(roleValidation.createRole), roleController.createRole)
  .get(auth(), roleController.getRoles);
module.exports = router;
