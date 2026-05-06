CREATE DATABASE IF NOT EXISTS project_db;
USE project_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passwords (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed sample users (passwords are bcrypt of "password123")
INSERT INTO users (name, username, email) VALUES
  ('Leah Cohen', 'leah', 'leah@example.com'),
  ('John Doe', 'john', 'john@example.com');

INSERT INTO passwords (user_id, password_hash) VALUES
  (1, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
  (2, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO posts (user_id, title, body) VALUES
  (1, 'My First Post', 'This is the body of my first post.'),
  (1, 'Another Post', 'More content here.'),
  (2, 'John Post', 'John wrote this post.');

INSERT INTO comments (post_id, user_id, name, body) VALUES
  (1, 2, 'John Doe', 'Great post!'),
  (1, 1, 'Leah Cohen', 'Thanks!'),
  (3, 1, 'Leah Cohen', 'Nice one John.');

INSERT INTO todos (user_id, title, completed) VALUES
  (1, 'Buy groceries', FALSE),
  (1, 'Read a book', TRUE),
  (2, 'Go for a run', FALSE);
