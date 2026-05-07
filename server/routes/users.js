const router = require('express').Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/', UserController.register);
router.put('/:id', authMiddleware, UserController.update);
router.put('/:id/password', authMiddleware, UserController.updatePassword);

module.exports = router;
