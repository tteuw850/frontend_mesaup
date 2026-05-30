async function listaProdutos() {
  const produtos = await get('/produto');
  renderProdutos(produtos);
}

async function criarProduto() {
  const nome = document.getElementById('nome-produto').value.trim();
  const preco = document.getElementById('preco-produto').value;
  if (!nome || !preco) return alert('Preencha nome e preço');

  await post('/produto', { nome, preco: parseFloat(preco) });
  document.getElementById('nome-produto').value = '';
  document.getElementById('preco-produto').value = '';
  listaProdutos();
}

async function deletarProduto(id) {
  await del('/produto/' + id);
  listaProdutos();
}

function renderProdutos(produtos) {
  const container = document.getElementById('produtos-container');

  if (!produtos.length) {
    container.innerHTML = '<p>Nenhum produto cadastrado.</p>';
    return;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${produtos.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.nome}</td>
            <td>R$ ${parseFloat(p.preco || 0).toFixed(2)}</td>
            <td>
              <button class="btn btn-danger" onclick="deletarProduto(${p.id})">Excluir</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

listaProdutos();
