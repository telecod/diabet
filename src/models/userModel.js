const pool = require('../config/db');

const User = {
  create: async (login, email, password, role = 'USER') => {
    const [result] = await pool.query(
      'INSERT INTO users (login, email, password, role) VALUES (?, ?, ?, ?)',
      [login, email, password, role]
    );
    return result.insertId;
  },
  findByLogin: async (login) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE login = ?', [login]);
    return rows[0];
  },
  findByEmail: async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },
  findById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },
  findByLoginOrId: async (identifier) => {
    const isId = !isNaN(identifier);
    const query = isId
      ? 'SELECT id, login, email, role FROM users WHERE id = ?'
      : 'SELECT id, login, email, role FROM users WHERE login = ?';
    const [rows] = await pool.query(query, [identifier]);
    return rows[0];
  },
  updatePassword: async (id, password) => {
    const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
    return result.affectedRows;
  },
  updateEmail: async (id, newEmail) => {
    const [result] = await pool.query('UPDATE users SET email = ? WHERE id = ?', [newEmail, id]);
    return result.affectedRows;
  },
  updateLogin: async (id, newLogin) => {
    const [result] = await pool.query('UPDATE users SET login = ? WHERE id = ?', [newLogin, id]);
    return result.affectedRows;
  }
};

module.exports = User;