const express = require('express');
var router = express.Router();
const users = require('../controller/api-users-controller');

router.post('/', users.postReqController);
router.get('/:id', users.getReqController);

module.exports = router;