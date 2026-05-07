const router = require('express').Router();
const PostController = require('../controllers/postController');
const authMiddleware = require('../middleware/auth');

router.get('/', PostController.getAll);
router.get('/:id', PostController.getById);
router.get('/:id/comments', PostController.getWithComments);
router.post('/', authMiddleware, PostController.create);
router.put('/:id', authMiddleware, PostController.update);
router.delete('/:id', authMiddleware, PostController.delete);

module.exports = router;
