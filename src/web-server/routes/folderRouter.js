const express = require('express');
var router = express.Router();
const getAndAddFiles = require('../controller/FilesGetAndAdd');

router.get('/:id', getAndAddFiles.getFolderFileController);
router.get('/:id/shared', (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.sharedWithMeFilter));
router.get('/:id/recent', (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.recentFilter));
router.get('/:id/trash', (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.trashFilter));
router.get('/:id/starred', (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.starFilter));
router.get('/:id/mydrive', (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.myDriveFilter));

module.exports = router;