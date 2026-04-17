// ============================================
// Liberté Psicologia — Frontend API Client
// ============================================

const API_BASE = '/api';

// ============ API Helper Functions ============

/**
 * Busca todos os psicólogos da API (com filtros opcionais via query string)
 * @param {Object} filters - { search, genero, especialidade }
 * @returns {Promise<Array>}
 */
async function fetchPsicologos(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.genero && filters.genero !== 'all') params.set('genero', filters.genero);
    if (filters.especialidade) params.set('especialidade', filters.especialidade);

    const queryString = params.toString();
    const url = `${API_BASE}/psicologos${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro ao buscar psicólogos');
    return await response.json();
  } catch (err) {
    console.error('fetchPsicologos error:', err);
    return [];
  }
}

/**
 * Busca um psicólogo pelo ID
 * @param {number} id
 * @returns {Promise<Object|null>}
 */
async function fetchPsicologoById(id) {
  try {
    const response = await fetch(`${API_BASE}/psicologos/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (err) {
    console.error('fetchPsicologoById error:', err);
    return null;
  }
}

/**
 * Cria um novo psicólogo (requer JWT)
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function createPsicologo(data) {
  const token = localStorage.getItem('liberte_token');
  const response = await fetch(`${API_BASE}/psicologos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Erro ao criar psicólogo');
  }
  return await response.json();
}

/**
 * Atualiza um psicólogo existente (requer JWT)
 * @param {number} id
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function updatePsicologo(id, data) {
  const token = localStorage.getItem('liberte_token');
  const response = await fetch(`${API_BASE}/psicologos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Erro ao atualizar psicólogo');
  }
  return await response.json();
}

/**
 * Remove um psicólogo (requer JWT)
 * @param {number} id
 * @returns {Promise<boolean>}
 */
async function deletePsicologo(id) {
  const token = localStorage.getItem('liberte_token');
  const response = await fetch(`${API_BASE}/psicologos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Erro ao remover psicólogo');
  }
  return true;
}

/**
 * Faz login e retorna { user, token }
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Erro ao fazer login');
  }
  const data = await response.json();
  // Salva token e dados do user no localStorage
  localStorage.setItem('liberte_token', data.token);
  localStorage.setItem('liberte_user', JSON.stringify(data.user));
  return data;
}

/**
 * Faz logout removendo token e dados do user
 */
function logoutUser() {
  localStorage.removeItem('liberte_token');
  localStorage.removeItem('liberte_user');
}

/**
 * Verifica se o usuário está logado (tem token válido)
 * @returns {boolean}
 */
function isAuthenticated() {
  return !!localStorage.getItem('liberte_token');
}

/**
 * Retorna os dados do user logado
 * @returns {Object|null}
 */
function getCurrentUser() {
  const user = localStorage.getItem('liberte_user');
  return user ? JSON.parse(user) : null;
}

// ============ UI Utility Functions ============

function setupMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
}

// ============ DOMContentLoaded ============

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
});
