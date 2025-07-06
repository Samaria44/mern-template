const express = require('express');
const router = express.Router();
const appAuthController = require('../controllers/appAuth.controller');

router.post('/signin', appAuthController.signin);
router.post('/refresh-token', appAuthController.refreshToken);
router.post('/reset-password', appAuthController.resetPassword);
router.post('/verification-code', appAuthController.verificationCode);
router.post('/verify-code', appAuthController.verifyCode);
router.post('/clear-verification', appAuthController.clearVerification);
module.exports = router;