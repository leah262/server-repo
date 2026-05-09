const db = require('../config/db');

class User {
  static async findAll(options = {}) {
    const { _sort = 'id', _order = 'ASC', _limit, _page } = options;
    let query = `SELECT id, name, username, email, created_at FROM users ORDER BY ${_sort} ${_order}`;
    
    if (_limit) {
      const limit = parseInt(_limit);
      const offset = _page ? (parseInt(_page) - 1) * limit : 0;
      query += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    const [rows] = await db.query(query);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      'SELECT id, name, username, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db.query(
      `SELECT u.*, p.password_hash FROM users u
       JOIN passwords p ON p.user_id = u.id
       WHERE u.username = ?`,
      [username]
    );
    return rows[0];
  }

  static async create(userData) {
    const { name, username, email } = userData;
    const [result] = await db.query(
      'INSERT INTO users (name, username, email) VALUES (?, ?, ?)',
      [name, username, email]
    );
    return result.insertId;
  }

  static async update(id, userData) {
    const { name, email } = userData;
    await db.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    return this.findById(id);
  }

  static async updatePassword(userId, passwordHash) {

    const result = await db.query(
      'UPDATE passwords SET password_hash = ? WHERE user_id = ?',
      [passwordHash, userId]
    );
    
    // Verify the update worked
    const [verifyRows] = await db.query(
      'SELECT password_hash FROM passwords WHERE user_id = ?',
      [userId]
    );
        
    return result;
  }

  static async createPassword(userId, passwordHash) {
    await db.query(
      'INSERT INTO passwords (user_id, password_hash) VALUES (?, ?)',
      [userId, passwordHash]
    );
  }

  static async usernameExists(username) {
    const [rows] = await db.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    return rows.length > 0;
  }
}

module.exports = User;
