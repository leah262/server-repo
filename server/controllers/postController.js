const Post = require('../models/Post');
const Logger = require('../utils/logger');

class PostController {
  static async getAll(req, res) {
    try {
      const posts = await Post.findAll(req.query);
      res.json(posts);
    } catch (err) {
      Logger.error('Error fetching posts', { error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      res.json(post);
    } catch (err) {
      Logger.error('Error fetching post', { postId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async getWithComments(req, res) {
    try {
      const post = await Post.findWithComments(req.params.id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      res.json(post);
    } catch (err) {
      Logger.error('Error fetching post with comments', { postId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const post = await Post.create(req.user.id, req.body);
      Logger.info('Post created', { postId: post.id, userId: req.user.id });
      res.status(201).json(post);
    } catch (err) {
      Logger.error('Error creating post', { userId: req.user.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const ownerId = await Post.getOwner(req.params.id);
      
      if (!ownerId) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      if (ownerId !== req.user.id) {
        Logger.security('Unauthorized post update attempt', { 
          postId: req.params.id, 
          attemptedBy: req.user.id, 
          owner: ownerId 
        });
        return res.status(403).json({ error: 'Forbidden' });
      }

      const post = await Post.update(req.params.id, req.body);
      Logger.info('Post updated', { postId: req.params.id, userId: req.user.id });
      res.json(post);
    } catch (err) {
      Logger.error('Error updating post', { postId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const ownerId = await Post.getOwner(req.params.id);
      
      if (!ownerId) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      if (ownerId !== req.user.id) {
        Logger.security('Unauthorized post delete attempt', { 
          postId: req.params.id, 
          attemptedBy: req.user.id, 
          owner: ownerId 
        });
        return res.status(403).json({ error: 'Forbidden' });
      }

      await Post.delete(req.params.id);
      Logger.info('Post deleted', { postId: req.params.id, userId: req.user.id });
      res.json({ message: 'Post deleted' });
    } catch (err) {
      Logger.error('Error deleting post', { postId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = PostController;
