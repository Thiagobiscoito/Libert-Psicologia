const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const authService = {
  async register({ name, email, password }) {
    // Verifica se já existe
    const existing = userRepository.findByEmail(email);
    if (existing) {
      const error = new Error('Este e-mail já está cadastrado.');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ name, email, password: hashedPassword });

    const token = authService._generateToken(user);
    return { user, token };
  },

  async login({ email, password }) {
    const user = userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('E-mail ou senha incorretos.');
      error.statusCode = 401;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const error = new Error('E-mail ou senha incorretos.');
      error.statusCode = 401;
      throw error;
    }

    const token = authService._generateToken(user);
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    };
  },

  _generateToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  },
};

module.exports = authService;
