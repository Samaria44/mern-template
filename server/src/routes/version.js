const express = require('express');
const router = express.Router();
const versionController = require('../controllers/version.controller');
const { authJwt } = require('../middleware');

router.get('/', versionController.getVersions);
// router.get('/active', versionController.getActiveVersion);
router.post('/', versionController.createVersion);
router.put('/:id', versionController.updateVersion);
router.delete('/:id', versionController.deleteVersion);
// router.post('/', authJwt.checkPermission('version', 'create'), versionController.createVersion);
// router.put('/:id', authJwt.checkPermission('version', 'update'), versionController.updateVersion);
// router.delete('/:id', authJwt.checkPermission('version', 'delete'), versionController.deleteVersion);

module.exports = router;