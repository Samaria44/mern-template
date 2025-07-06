const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authJwt } = require('../middleware');

router.post('/', authJwt.checkPermission('vehicle', 'create'), vehicleController.createVehicle);
router.get('/', vehicleController.getVehicles);
router.get('/free', vehicleController.getFreeVehicles);
router.put('/:id', authJwt.checkPermission('vehicle', 'update'), vehicleController.updateVehicle);
router.delete('/:id', authJwt.checkPermission('vehicle', 'delete'), vehicleController.deleteVehicle);

module.exports = router;