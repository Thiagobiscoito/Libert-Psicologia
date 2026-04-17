const { Router } = require('express');
const psicologoController = require('../controllers/psicologoController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createPsicologoSchema, updatePsicologoSchema } = require('../schemas/psicologoSchemas');

const router = Router();

// Rotas públicas
router.get('/', psicologoController.list);
router.get('/:id', psicologoController.getById);

// Rotas protegidas (requerem JWT)
router.post('/', auth, validate(createPsicologoSchema), psicologoController.create);
router.put('/:id', auth, validate(updatePsicologoSchema), psicologoController.update);
router.delete('/:id', auth, psicologoController.delete);

module.exports = router;
