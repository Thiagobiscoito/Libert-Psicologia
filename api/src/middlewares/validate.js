/**
 * Middleware genérico de validação Zod
 * Recebe um schema e valida req.body
 *
 * Uso: router.post('/', validate(mySchema), controller.create)
 */
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      }));

      return res.status(400).json({
        error: 'Dados inválidos.',
        detalhes: errors,
      });
    }

    // Substitui o body pelo dado já validado/transformado
    req.body = result.data;
    next();
  };
}

module.exports = validate;
