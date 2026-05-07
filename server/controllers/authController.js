const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Logger = require('../utils/logger');

class AuthController {
  static async login(req, res) {
    const { username, password } = req.body;
    
    try {
      const user = await User.findByUsername(username);
      
      if (!user) {
        Logger.security('Failed login attempt - user not found', { username });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      
      if (!valid) {
        Logger.security('Failed login attempt - incorrect password', { username, userId: user.id });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password_hash, ...userInfo } = user;
      Logger.info('Successful login', { userId: user.id, username });
      res.json({ token, user: userInfo });
    } catch (err) {
      Logger.error('Login error', { username, error: err.message });
      res.status(500).json({ error: err.message });
    }
  }

  static async checkUsername(req, res) {
    try {
      const { username } = req.body;
      const exists = await User.usernameExists(username);
      res.json({ exists });
    } catch (err) {
      Logger.error('Error checking username', { error: err.message });
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
