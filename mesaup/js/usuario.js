async function listaUsuarios() {
  const usuarios = await get('/usuario');
  renderUsuarios(usuarios);
}

async function criarUsuario() {
  const nome = document.getElementById('nome-usuario').value.trim();
  const email = document.getElementById('email-usuario').value.trim();
  const perfil = document.getElementById('perfil-usuario').value;
  if (!nome || !email) return alert('Preencha nome e email');

  await post('/usuario', { nome, email, perfil });
  document.getElementById('nome-usuario').value = '';
  document.getElementById('email-usuario').value = '';
  listaUsuarios();
}

async function deletarUsuario(id) {
  await del('/usuario/' + id);
  listaUsuarios();
}

function renderUsuarios(usuarios) {
  const container = document.getElementById('usuarios-container');

  if (!usuarios.length) {
    container.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
    return;
  }

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Perfil</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${usuarios.map(u => `
          <tr>
            <td>${u.id}</td>
            <td>${u.nome}</td>
            <td>${u.email}</td>
            <td>${u.perfil}</td>
            <td>
              <button class="btn btn-danger" onclick="deletarUsuario(${u.id})">Excluir</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

listaUsuarios();
