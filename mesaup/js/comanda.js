async function carregaMesas() {
  try {
    const mesas = await get('/mesa');
    const select = document.getElementById('select-mesa');
    select.innerHTML = mesas
      .filter(m => m.status === 'LIVRE' || m.status === 'OCUPADA')
      .map(m => `<option value="${m.id}">Mesa ${m.numero} (${m.status})</option>`)
      .join('');
  } catch (e) {
    console.error('Erro ao carregar mesas:', e.message);
  }
}

async function carregaUsuarios() {
  try {
    const usuarios = await get('/usuario');
    const select = document.getElementById('select-usuario');
    select.innerHTML = usuarios.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
  } catch (e) {
    console.error('Erro ao carregar usuários:', e.message);
  }
}

async function abrirComanda() {
  const mesaId = document.getElementById('select-mesa').value;
  const usuarioId = document.getElementById('select-usuario').value;
  if (!mesaId || !usuarioId) return alert('Selecione a mesa e o usuário');

  try {
    const comanda = await postParams('/comanda/abrir', { mesaId, usuarioId });
    alert('Comanda aberta! ID: ' + comanda.id);
    document.getElementById('comanda-container').innerHTML = renderComanda(comanda);
    carregaMesas();
  } catch (e) {
    alert('Erro ao abrir comanda: ' + e.message);
  }
}

async function buscarPorMesa() {
  const mesaId = document.getElementById('select-mesa').value;
  if (!mesaId) return alert('Selecione uma mesa');

  try {
    const comanda = await get('/comanda/mesa/' + mesaId);
    document.getElementById('comanda-container').innerHTML = renderComanda(comanda);
  } catch (e) {
    document.getElementById('comanda-container').innerHTML = '<p>Nenhuma comanda aberta nessa mesa.</p>';
  }
}

async function adicionarItem() {
  const comandaId = document.getElementById('input-comanda-id').value;
  const produtoId = document.getElementById('select-produto').value;
  const quantidade = document.getElementById('input-quantidade').value;
  if (!comandaId || !produtoId || !quantidade) return alert('Preencha todos os campos');

  try {
    const comanda = await postParams('/comanda/adicionar', { comandaId, produtoId, quantidade });
    document.getElementById('comanda-container').innerHTML = renderComanda(comanda);
  } catch (e) {
    alert('Erro ao adicionar item: ' + e.message);
  }
}

async function fecharComanda(comandaId) {
  try {
    await putSemBody('/comanda/fechar/' + comandaId);
    alert('Comanda fechada!');
    document.getElementById('comanda-container').innerHTML = '';
    carregaMesas();
  } catch (e) {
    alert('Erro ao fechar comanda: ' + e.message);
  }
}

function renderComanda(c) {
  const itens = c.comandaItens || c.itens || [];
  return `
    <div class="card-comanda">
      <h3>Comanda #${c.id} — Mesa ${c.mesa?.numero ?? '—'}</h3>
      <p>Status: <strong>${c.statusComanda ?? c.status ?? '—'}</strong></p>
      <p>Aberta por: <strong>${c.funcionario?.nome ?? '—'}</strong></p>
      <p>Total: <strong>R$ ${parseFloat(c.total || 0).toFixed(2)}</strong></p>
      ${itens.length ? `
        <table>
          <thead><tr><th>Produto</th><th>Qtd</th><th>Subtotal</th></tr></thead>
          <tbody>
            ${itens.map(i => `
              <tr>
                <td>${i.produto?.nome ?? '—'}</td>
                <td>${i.quantidade}</td>
                <td>R$ ${parseFloat(i.subtotal || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : '<p>Sem itens ainda.</p>'}
      <br>
      <button class="btn btn-danger" onclick="fecharComanda(${c.id})">Fechar Comanda</button>
    </div>
  `;
}
async function carregaProdutos() {
  try {
    const produtos = await get('/produto');
    const select = document.getElementById('select-produto');
    select.innerHTML = produtos.map(p => `<option value="${p.id}">${p.nome} — R$ ${parseFloat(p.preco).toFixed(2)}</option>`).join('');
  } catch (e) {
    console.error('Erro ao carregar produtos:', e.message);
  }
}

carregaMesas();
carregaUsuarios();
carregaProdutos();
