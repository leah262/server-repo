const router = require('express').Router();
const TodoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/auth');

router.get('/my', authMiddleware, TodoController.getMyTodos);
router.post('/', authMiddleware, TodoController.create);
router.put('/:id', authMiddleware, TodoController.update);
router.delete('/:id', authMiddleware, TodoController.delete);

module.exports = router;
