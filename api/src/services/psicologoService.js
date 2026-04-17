const psicologoRepository = require('../repositories/psicologoRepository');

const psicologoService = {
  list(filters) {
    return psicologoRepository.findAll(filters);
  },

  getById(id) {
    const psicologo = psicologoRepository.findById(id);
    if (!psicologo) {
      const error = new Error('Psicólogo não encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return psicologo;
  },

  create(data) {
    return psicologoRepository.create(data);
  },

  update(id, data) {
    const updated = psicologoRepository.update(id, data);
    if (!updated) {
      const error = new Error('Psicólogo não encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return updated;
  },

  delete(id) {
    const deleted = psicologoRepository.delete(id);
    if (!deleted) {
      const error = new Error('Psicólogo não encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return true;
  },
};

module.exports = psicologoService;
