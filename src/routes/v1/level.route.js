const express = require('express');
const { levelController } = require('../../controllers');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.route('/').post(auth(), levelController.createLevel).get(auth(), levelController.getLevels);

module.exports = router;
