const { db } = require('../config/database');

const userRepository = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(id);
  },

  create({ name, email, password }) {
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(name, email, password);
    return { id: result.lastInsertRowid, name, email, role: 'admin' };
  },
};

module.exports = userRepository;
