const express = require('express');
const router = express.Router();
const teamMemberController = require('../controllers/teamMember.controller');
const { authJwt } = require('../middleware');

router.post('/', authJwt.checkPermission('teamMember', 'create'), teamMemberController.createTeamMember);
router.get('/', teamMemberController.getTeamMembers);
router.get('/free', teamMemberController.getFreeTeamMembers);
router.put('/:id', authJwt.checkPermission('teamMember', 'update'), teamMemberController.updateTeamMember);
router.delete('/:id', authJwt.checkPermission('teamMember', 'delete'), teamMemberController.deleteTeamMember);

module.exports = router;