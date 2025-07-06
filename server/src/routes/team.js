const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const { authJwt } = require('../middleware');
// const authJwt = require('../middleware/authMiddleware');

router.post('/', authJwt.checkPermission('team', 'create'), teamController.createTeam);
router.post('/login-logs', teamController.getTeamsloginlogs);
router.get('/', teamController.getTeams);
router.get('/team', teamController.getTeamById);
router.get('/free', teamController.getFreeTeams);
router.put('/:id', authJwt.checkPermission('team', 'update'), teamController.updateTeam);
router.delete('/:id', authJwt.checkPermission('team', 'delete'), teamController.deleteTeam);

module.exports = router;


//app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);