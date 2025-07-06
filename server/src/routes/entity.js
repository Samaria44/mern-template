const express = require('express');
const router = express.Router();
const entityController = require('../controllers/entity.controller');
const { authJwt } = require('../middleware');

// router.post('/', authJwt.checkPermission('entity', 'create'), entityController.createEntity);
router.post('/',entityController.createEntity);
router.get('/', entityController.getEntities);
router.get('/:id', entityController.getEntity);
router.put('/:id', authJwt.checkPermission('entity', 'update'), entityController.updateEntity);
router.put('/:id/toggle-status', authJwt.checkPermission('entity', 'update'), entityController.toggleEntityStatus);
router.delete('/:id', authJwt.checkPermission('entity', 'delete'), entityController.deleteEntity);

module.exports = router;
