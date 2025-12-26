const express = require('express');
var router = express.Router();
const tokens = require('../controller/api-tokens-controller');

router.post('/', tokens.postReqController);

module.exports = router;