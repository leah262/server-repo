const Todo = require('../models/Todo');
const Logger = require('../utils/logger');

class TodoController {
  static async getMyTodos(req, res) {
    try {
      const todos = await Todo.findByUserId(req.user.id, req.query);
      res.json(todos);
    } catch (err) {
      Logger.error('Error fetching todos', { userId: req.user.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      if (!req.body.title || !req.body.title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const todo = await Todo.create(req.user.id, req.body);
      Logger.info('Todo created', { todoId: todo.id, userId: req.user.id });
      res.status(201).json(todo);
    } catch (err) {
      Logger.error('Error creating todo', { userId: req.user.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const ownerId = await Todo.getOwner(req.params.id);
      
      if (!ownerId) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      if (ownerId !== req.user.id) {
        Logger.security('Unauthorized todo update attempt', { 
          todoId: req.params.id, 
          attemptedBy: req.user.id, 
          owner: ownerId 
        });
        return res.status(403).json({ error: 'Forbidden' });
      }

      const todo = await Todo.update(req.params.id, req.body);
      Logger.info('Todo updated', { todoId: req.params.id, userId: req.user.id });
      res.json(todo);
    } catch (err) {
      Logger.error('Error updating todo', { todoId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const ownerId = await Todo.getOwner(req.params.id);
      
      if (!ownerId) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      if (ownerId !== req.user.id) {
        Logger.security('Unauthorized todo delete attempt', { 
          todoId: req.params.id, 
          attemptedBy: req.user.id, 
          owner: ownerId 
        });
        return res.status(403).json({ error: 'Forbidden' });
      }

      await Todo.delete(req.params.id);
      Logger.info('Todo deleted', { todoId: req.params.id, userId: req.user.id });
      res.json({ message: 'Todo deleted' });
    } catch (err) {
      Logger.error('Error deleting todo', { todoId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = TodoController;
