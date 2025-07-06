const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permission.controller');
const { authJwt } = require('../middleware');

router.get('/:id', permissionController.getUserPermissions);
router.post('/',  authJwt.checkPermission('permission', 'create'),permissionController.createPermission);
router.put('/:id', authJwt.checkPermission('permission', 'update'), permissionController.updatePermission);

module.exports = router;

