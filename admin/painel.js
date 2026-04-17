document.addEventListener('DOMContentLoaded', () => {
    
    // Verifica autenticação
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    const tbody = document.getElementById('tabela-psicologos');
    const modal = document.getElementById('modal-form');
    const form = document.getElementById('form-psicologo');
    const tituloModal = document.getElementById('modal-titulo');
    
    // Exibir nome do admin na topbar
    const user = getCurrentUser();
    const adminNameEl = document.querySelector('.admin-name');
    if (adminNameEl && user) {
        adminNameEl.textContent = user.name;
    }

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

    // Botão sair — faz logout real
    const sairBtn = document.getElementById('btn-sair');
    if (sairBtn) {
        sairBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
            window.location.href = 'login.html';
        });
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    async function renderTable() {
        try {
            const ps = await fetchPsicologos();
            tbody.innerHTML = '';
            
            if (ps.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="p-8 text-center text-gray-400">
                            <i class="fa-solid fa-inbox text-3xl mb-2 block"></i>
                            Nenhum psicólogo cadastrado.
                        </td>
                    </tr>
                `;
                return;
            }

            ps.forEach(p => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-gray-50 transition-colors group";
                tr.innerHTML = `
                    <td class="p-4 border-b border-gray-100 flex items-center gap-3">
                        <img src="${p.foto || 'https://via.placeholder.com/150'}" class="w-10 h-10 rounded-full object-cover shadow-sm">
                        <div>
                            <p class="font-bold text-ceu-noturno">${p.nome}</p>
                            <p class="text-xs text-gray-400 capitalize">${p.genero || ''}</p>
                        </div>
                    </td>
                    <td class="p-4 border-b border-gray-100 text-gray-600 text-sm">${p.crp}</td>
                    <td class="p-4 border-b border-gray-100">
                        <span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-bold">${p.abordagem}</span>
                    </td>
                    <td class="p-4 border-b border-gray-100 font-bold text-azul-serena">R$ ${p.preco}</td>
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

            // Attach listeners para botões edit e delete
            document.querySelectorAll('.btn-editar').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    editarPsicologo(id);
                });
            });

            document.querySelectorAll('.btn-excluir').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    if(confirm('Tem certeza que deseja remover este perfil?')) {
                        await excluirPsicologo(id);
                    }
                });
            });
        } catch (err) {
            console.error('Erro ao renderizar tabela:', err);
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="p-8 text-center text-red-400">
                        <i class="fa-solid fa-triangle-exclamation text-3xl mb-2 block"></i>
                        Erro ao carregar dados. Verifique se a API está rodando.
                    </td>
                </tr>
            `;
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const idCampo = document.getElementById('f-id').value;
        const isEditing = idCampo !== '';

        const especialidadesArray = document.getElementById('f-especialidades').value
                                        .split(',')
                                        .map(s => s.trim())
                                        .filter(s => s.length > 0);

        const data = {
            nome: document.getElementById('f-nome').value,
            crp: document.getElementById('f-crp').value,
            foto: document.getElementById('f-foto').value || undefined,
            genero: document.getElementById('f-genero').value,
            abordagem: document.getElementById('f-abordagem').value,
            especialidades: especialidadesArray,
            sobre: document.getElementById('f-sobre').value,
            destaque: document.getElementById('f-destaque').checked,
            disponivel: document.getElementById('f-disponivel').checked,
        };

        try {
            if (isEditing) {
                await updatePsicologo(parseInt(idCampo), data);
            } else {
                await createPsicologo(data);
            }
            closeModal();
            await renderTable();
        } catch (err) {
            alert('Erro: ' + err.message);
        }
    });

    async function editarPsicologo(id) {
        try {
            const p = await fetchPsicologoById(id);
            if(!p) return alert('Psicólogo não encontrado.');

            tituloModal.textContent = 'Editar Perfil: ' + p.nome;

            document.getElementById('f-id').value = p.id;
            document.getElementById('f-nome').value = p.nome;
            document.getElementById('f-crp').value = p.crp;
            document.getElementById('f-foto').value = p.foto || '';
            document.getElementById('f-genero').value = p.genero || 'Feminino';
            document.getElementById('f-abordagem').value = p.abordagem;
            document.getElementById('f-especialidades').value = p.especialidades.join(', ');
            document.getElementById('f-sobre').value = p.sobre || '';
            document.getElementById('f-destaque').checked = p.destaque;
            document.getElementById('f-disponivel').checked = p.disponivel;

            modal.classList.remove('hidden');
        } catch (err) {
            alert('Erro ao carregar perfil: ' + err.message);
        }
    }

    async function excluirPsicologo(id) {
        try {
            await deletePsicologo(id);
            await renderTable();
        } catch (err) {
            alert('Erro ao excluir: ' + err.message);
        }
    }
});
