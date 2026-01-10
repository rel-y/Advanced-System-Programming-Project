const express = require('express');
var router = express.Router();
const getAndAddFiles = require('../controller/FilesGetAndAdd');
const {isLoggedIn} = require("../authentication/JWT");

router.get('/:id',isLoggedIn, (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.All));
router.get('/:id/shared',isLoggedIn, (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.sharedWithMeFilter));
router.get('/:id/recent',isLoggedIn, (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.recentFilter));
router.get('/:id/trash',isLoggedIn, (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.trashFilter));
router.get('/:id/starred',isLoggedIn, (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.starFilter));
router.get('/:id/mydrive',isLoggedIn, (req, res) => getAndAddFiles.getFolderFileController(req, res, getAndAddFiles.myDriveFilter));

module.exports = router;