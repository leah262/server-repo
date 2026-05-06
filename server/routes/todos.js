const router = require('express').Router();
const db = require('../config/db'); // עולים למעלה ל-server ואז נכנסים ל-config
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM todos ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Todo not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/comments', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.username FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.todo_id = ? ORDER BY c.created_at ASC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const [result] = await db.query(
      'INSERT INTO todos (user_id, title) VALUES (?, ?)',
      [req.user.id, title]
    );
    res.status(201).json({ id: result.insertId, user_id: req.user.id, title, completed: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM todos WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Todo not found' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const { title, completed } = req.body;
    await db.query('UPDATE todos SET title = ?, completed = ? WHERE id = ?', [title, completed, req.params.id]);
    res.json({ message: 'Todo updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM todos WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Todo not found' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await db.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
