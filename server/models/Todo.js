const db = require('../config/db');

class Todo {
  static async findByUserId(userId, options = {}) {
    const { _sort = 'created_at', _order = 'DESC', _limit, _page } = options;
    let query = `
      SELECT * FROM todos 
      WHERE user_id = ?
      ORDER BY ${_sort} ${_order}
    `;
    
    if (_limit) {
      const limit = parseInt(_limit);
      const offset = _page ? (parseInt(_page) - 1) * limit : 0;
      query += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    
    const [rows] = await db.query(query, [userId]);
    return rows.map(row => ({ ...row, completed: Boolean(row.completed) }));
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [id]);
    if (!rows[0]) return null;
    return { ...rows[0], completed: Boolean(rows[0].completed) };
  }

  static async create(userId, todoData) {
    const { title } = todoData;
    const [result] = await db.query(
      'INSERT INTO todos (user_id, title) VALUES (?, ?)',
      [userId, title]
    );
    return this.findById(result.insertId);
  }

  static async update(id, todoData) {
    const todo = await this.findById(id);
    if (!todo) return null;
    
    const title = todoData.title !== undefined ? todoData.title : todo.title;
    const completed = todoData.completed !== undefined ? todoData.completed : todo.completed;
    
    await db.query(
      'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
      [title, completed ? 1 : 0, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await db.query('DELETE FROM todos WHERE id = ?', [id]);
  }

  static async getOwner(id) {
    const [rows] = await db.query('SELECT user_id FROM todos WHERE id = ?', [id]);
    return rows[0]?.user_id;
  }
}

module.exports = Todo;
