const express = require('express');
const router = express.Router();
const complainController = require('../controllers/complain.controller');
const { authJwt } = require('../middleware');

router.get('/', complainController.getComplains);
router.post('/get', complainController.getComplains);
router.get('/complain-count', complainController.getComplainCounts);
router.get('/resolved-complain/:id', complainController.getResolvedComplain);
router.get('/assigned-complains', complainController.getAssignedComplain);
router.get('/:id', complainController.getComplain);
router.post('/', authJwt.checkPermission('complain', 'create'), complainController.createComplain);
router.post('/log/:id', complainController.upload.array('files', 5), complainController.updateComplainStatus);
router.put('/:id', authJwt.checkPermission('complain', 'update'), complainController.updateComplain);
router.delete('/:id', authJwt.checkPermission('complain', 'delete'), complainController.deleteComplain);

module.exports = router;