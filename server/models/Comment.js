const db = require('../config/db');

class Comment {
  static async findAll(options = {}) {
    const { _sort = 'created_at', _order = 'DESC', _limit, _page } = options;
    let query = `
      SELECT c.*, u.username 
      FROM comments c
      JOIN users u ON u.id = c.user_id
      ORDER BY c.${_sort} ${_order}
    `;
    
    if (_limit) {
      const limit = parseInt(_limit);
      const offset = _page ? (parseInt(_page) - 1) * limit : 0;
      query += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    const [rows] = await db.query(query);
    return rows;
  }

  static async findByPostId(postId, options = {}) {
    const { _sort = 'created_at', _order = 'ASC' } = options;
    const [rows] = await db.query(
      `SELECT c.*, u.username 
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ?
       ORDER BY c.${_sort} ${_order}`,
      [postId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(
      `SELECT c.*, u.username 
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async create(userId, commentData) {
    const { post_id, body } = commentData;
    const [userRows] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
    const [result] = await db.query(
      'INSERT INTO comments (post_id, user_id, name, body) VALUES (?, ?, ?, ?)',
      [post_id, userId, userRows[0].name, body]
    );
    return this.findById(result.insertId);
  }

  static async update(id, commentData) {
    const { body } = commentData;
    await db.query('UPDATE comments SET body = ? WHERE id = ?', [body, id]);
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM comments WHERE id = ?', [id]);
  }

  static async getOwner(id) {
    const [rows] = await db.query('SELECT user_id FROM comments WHERE id = ?', [id]);
    return rows[0]?.user_id;
  }
}

module.exports = Comment;
