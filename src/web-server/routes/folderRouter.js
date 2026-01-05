const express = require('express');
var router = express.Router();
const getAndAddFiles = require('../controller/FilesGetAndAdd');

router.get('/:id', getAndAddFiles.getFolderFileController);
