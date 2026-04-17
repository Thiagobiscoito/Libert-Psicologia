const { z } = require('zod');

const loginSchema = z.object({
  email: z
    .string({ required_error: 'E-mail é obrigatório.' })
    .email('E-mail inválido.'),
  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(4, 'Senha deve ter no mínimo 4 caracteres.'),
});

const registerSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório.' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres.'),
  email: z
    .string({ required_error: 'E-mail é obrigatório.' })
    .email('E-mail inválido.'),
  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(6, 'Senha deve ter no mínimo 6 caracteres.'),
});

module.exports = { loginSchema, registerSchema };
