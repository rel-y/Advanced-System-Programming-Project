const express = require('express');
var router = express.Router();
const getAndAddFiles = require('../controller/FilesGetAndAdd');
const filesId = require('../controller/files-id-controller');
const filePermissions = require('../controller/api-permissions');


router.get('/', getAndAddFiles.getFileController);
router.post('/', getAndAddFiles.createFileController);


router.get('/:id', filesId.getReqController);
router.patch('/:id', filesId.patchReqController);
router.delete('/:id', filesId.deleteReqController);

router.get('/:id/permissions', filePermissions.getFilePermissionController);
router.post('/:id/permissions', filePermissions.setFilePermissionController);

router.patch('/:id/permissions/:pid', filePermissions.patchFilePermissionController);
router.delete('/:id/permissions/:pid', filePermissions.deleteFilePermissionController);


module.exports = router;