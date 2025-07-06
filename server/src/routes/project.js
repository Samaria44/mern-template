const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authJwt } = require('../middleware');

router.post('/', authJwt.checkPermission('project', 'create'), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/active', projectController.getActiveProjects);
router.put('/:id', authJwt.checkPermission('project', 'update'), projectController.updateProject);
router.delete('/:id', authJwt.checkPermission('project', 'delete'), projectController.deleteProject);

module.exports = router;


//app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);