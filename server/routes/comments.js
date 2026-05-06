const router = require('express').Router();
const db = require('../config/db'); // עולים למעלה ל-server ואז נכנסים ל-config
const authMiddleware = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.username FROM comments c
       JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/post/:postId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.username FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.post_id = ? ORDER BY c.created_at ASC`,
      [req.params.postId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, u.username FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Comment not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { post_id, body } = req.body;
    const [userRows] = await db.query('SELECT name FROM users WHERE id = ?', [req.user.id]);
    const [result] = await db.query(
      'INSERT INTO comments (post_id, user_id, name, body) VALUES (?, ?, ?, ?)',
      [post_id, req.user.id, userRows[0].name, body]
    );
    res.status(201).json({ id: result.insertId, post_id, user_id: req.user.id, body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM comments WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Comment not found' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await db.query('UPDATE comments SET body = ? WHERE id = ?', [req.body.body, req.params.id]);
    res.json({ message: 'Comment updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM comments WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Comment not found' });
    if (rows[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await db.query('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
