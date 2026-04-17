const { Router } = require('express');
const authController = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { loginSchema, registerSchema } = require('../schemas/authSchemas');

const router = Router();

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
