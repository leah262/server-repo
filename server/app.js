require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  next();
});

// 2. שימוש בראוטר - כל בקשה שתתחיל ב- /users תעבור לקובץ users.js
app.use('/users', usersRouter);
app.use('/auth', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));
app.use('/comments', require('./routes/comments'));
app.use('/todos', require('./routes/todos'));

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});