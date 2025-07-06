const express = require('express');
const router = express.Router();
const customerRoutes = require('./customer');
const deviceRoutes = require('./device');
const deviceLogRoutes = require('./deviceLog');
const authRoutes = require('./auth');
const appAuthRoutes = require('./appAuth');
const authUsers = require('./user');
const equipmentRoutes = require('./equipment');
const equipmentProblemRoutes = require('./equipmentProblem');
const equipmentTypeRoutes = require('./equipmentType');
const subEquipmentRoutes = require('./subEquipment');
const vehicleRoutes = require('./vehicle');
const vehicleDeviceRoutes = require('./vehicleDevice');
const projectRoutes = require('./project');
const complainRoutes = require('./complain');
const departmentRoutes = require('./department');
const permissionRoutes = require('./permission');
const teamRoutes = require('./team');
const teamMemberRoutes = require('./teamMember');
const actionRoutes = require('./actions');
const versionRoutes = require('./version');
const { verifyToken } = require('../middleware/authMiddleware');
const versionController = require('../controllers/version.controller');
const path = require('path');

// router.use((req, res, next) => {
//     // Skip token verification for specific routes
//     const publicRoutes = ['/v1/status', '/v1/auth'];

//     if (publicRoutes.includes(req.path)) {
//         return next(); // Skip token verification
//     }
    
//     verifyToken(req, res, next); // Call the verification middleware for other routes
// });

router.get('/v1/status', (req, res) => {
    res.status(200).json({ message: 'Server is running', status: 'OK' });
});
router.get('/v1/versions/active', versionController.getActiveVersion);

// router.use(
//     '/v1/uploads/complain-logs', 
//     express.static(path.join(__dirname, '../uploads/complain-logs'))
// );
router.use(
    '/v1/src/uploads/complain-logs', 
    express.static(path.join(__dirname, '../uploads/complain-logs'))
);

router.use('/v1/auth', authRoutes);
router.use('/v1/appAuth', appAuthRoutes);

router.use(verifyToken);

router.use('/v1/customers', customerRoutes);
router.use('/v1/versions', versionRoutes);
router.use('/v1/vehicles', vehicleRoutes);
router.use('/v1/complains', complainRoutes);
router.use('/v1/equipments', equipmentRoutes);
router.use('/v1/equipmentProblems', equipmentProblemRoutes);
router.use('/v1/equipmentTypes', equipmentTypeRoutes);
router.use('/v1/subEquipments', subEquipmentRoutes);
router.use('/v1/vehicleDevices', vehicleDeviceRoutes);
router.use('/v1/projects', projectRoutes);
router.use('/v1/devices', deviceRoutes);
router.use('/v1/device-log', deviceLogRoutes);
router.use('/v1/users', authUsers);
router.use('/v1/departments', departmentRoutes);
router.use('/v1/permission', permissionRoutes);
router.use('/v1/teams', teamRoutes);
router.use('/v1/teamMembers', teamMemberRoutes);
router.use('/v1/actions', actionRoutes);

module.exports = router;
