const Comment = require('../models/Comment');
const Logger = require('../utils/logger');

class CommentController {
  static async getAll(req, res) {
    try {
      const comments = await Comment.findAll(req.query);
      res.json(comments);
    } catch (err) {
      Logger.error('Error fetching comments', { error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async getByPostId(req, res) {
    try {
      const comments = await Comment.findByPostId(req.params.postId, req.query);
      res.json(comments);
    } catch (err) {
      Logger.error('Error fetching comments', { postId: req.params.postId, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const comment = await Comment.create(req.user.id, req.body);
      Logger.info('Comment created', { commentId: comment.id, userId: req.user.id });
      res.status(201).json(comment);
    } catch (err) {
      Logger.error('Error creating comment', { userId: req.user.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const ownerId = await Comment.getOwner(req.params.id);
      
      if (!ownerId) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      if (ownerId !== req.user.id) {
        Logger.security('Unauthorized comment update attempt', { 
          commentId: req.params.id, 
          attemptedBy: req.user.id, 
          owner: ownerId 
        });
        return res.status(403).json({ error: 'Forbidden' });
      }

      const comment = await Comment.update(req.params.id, req.body);
      Logger.info('Comment updated', { commentId: req.params.id, userId: req.user.id });
      res.json(comment);
    } catch (err) {
      Logger.error('Error updating comment', { commentId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const ownerId = await Comment.getOwner(req.params.id);
      
      if (!ownerId) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      
      if (ownerId !== req.user.id) {
        Logger.security('Unauthorized comment delete attempt', { 
          commentId: req.params.id, 
          attemptedBy: req.user.id, 
          owner: ownerId 
        });
        return res.status(403).json({ error: 'Forbidden' });
      }

      await Comment.delete(req.params.id);
      Logger.info('Comment deleted', { commentId: req.params.id, userId: req.user.id });
      res.json({ message: 'Comment deleted' });
    } catch (err) {
      Logger.error('Error deleting comment', { commentId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = CommentController;
