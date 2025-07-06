const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authJwt } = require('../middleware');

router.post('/', authJwt.checkPermission('user', 'create'), userController.createUser);
router.post('/addProjectToUser', userController.addProjectToUser);
router.post('/removeProjectFromUser', userController.removeProjectFromUser);
router.post('/login-logs', userController.getUsersloginlogs);
router.get('/', userController.getUsers);
router.get('/userAssignedProjects/:id', userController.getUserAssignedProjects);
router.get('/free', userController.getFreeUsers);
router.get('/:id', userController.getUser);
router.put('/:id', authJwt.checkPermission('user', 'update'), userController.updateUser);
router.delete('/:id', authJwt.checkPermission('user', 'delete'), userController.deleteUser);

module.exports = router;