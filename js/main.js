// Utils and initial data setup
document.addEventListener('DOMContentLoaded', () => {
  initFakeData();
  setupMobileMenu();
});

function initFakeData() {
  if (!localStorage.getItem('liberte_psicologos')) {
    const psicologos = [
      {
        id: 1,
        nome: 'Dra. Ana Clara Fontes',
        crp: '06/123456',
        foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop', // generic photo
        especialidades: ['Ansiedade', 'Burnout'],
        abordagem: 'TCC',
        preco: 30,
        genero: 'Feminino',
        sobre: 'Ajudo profissionais a reencontrarem o equilíbrio entre vida pessoal e carreira, utilizando a Terapia Cognitivo-Comportamental de forma focada e empática.',
        formacao: ['Graduação em Psicologia - USP', 'Especialização TCC - CETCC'],
        estrelas: 4.9,
        avaliacoes: 120,
        destaque: true,
        disponivel: true
      },
      {
        id: 2,
        nome: 'Dr. Marcos Albuquerque',
        crp: '05/987654',
        foto: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=600&auto=format&fit=crop',
        especialidades: ['Luto', 'Depressão'],
        abordagem: 'Psicanálise',
        preco: 30,
        genero: 'Masculino',
        sobre: 'Minha clínica é voltada ao acolhimento de questões existenciais e processos de elaboração do luto.',
        formacao: ['Graduação em Psicologia - UFRJ', 'Formação em Psicanálise - Sedes'],
        estrelas: 4.8,
        avaliacoes: 85,
        destaque: true,
        disponivel: false
      },
      {
        id: 3,
        nome: 'Dra. Sofia Lima',
        crp: '06/334455',
        foto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop',
        especialidades: ['Terapia de Casal', 'Relacionamentos'],
        abordagem: 'Fenomenologia',
        preco: 30,
        genero: 'Feminino',
        sobre: 'Trabalho com casais e indivíduos que buscam melhora na comunicação e entendimento profundo de seus relacionamentos.',
        formacao: ['Graduação em Psicologia - PUC', 'Mestrado em Psicologia Clínica'],
        estrelas: 5.0,
        avaliacoes: 200,
        destaque: true,
        disponivel: true
      },
      {
        id: 4,
        nome: 'Dra. Beatriz Santos',
        crp: '06/778899',
        foto: 'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=600&auto=format&fit=crop',
        especialidades: ['Transição de Carreira', 'Ansiedade'],
        abordagem: 'Gestalt',
        preco: 30,
        genero: 'Feminino',
        sobre: 'Foco no momento presente e em como o indivíduo pode ressignificar sua trajetória de modo autêntico.',
        formacao: ['Graduação em Psicologia - Mackenzie'],
        estrelas: 4.7,
        avaliacoes: 60,
        destaque: false,
        disponivel: true
      }
    ];
    localStorage.setItem('liberte_psicologos', JSON.stringify(psicologos));
  }
}

function setupMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
}

function getPsicologos() {
  return JSON.parse(localStorage.getItem('liberte_psicologos') || '[]');
}

function savePsicologos(data) {
  localStorage.setItem('liberte_psicologos', JSON.stringify(data));
}
