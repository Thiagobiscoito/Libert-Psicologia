const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, '../../', process.env.DB_PATH || './data/liberte.db');

// Garante que o diretório existe
const fs = require('fs');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Ativa WAL para melhor performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Cria as tabelas se não existirem
 */
function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS psicologos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      crp TEXT NOT NULL UNIQUE,
      foto TEXT,
      genero TEXT,
      abordagem TEXT NOT NULL,
      especialidades TEXT NOT NULL DEFAULT '[]',
      sobre TEXT,
      formacao TEXT DEFAULT '[]',
      preco REAL DEFAULT 30,
      estrelas REAL DEFAULT 5.0,
      avaliacoes INTEGER DEFAULT 0,
      destaque INTEGER DEFAULT 0,
      disponivel INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

/**
 * Insere dados iniciais (seed) se as tabelas estiverem vazias
 */
async function runSeed() {
  // Seed do admin padrão
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run('Administrador', 'admin@liberte.com', hashedPassword, 'admin');
    console.log('✅ Seed: Usuário admin criado (admin@liberte.com / admin123)');
  }

  // Seed dos psicólogos
  const psiCount = db.prepare('SELECT COUNT(*) as count FROM psicologos').get();
  if (psiCount.count === 0) {
    const psicologos = [
      {
        nome: 'Dra. Ana Clara Fontes',
        crp: '06/123456',
        foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
        especialidades: JSON.stringify(['Ansiedade', 'Burnout']),
        abordagem: 'TCC',
        genero: 'Feminino',
        sobre: 'Ajudo profissionais a reencontrarem o equilíbrio entre vida pessoal e carreira, utilizando a Terapia Cognitivo-Comportamental de forma focada e empática.',
        formacao: JSON.stringify(['Graduação em Psicologia - USP', 'Especialização TCC - CETCC']),
        estrelas: 4.9,
        avaliacoes: 120,
        destaque: 1,
        disponivel: 1
      },
      {
        nome: 'Dr. Marcos Albuquerque',
        crp: '05/987654',
        foto: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop',
        especialidades: JSON.stringify(['Luto', 'Depressão']),
        abordagem: 'Psicanálise',
        genero: 'Masculino',
        sobre: 'Minha clínica é voltada ao acolhimento de questões existenciais e processos de elaboração do luto.',
        formacao: JSON.stringify(['Graduação em Psicologia - UFRJ', 'Formação em Psicanálise - Sedes']),
        estrelas: 4.8,
        avaliacoes: 85,
        destaque: 1,
        disponivel: 0
      },
      {
        nome: 'Dra. Sofia Lima',
        crp: '06/334455',
        foto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop',
        especialidades: JSON.stringify(['Terapia de Casal', 'Relacionamentos']),
        abordagem: 'Fenomenologia',
        genero: 'Feminino',
        sobre: 'Trabalho com casais e indivíduos que buscam melhora na comunicação e entendimento profundo de seus relacionamentos.',
        formacao: JSON.stringify(['Graduação em Psicologia - PUC', 'Mestrado em Psicologia Clínica']),
        estrelas: 5.0,
        avaliacoes: 200,
        destaque: 1,
        disponivel: 1
      },
      {
        nome: 'Dra. Beatriz Santos',
        crp: '06/778899',
        foto: 'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=600&auto=format&fit=crop',
        especialidades: JSON.stringify(['Transição de Carreira', 'Ansiedade']),
        abordagem: 'Gestalt',
        genero: 'Feminino',
        sobre: 'Foco no momento presente e em como o indivíduo pode ressignificar sua trajetória de modo autêntico.',
        formacao: JSON.stringify(['Graduação em Psicologia - Mackenzie']),
        estrelas: 4.7,
        avaliacoes: 60,
        destaque: 0,
        disponivel: 1
      }
    ];

    const insertStmt = db.prepare(`
      INSERT INTO psicologos (nome, crp, foto, especialidades, abordagem, genero, sobre, formacao, estrelas, avaliacoes, destaque, disponivel)
      VALUES (@nome, @crp, @foto, @especialidades, @abordagem, @genero, @sobre, @formacao, @estrelas, @avaliacoes, @destaque, @disponivel)
    `);

    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insertStmt.run(item);
      }
    });

    insertMany(psicologos);
    console.log('✅ Seed: 4 psicólogos inseridos');
  }
}

/**
 * Inicializa o banco de dados
 */
async function initDatabase() {
  runMigrations();
  await runSeed();
  console.log('✅ Banco de dados SQLite inicializado:', dbPath);
}

module.exports = { db, initDatabase };
