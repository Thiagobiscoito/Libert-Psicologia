/**
 * Middleware global de tratamento de erros
 */
function errorHandler(err, req, res, next) {
  console.error('❌ Erro:', err.message);
  console.error(err.stack);

  // Erros conhecidos com statusCode definido
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Erros de constraint do SQLite (ex: UNIQUE)
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(409).json({ error: 'Registro duplicado. Este dado já existe no sistema.' });
  }

  // Erro genérico
  return res.status(500).json({ error: 'Erro interno do servidor.' });
}

module.exports = errorHandler;
