const router = require('express').Router();
const CommentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');

router.get('/', CommentController.getAll);
router.get('/post/:postId', CommentController.getByPostId);
router.post('/', authMiddleware, CommentController.create);
router.put('/:id', authMiddleware, CommentController.update);
router.delete('/:id', authMiddleware, CommentController.delete);

module.exports = router;
