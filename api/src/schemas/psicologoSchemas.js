const { z } = require('zod');

const createPsicologoSchema = z.object({
  nome: z
    .string({ required_error: 'Nome é obrigatório.' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres.'),
  crp: z
    .string({ required_error: 'CRP é obrigatório.' })
    .min(5, 'CRP inválido.'),
  foto: z
    .string()
    .url('URL da foto inválida.')
    .optional()
    .or(z.literal('')),
  genero: z
    .enum(['Feminino', 'Masculino', 'Outro'], {
      errorMap: () => ({ message: 'Gênero deve ser Feminino, Masculino ou Outro.' }),
    })
    .optional(),
  abordagem: z
    .string({ required_error: 'Abordagem é obrigatória.' })
    .min(2, 'Abordagem deve ter no mínimo 2 caracteres.'),
  especialidades: z
    .array(z.string().min(1))
    .min(1, 'Informe ao menos uma especialidade.'),
  sobre: z
    .string()
    .optional()
    .or(z.literal('')),
  formacao: z
    .array(z.string())
    .optional()
    .default([]),
  preco: z
    .number()
    .positive('Preço deve ser positivo.')
    .optional()
    .default(30),
  estrelas: z
    .number()
    .min(0)
    .max(5)
    .optional()
    .default(5.0),
  avaliacoes: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),
  destaque: z
    .boolean()
    .optional()
    .default(false),
  disponivel: z
    .boolean()
    .optional()
    .default(false),
});

const updatePsicologoSchema = createPsicologoSchema.partial();

module.exports = { createPsicologoSchema, updatePsicologoSchema };
