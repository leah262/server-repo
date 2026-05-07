const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Logger = require('../utils/logger');

class UserController {
  static async getAll(req, res) {
    try {
      const users = await User.findAll(req.query);
      res.json(users);
    } catch (err) {
      Logger.error('Error fetching users', { error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      Logger.error('Error fetching user', { userId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      if (req.user.id !== parseInt(req.params.id)) {
        Logger.security('Unauthorized user update attempt', { 
          attemptedBy: req.user.id, 
          targetUser: req.params.id 
        });
        return res.status(403).json({ error: 'Forbidden' });
      }

      const user = await User.update(req.params.id, req.body);
      Logger.info('User updated', { userId: req.params.id });
      res.json(user);
    } catch (err) {
      Logger.error('Error updating user', { userId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async updatePassword(req, res) {
    try {
      console.log('Password change request:', { userId: req.params.id, body: req.body });
      
      if (req.user.id !== parseInt(req.params.id)) {
        Logger.security('Unauthorized password change attempt', { 
          attemptedBy: req.user.id, 
          targetUser: req.params.id 
        });
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        console.log('Missing password fields');
        return res.status(400).json({ error: 'Current and new password required' });
      }

      console.log('Fetching user:', req.user.username);
      const user = await User.findByUsername(req.user.username);
      console.log('User found:', user ? 'yes' : 'no');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.password_hash) {
        console.error('Password hash is missing or NULL in database for user:', req.user.username);
        return res.status(500).json({ error: 'Password not properly initialized in database' });
      }
      
      const valid = await bcrypt.compare(currentPassword, user.password_hash);
      console.log('Password valid:', valid);
      console.log('Password hash stored (first 20 chars):', user.password_hash?.substring(0, 20));
      console.log('Current password length:', currentPassword?.length);
      
      if (!valid) {
        Logger.security('Failed password change - incorrect current password', { 
          userId: req.params.id 
        });
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await User.updatePassword(req.params.id, newHash);
      
      Logger.info('Password changed successfully', { userId: req.params.id });
      console.log('Password changed successfully');
      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error('Error in updatePassword:', err);
      Logger.error('Error updating password', { userId: req.params.id, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async register(req, res) {
    try {
      const { name, username, email, password } = req.body;
      
      if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields required' });
      }

      const exists = await User.usernameExists(username);
      if (exists) {
        Logger.warn('Registration attempt with existing username', { username });
        return res.status(409).json({ error: 'Username already exists' });
      }

      const userId = await User.create({ name, username, email });
      const passwordHash = await bcrypt.hash(password, 10);
      await User.createPassword(userId, passwordHash);

      const user = await User.findById(userId);
      Logger.info('New user registered', { userId, username });
      res.status(201).json(user);
    } catch (err) {
      Logger.error('Error registering user', { error: err.message });
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UserController;
