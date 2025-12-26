const express = require('express');
var router = express.Router();
const search = require('../controller/fileSearch');

router.get('/:query', search.getSearchFileController);

module.exports = router;