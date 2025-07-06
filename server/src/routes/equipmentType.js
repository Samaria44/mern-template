const express = require('express');
const router = express.Router();
const equipmentTypeController = require('../controllers/equipmentType.controller');
const { authJwt } = require('../middleware');

router.get('/', equipmentTypeController.getEquipmentTypes);
router.post('/', equipmentTypeController.createEquipmentType);
router.put('/:id', equipmentTypeController.updateEquipmentType);
router.delete('/:id', equipmentTypeController.deleteEquipmentType);
// router.post('/', authJwt.checkPermission('equipmentType', 'create'), equipmentTypeController.createEquipmentType);
// router.put('/:id', authJwt.checkPermission('equipmentType', 'update'), equipmentTypeController.updateEquipmentType);
// router.delete('/:id', authJwt.checkPermission('equipmentType', 'delete'), equipmentTypeController.deleteEquipmentType);

module.exports = router;