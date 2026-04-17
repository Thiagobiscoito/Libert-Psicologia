const psicologoService = require('../services/psicologoService');

const psicologoController = {
  list(req, res, next) {
    try {
      const { search, genero, especialidade } = req.query;
      const psicologos = psicologoService.list({ search, genero, especialidade });
      res.json(psicologos);
    } catch (err) {
      next(err);
    }
  },

  getById(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const psicologo = psicologoService.getById(id);
      res.json(psicologo);
    } catch (err) {
      next(err);
    }
  },

  create(req, res, next) {
    try {
      const psicologo = psicologoService.create(req.body);
      res.status(201).json(psicologo);
    } catch (err) {
      next(err);
    }
  },

  update(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const psicologo = psicologoService.update(id, req.body);
      res.json(psicologo);
    } catch (err) {
      next(err);
    }
  },

  delete(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      psicologoService.delete(id);
      res.json({ message: 'Psicólogo removido com sucesso.' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = psicologoController;
