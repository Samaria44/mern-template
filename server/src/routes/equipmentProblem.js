const express = require('express');
const router = express.Router();
const equipmentProblemController = require('../controllers/equipmentProblem.controller');
const { authJwt } = require('../middleware');

router.post('/', authJwt.checkPermission('equipmentProblem', 'create'), equipmentProblemController.createEquipmentProblem);
router.get('/', equipmentProblemController.getEquipmentProblems);
// router.get('/:id', equipmentProblemController.getEquipmentProblemsOfEquipment);
router.get('/:id', equipmentProblemController.getEquipmentProblemsOfProject);
router.put('/:id', authJwt.checkPermission('equipmentProblem', 'update'), equipmentProblemController.updateEquipmentProblem);
router.delete('/:id', authJwt.checkPermission('equipmentProblem', 'delete'), equipmentProblemController.deleteEquipmentProblem);

module.exports = router;