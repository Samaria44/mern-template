const express = require('express');
const router = express.Router();
const vehicleDeviceController = require('../controllers/vehicleDevice.controller');
// const { verifyToken } = require('../middleware/authMiddleware');
const authJwt = require('../middleware/authMiddleware');

router.post('/', vehicleDeviceController.createVehicleDevice);
router.get('/', vehicleDeviceController.getVehicleDevices);
router.get('/free', vehicleDeviceController.getFreeVehicleDevices);
router.put('/:id', vehicleDeviceController.updateVehicleDevice);
router.delete('/:id', vehicleDeviceController.deleteVehicleDevice);

module.exports = router;


//app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);