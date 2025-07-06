const express = require('express');
const router = express.Router();
const customerRoutes = require('./customer');
const authRoutes = require('./auth');
const authUsers = require('./user');
const projectRoutes = require('./project');
const departmentRoutes = require('./department');
const permissionRoutes = require('./permission');
const entityRoutes = require('./entity');
const { verifyToken } = require('../middleware/authMiddleware');
const path = require('path');

router.get('/v1/status', (req, res) => {
    res.status(200).json({ message: 'Server is running', status: 'OK' });
});

// router.use(
//     '/v1/uploads/complain-logs', 
//     express.static(path.join(__dirname, '../uploads/complain-logs'))
// );
router.use(
    '/v1/src/uploads/complain-logs', 
    express.static(path.join(__dirname, '../uploads/complain-logs'))
);

router.use('/v1/entities', entityRoutes);

router.use('/v1/auth', authRoutes);

router.use(verifyToken);

router.use('/v1/customers', customerRoutes);
router.use('/v1/projects', projectRoutes);
router.use('/v1/users', authUsers);
router.use('/v1/departments', departmentRoutes);
router.use('/v1/permission', permissionRoutes);

module.exports = router;
