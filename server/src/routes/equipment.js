const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipment.controller');
const { authJwt } = require('../middleware');

router.post('/',  authJwt.checkPermission('equipment', 'create'), equipmentController.createEquipment);
router.get('/', equipmentController.getEquipments);
router.get('/active', equipmentController.getActiveEquipments);
router.get('/active/:deviceId', equipmentController.getActiveEquipments);
router.get('/:id', equipmentController.getEquipmentsOfDevice);
router.put('/:id', authJwt.checkPermission('equipment', 'update'), equipmentController.updateEquipment);
router.delete('/:id', authJwt.checkPermission('equipment', 'delete'), equipmentController.deleteEquipment);

module.exports = router;