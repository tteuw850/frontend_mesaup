async function listaMesas() {
  try {
    const mesas = await get('/mesa');
    renderMesas(mesas);
  } catch (e) {
    renderMesas([]);
  }
}

async function buscaMesaPorStatus(status) {
  try {
    const mesas = await get('/mesa/status/' + status);
    renderMesas(mesas);
  } catch (e) {
    renderMesas([]);
  }
}

async function criarMesa() {
  const numero = document.getElementById('numero-mesa').value;
  if (!numero) return alert('Informe o número da mesa');

  try {
    await post('/mesa', { numero: parseInt(numero), status: 'LIVRE' });
    document.getElementById('numero-mesa').value = '';
    listaMesas();
  } catch (e) {
    alert('Erro ao criar mesa: ' + e.message);
  }
}

async function deletarMesa(id) {
  try {
    await del('/mesa/' + id);
    listaMesas();
  } catch (e) {
    alert('Não é possível deletar uma mesa com comanda aberta');
  }
}
async function alterarStatus(id, statusAtual, numero) {
  const opcoes = ['LIVRE','RESERVADA'];
  if (statusAtual === 'OCUPADA') {
    alert('Esta mesa está ocupada. Para liberá-la, encerre a comanda.');
    return;
  }
  const proximo = opcoes[(opcoes.indexOf(statusAtual) + 1) % opcoes.length];

  try {
    await put('/mesa/' + id, { numero: numero, status: proximo });
    listaMesas();
  } catch (e) {
    alert('Erro ao alterar status: ' + e.message);
  }
}

function renderMesas(mesas) {
  const container = document.getElementById('mesas-container');

  if (!mesas.length) {
    container.innerHTML = '<p>Nenhuma mesa encontrada.</p>';
    return;
  }

  container.innerHTML = mesas.sort((a, b) => a.numero - b.numero).map(m => `
    <div class="mesa-card ${m.status}">
      <h3>Mesa ${m.numero}</h3>
      <p>${m.status}</p>
      <div class="acoes">
        <button class="btn" onclick="alterarStatus(${m.id}, '${m.status}', ${m.numero})">Alterar</button>
        <button class="btn btn-danger" onclick="deletarMesa(${m.id})">Excluir</button>
      </div>
    </div>
  `).join('');
}

listaMesas();
