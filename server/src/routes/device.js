const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const authJwt = require('../middleware/authMiddleware');

router.post('/', authJwt.checkPermission('device', 'create'), deviceController.createDevice);
router.get('/', deviceController.getDevices);
router.get('/active', deviceController.getActiveDevices);
router.get('/with-equipments-subEquipments-equipmentProblems', deviceController.getDevicesWithEquipmentsSubEquipmentsAndEquipmentProblems);
router.get('/with-equipments', deviceController.getDevicesWithEquipments);
router.get('/ips', deviceController.getDeviceIPs);
router.get('/with-log', deviceController.getDevicesWithLatestLog);
router.get('/active/:projectId', deviceController.getActiveDevicesOfProject);
router.put('/:id', authJwt.checkPermission('device', 'update'), deviceController.updateDevice);
router.delete('/:id', authJwt.checkPermission('device', 'delete'), deviceController.deleteDevice);

module.exports = router;


//app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);