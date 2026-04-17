const { db } = require('../config/database');

const psicologoRepository = {
  findAll({ search, genero, especialidade } = {}) {
    let sql = 'SELECT * FROM psicologos WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (nome LIKE ? OR abordagem LIKE ? OR especialidades LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (genero && genero !== 'all') {
      sql += ' AND genero = ?';
      params.push(genero);
    }

    if (especialidade) {
      sql += ' AND especialidades LIKE ?';
      params.push(`%${especialidade}%`);
    }

    sql += ' ORDER BY destaque DESC, estrelas DESC, id ASC';

    const rows = db.prepare(sql).all(...params);

    // Desserializa campos JSON
    return rows.map(psicologoRepository._deserialize);
  },

  findById(id) {
    const row = db.prepare('SELECT * FROM psicologos WHERE id = ?').get(id);
    return row ? psicologoRepository._deserialize(row) : null;
  },

  create(data) {
    const stmt = db.prepare(`
      INSERT INTO psicologos (nome, crp, foto, genero, abordagem, especialidades, sobre, formacao, preco, estrelas, avaliacoes, destaque, disponivel)
      VALUES (@nome, @crp, @foto, @genero, @abordagem, @especialidades, @sobre, @formacao, @preco, @estrelas, @avaliacoes, @destaque, @disponivel)
    `);

    const serialized = psicologoRepository._serialize(data);
    const result = stmt.run(serialized);
    return psicologoRepository.findById(result.lastInsertRowid);
  },

  update(id, data) {
    // Busca o registro atual para mesclar
    const current = db.prepare('SELECT * FROM psicologos WHERE id = ?').get(id);
    if (!current) return null;

    const currentDeserialized = psicologoRepository._deserialize(current);
    const merged = { ...currentDeserialized, ...data, id };
    const serialized = psicologoRepository._serialize(merged);

    db.prepare(`
      UPDATE psicologos 
      SET nome = @nome, crp = @crp, foto = @foto, genero = @genero,
          abordagem = @abordagem, especialidades = @especialidades,
          sobre = @sobre, formacao = @formacao, preco = @preco,
          estrelas = @estrelas, avaliacoes = @avaliacoes,
          destaque = @destaque, disponivel = @disponivel,
          updated_at = datetime('now')
      WHERE id = @id
    `).run({ ...serialized, id });

    return psicologoRepository.findById(id);
  },

  delete(id) {
    const result = db.prepare('DELETE FROM psicologos WHERE id = ?').run(id);
    return result.changes > 0;
  },

  /**
   * Serializa arrays para JSON string e booleanos para 0/1
   */
  _serialize(data) {
    return {
      nome: data.nome,
      crp: data.crp,
      foto: data.foto || null,
      genero: data.genero || null,
      abordagem: data.abordagem,
      especialidades: Array.isArray(data.especialidades)
        ? JSON.stringify(data.especialidades)
        : data.especialidades,
      sobre: data.sobre || null,
      formacao: Array.isArray(data.formacao)
        ? JSON.stringify(data.formacao)
        : data.formacao || '[]',
      preco: data.preco ?? 30,
      estrelas: data.estrelas ?? 5.0,
      avaliacoes: data.avaliacoes ?? 0,
      destaque: data.destaque ? 1 : 0,
      disponivel: data.disponivel ? 1 : 0,
    };
  },

  /**
   * Desserializa JSON strings para arrays e 0/1 para booleanos
   */
  _deserialize(row) {
    return {
      ...row,
      especialidades: JSON.parse(row.especialidades || '[]'),
      formacao: JSON.parse(row.formacao || '[]'),
      destaque: row.destaque === 1,
      disponivel: row.disponivel === 1,
    };
  },
};

module.exports = psicologoRepository;
