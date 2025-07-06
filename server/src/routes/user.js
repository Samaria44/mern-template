const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authJwt } = require('../middleware');

router.post('/', authJwt.checkPermission('user', 'create'), userController.createUser);
router.post('/login-logs', userController.getUsersloginlogs);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', authJwt.checkPermission('user', 'update'), userController.updateUser);
router.put('/:id/toggle-status', authJwt.checkPermission('user', 'update'), userController.toggleUserStatus);
router.delete('/:id', authJwt.checkPermission('user', 'delete'), userController.deleteUser);

module.exports = router;