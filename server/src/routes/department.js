const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { authJwt } = require('../middleware');

router.post('/',  authJwt.checkPermission('department', 'create'), departmentController.createDepartment);
router.get('/', departmentController.getDepartments);
router.get('/active', departmentController.getActiveDepartments);
router.put('/:id',  authJwt.checkPermission('department', 'update'), departmentController.updateDepartment);
router.delete('/:id',  authJwt.checkPermission('department', 'delete'), departmentController.deleteDepartment);

module.exports = router;