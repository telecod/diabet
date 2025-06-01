const pool = require('../config/db');

const SugarReading = {
  create: async (userId, sugarLevel, readingDate, description) => {
    const [result] = await pool.query(
      'INSERT INTO sugar_readings (user_id, sugar_level, reading_date, description) VALUES (?, ?, ?, ?)',
      [userId, sugarLevel, readingDate, description]
    );
    return result.insertId;
  },
  update: async (id, userId, sugarLevel, readingDate, description) => {
    const [result] = await pool.query(
      'UPDATE sugar_readings SET sugar_level = ?, reading_date = ?, description = ? WHERE id = ? AND user_id = ?',
      [sugarLevel, readingDate, description, id, userId]
    );
    return result.affectedRows;
  },
  delete: async (id, userId) => {
    const [result] = await pool.query('DELETE FROM sugar_readings WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows;
  },
  findByUserId: async (userId) => {
    const [rows] = await pool.query('SELECT * FROM sugar_readings WHERE user_id = ?', [userId]);
    return rows;
  },
  findAll: async () => {
    const [rows] = await pool.query('SELECT sr.*, u.login, u.email FROM sugar_readings sr JOIN users u ON sr.user_id = u.id');
    return rows;
  },
  getLastReadingTime: async (userId) => {
    const [rows] = await pool.query('SELECT last_reading_time FROM user_rate_limits WHERE user_id = ?', [userId]);
    return rows[0]?.last_reading_time || null;
  },
  updateLastReadingTime: async (userId) => {
    const now = new Date();
    const [result] = await pool.query(
      'INSERT INTO user_rate_limits (user_id, last_reading_time) VALUES (?, ?) ON DUPLICATE KEY UPDATE last_reading_time = ?',
      [userId, now, now]
    );
    return result.affectedRows;
  }
};

module.exports = SugarReading;