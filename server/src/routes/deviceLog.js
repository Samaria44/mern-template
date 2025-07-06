const express = require('express');
const router = express.Router();
const deviceLogController = require('../controllers/deviceLog.controller');

router.post('/', deviceLogController.createDeviceLog);
router.get('/', deviceLogController.getDeviceLogs);
router.get('/macs', deviceLogController.getDeviceMACs);
// router.put('/:id', deviceController.updateDevice);
// router.delete('/:id', deviceController.deleteDevice);

module.exports = router;


//app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);