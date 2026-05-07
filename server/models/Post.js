const db = require('../config/db');

class Post {
  static async findAll(options = {}) {
    const { _sort = 'created_at', _order = 'DESC', _limit, _page } = options;
    let query = `
      SELECT p.*, u.name as author_name, u.username as author_username
      FROM posts p 
      JOIN users u ON u.id = p.user_id
      ORDER BY p.${_sort} ${_order}
    `;
    
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
      `SELECT p.*, u.name as author_name, u.username as author_username
       FROM posts p 
       JOIN users u ON u.id = p.user_id 
       WHERE p.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findWithComments(id) {
    const [posts] = await db.query(
      `SELECT p.*, u.name as author_name, u.username as author_username
       FROM posts p 
       JOIN users u ON u.id = p.user_id 
       WHERE p.id = ?`,
      [id]
    );
    
    if (!posts.length) return null;
    
    const [comments] = await db.query(
      `SELECT c.*, u.username 
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [id]
    );
    
    return { ...posts[0], comments };
  }

  static async create(userId, postData) {
    const { title, body } = postData;
    const [result] = await db.query(
      'INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)',
      [userId, title, body]
    );
    return this.findById(result.insertId);
  }

  static async update(id, postData) {
    const { title, body } = postData;
    await db.query(
      'UPDATE posts SET title = ?, body = ? WHERE id = ?',
      [title, body, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM posts WHERE id = ?', [id]);
  }

  static async getOwner(id) {
    const [rows] = await db.query('SELECT user_id FROM posts WHERE id = ?', [id]);
    return rows[0]?.user_id;
  }
}

module.exports = Post;
