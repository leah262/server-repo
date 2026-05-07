const router = require('express').Router();
const AuthController = require('../controllers/authController');

router.post('/login', AuthController.login);
router.post('/check-username', AuthController.checkUsername);

module.exports = router;
