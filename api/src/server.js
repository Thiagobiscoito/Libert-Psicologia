require('dotenv').config();

const app = require('./app');
const { initDatabase } = require('./config/database');

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    // Inicializa o banco de dados (migrations + seed)
    await initDatabase();

    app.listen(PORT, () => {
      console.log('');
      console.log('🟢 ════════════════════════════════════════════');
      console.log(`   Liberté Psicologia API`);
      console.log(`   Rodando em: http://localhost:${PORT}`);
      console.log(`   Endpoints:  http://localhost:${PORT}/api`);
      console.log('🟢 ════════════════════════════════════════════');
      console.log('');
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar o servidor:', err);
    process.exit(1);
  }
}

start();
