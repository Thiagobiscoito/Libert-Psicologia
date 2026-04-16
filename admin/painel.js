document.addEventListener('DOMContentLoaded', () => {
    
    // Assegura inicialização
    if(typeof initFakeData === 'function') initFakeData();

    const tbody = document.getElementById('tabela-psicologos');
    const modal = document.getElementById('modal-form');
    const form = document.getElementById('form-psicologo');
    const tituloModal = document.getElementById('modal-titulo');
    
    renderTable();

    // Botões abrir/fechar modal
    document.getElementById('btn-novo').addEventListener('click', () => {
        form.reset();
        document.getElementById('f-id').value = '';
        tituloModal.textContent = 'Novo Psicólogo';
        modal.classList.remove('hidden');
    });

    document.getElementById('btn-fechar-modal').addEventListener('click', closeModal);
    document.getElementById('btn-cancelar').addEventListener('click', closeModal);

    function closeModal() {
        modal.classList.add('hidden');
    }

    function renderTable() {
        const ps = getPsicologos();
        tbody.innerHTML = '';
        
        ps.forEach(p => {
            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 transition-colors group";
            tr.innerHTML = `
                <td class="p-4 border-b border-gray-100 flex items-center gap-3">
                    <img src="${p.foto || 'https://via.placeholder.com/150'}" class="w-10 h-10 rounded-full object-cover shadow-sm">
                    <div>
                        <p class="font-bold text-ceu-noturno">${p.nome}</p>
                        <p class="text-xs text-gray-400 capitalize">${p.genero}</p>
                    </div>
                </td>
                <td class="p-4 border-b border-gray-100 text-gray-600 text-sm">${p.crp}</td>
                <td class="p-4 border-b border-gray-100">
                    <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-bold">${p.abordagem}</span>
                </td>
                <td class="p-4 border-b border-gray-100 font-bold text-azul-serena">R$ 30</td>
                <td class="p-4 border-b border-gray-100">
                    ${p.destaque ? '<i class="fa-solid fa-star text-damasco-acolhedor text-xs mr-1" title="Em Destaque"></i>' : ''}
                    ${p.disponivel 
                        ? '<span class="text-verde-equilibrio font-bold text-xs"><i class="fa-solid fa-circle text-[8px] mr-1"></i>Online</span>' 
                        : '<span class="text-gray-400 font-bold text-xs">Offline</span>'}
                </td>
                <td class="p-4 border-b border-gray-100 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="btn-editar w-8 h-8 rounded-full bg-azul-serena bg-opacity-10 text-azul-serena hover:bg-opacity-100 hover:text-white transition-colors" data-id="${p.id}"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-excluir w-8 h-8 rounded-full bg-red-500 bg-opacity-10 text-red-500 hover:bg-opacity-100 hover:text-white transition-colors ml-1" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Attach listeners para botoes edit e delete
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                editarPsicologo(id);
            });
        });

        document.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                if(confirm('Tem certeza que deseja remover este perfil?')) {
                    excluirPsicologo(id);
                }
            });
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const ps = getPsicologos();
        const idCampo = document.getElementById('f-id').value;
        const isEditing = idCampo !== '';

        const especialidadesArray = document.getElementById('f-especialidades').value
                                        .split(',')
                                        .map(s => s.trim())
                                        .filter(s => s.length > 0);

        const novoP = {
            id: isEditing ? parseInt(idCampo) : Date.now(), // Gera id unico base timestamp se for novo
            nome: document.getElementById('f-nome').value,
            crp: document.getElementById('f-crp').value,
            foto: document.getElementById('f-foto').value || 'https://via.placeholder.com/300?text=Sem+Foto',
            genero: document.getElementById('f-genero').value,
            preco: 30,
            abordagem: document.getElementById('f-abordagem').value,
            especialidades: especialidadesArray,
            sobre: document.getElementById('f-sobre').value,
            destaque: document.getElementById('f-destaque').checked,
            disponivel: document.getElementById('f-disponivel').checked,
            
            // Dados fictícios fixos para nao complicar formulário
            formacao: isEditing ? ps.find(x=>x.id==idCampo).formacao : ['Graduação em Psicologia'],
            estrelas: isEditing ? ps.find(x=>x.id==idCampo).estrelas : 5.0,
            avaliacoes: isEditing ? ps.find(x=>x.id==idCampo).avaliacoes : 0
        };

        if (isEditing) {
            const idx = ps.findIndex(p => p.id === parseInt(idCampo));
            ps[idx] = novoP;
        } else {
            ps.push(novoP);
        }

        savePsicologos(ps);
        closeModal();
        renderTable();
    });

    function editarPsicologo(id) {
        const ps = getPsicologos();
        const p = ps.find(x => x.id === id);
        if(!p) return;

        tituloModal.textContent = 'Editar Perfil: ' + p.nome;

        document.getElementById('f-id').value = p.id;
        document.getElementById('f-nome').value = p.nome;
        document.getElementById('f-crp').value = p.crp;
        document.getElementById('f-foto').value = p.foto;
        document.getElementById('f-genero').value = p.genero;
        document.getElementById('f-abordagem').value = p.abordagem;
        document.getElementById('f-especialidades').value = p.especialidades.join(', ');
        document.getElementById('f-sobre').value = p.sobre;
        document.getElementById('f-destaque').checked = p.destaque;
        document.getElementById('f-disponivel').checked = p.disponivel;

        modal.classList.remove('hidden');
    }

    function excluirPsicologo(id) {
        let ps = getPsicologos();
        ps = ps.filter(p => p.id !== id);
        savePsicologos(ps);
        renderTable();
    }
});
