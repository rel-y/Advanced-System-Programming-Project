const express = require('express');
var router = express.Router();
const users = require('../controller/api-users-controller');
const {isLoggedIn} = require("../authentication/JWT")

router.post('/', users.postReqController);
router.get('/:id', isLoggedIn, users.getReqController);
router.post('/logout', isLoggedIn, users.disconnectController);

module.exports = router;