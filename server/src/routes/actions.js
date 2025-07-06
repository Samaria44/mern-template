const express = require('express');
const router = express.Router();
const actionController = require('../controllers/action.controller');
const { authJwt } = require('../middleware');

// router.post('/', authJwt.checkPermission('action', 'create'), actionController.createAction);
router.post('/', actionController.createAction);
router.get('/', actionController.getActions);
router.get('/active', actionController.getActiveActions);
router.put('/:id', actionController.updateAction);
router.delete('/:id', actionController.deleteAction);
// router.put('/:id', authJwt.checkPermission('action', 'update'), actionController.updateAction);
// router.delete('/:id', authJwt.checkPermission('action', 'delete'), actionController.deleteAction);
module.exports = router;


//app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);