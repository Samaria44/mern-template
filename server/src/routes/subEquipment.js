const express = require('express');
const router = express.Router();
const subEquipmentController = require('../controllers/subEquipment.controller');
const { authJwt } = require('../middleware');

router.post('/', subEquipmentController.createSubEquipment);
router.get('/', subEquipmentController.getSubEquipments);
// router.get('/:id', subEquipmentController.getSubEquipmentsOfEquipment);
router.get('/:id', subEquipmentController.getSubEquipmentsOfProject);
router.put('/:id', authJwt.checkPermission('subEquipment', 'delete'), subEquipmentController.updateSubEquipment);
router.delete('/:id', authJwt.checkPermission('subEquipment', 'delete'), subEquipmentController.deleteSubEquipment);

module.exports = router;