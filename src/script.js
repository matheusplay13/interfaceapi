const API_BASE_URL = 'http://localhost:3000';

// Função para verificar se usuário está logado
function verificarUsuarioLogado() {
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  
  if (!usuarioLogado) {
    // Se não está logado, redireciona para login
    window.location.href = 'login.html';
    return null;
  }
  
  try {
    const usuario = JSON.parse(usuarioLogado);
    return usuario;
  } catch (error) {
    console.error('Erro ao parsear dados do usuário:', error);
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'login.html';
    return null;
  }
}

// Função para exibir informações do usuário
function exibirUserInfo() {
  const usuario = verificarUsuarioLogado();
  if (usuario) {
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
      userNameElement.textContent = `Olá, ${usuario.nome}`;
    }
  }
}

// Função para fazer logout
function fazerLogout() {
  // Confirmação do usuário
  if (confirm('Tem certeza que deseja sair do sistema?')) {
    // Remove dados do usuário do localStorage
    localStorage.removeItem('usuarioLogado');
    
    // Redireciona para a página de login
    window.location.href = 'login.html';
  }
}

// Verifica autenticação quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  exibirUserInfo();
});

// Função para testar a API
async function testarConexaoAPI() {
  const resultadoDiv = document.getElementById('resultado');
  
  try {
    esconderErro();
    resultadoDiv.innerHTML = '<div class="loading">Testando conexão com API...</div>';
    
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });
    
    console.log('Teste de conexão - Status:', response.status);
    console.log('Teste de conexão - Headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Teste de conexão - Dados:', data);
    
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #27ae60;">
        <h3>✅ Teste de Conexão Bem-Sucedido!</h3>
        <p><strong>Status:</strong> ${response.status}</p>
        <p><strong>Clientes encontrados:</strong> ${data.length}</p>
        <p><strong>API respondendo:</strong> Sim</p>
        <p><strong>Servidor:</strong> localhost:3000</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="buscarTodosClientes()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            👥 Ver Todos os Clientes
          </button>
          <button onclick="irParaCadastro()" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            ➕ Cadastrar Novo Cliente
          </button>
        </div>
        <details style="margin-top: 1rem;">
          <summary style="cursor: pointer; font-weight: 600; color: #667eea; padding: 0.5rem; border-radius: 8px; transition: background 0.3s ease;">
            📊 Ver dados brutos da resposta
          </summary>
          <pre style="background: #f8f9fa; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.9rem; border: 1px solid #e1e8ed; margin-top: 0.5rem;">
${JSON.stringify(data, null, 2)}
          </pre>
        </details>
        <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
          💡 Ótimo! A API está funcionando perfeitamente. Você pode usar todas as funcionalidades do sistema.
        </p>
      </div>
    `;
    
  } catch (error) {
    console.error('Teste de conexão falhou:', error);
    
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
        <h3>❌ API Offline - Falha na Conexão</h3>
        <p><strong>Erro:</strong> Não foi possível conectar à API.</p>
        <p><strong>Motivo:</strong> A API não está respondendo em localhost:3000</p>
        <p><strong>Solução:</strong> Verifique se o servidor está rodando corretamente</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="testarConexaoAPI()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            🔄 Testar Novamente
          </button>
          <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            🔄 Recarregar Página
          </button>
        </div>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-top: 1rem; border-left: 4px solid #f39c12;">
          <h4 style="color: #f39c12; margin: 0 0 0.5rem 0;">🔧 Passos para resolver:</h4>
          <ol style="margin: 0; padding-left: 1.5rem; color: #2c3e50;">
            <li>Verifique se o servidor Node.js está rodando</li>
            <li>Confirme se a porta 3000 está disponível</li>
            <li>Verifique se não há erros no console do servidor</li>
            <li>Tente reiniciar o servidor da API</li>
          </ol>
        </div>
        <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
          💡 Enquanto a API estiver offline, as funcionalidades de busca e cadastro não funcionarão.
        </p>
      </div>
    `;
  }
}

function formatarCPF(cpf) {
  // Converte para string e remove caracteres não numéricos
  const cpfStr = String(cpf).replace(/\D/g, '');
  
  // Formata como XXX.XXX.XXX-XX
  return cpfStr
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mostrarErro(mensagem) {
  const erroDiv = document.getElementById('erro');
  const resultadoDiv = document.getElementById('resultado');
  
  erroDiv.textContent = mensagem;
  erroDiv.classList.remove('hidden');
  resultadoDiv.innerHTML = '';
}

function esconderErro() {
  const erroDiv = document.getElementById('erro');
  erroDiv.classList.add('hidden');
}

function mostrarLoading() {
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '<div class="loading">Carregando...</div>';
}

function renderizarCliente(cliente) {
  return `
    <div class="cliente-card">
      <h3>${cliente.nome}</h3>
      <p><strong>CPF:</strong> <span class="cpf">${formatarCPF(String(cliente.cpf))}</span></p>
      <p><strong>Idade:</strong> ${cliente.idade} anos</p>
      <p><strong>Endereço:</strong> ${cliente.endereco}</p>
      <p><strong>Bairro:</strong> ${cliente.bairro}</p>
      <p><strong>Contato:</strong> ${cliente.contato}</p>
    </div>
  `;
}

function renderizarTodosClientes(clientes) {
  if (clientes.length === 0) {
    return '<p>Nenhum cliente encontrado.</p>';
  }
  
  return clientes.map(cliente => renderizarCliente(cliente)).join('');
}

async function buscarTodosClientes() {
  const resultadoDiv = document.getElementById('resultado');
  
  try {
    esconderErro();
    mostrarLoading();
    
    console.log('Fazendo requisição para:', `${API_BASE_URL}/clientes`);
    
    const response = await fetch(`${API_BASE_URL}/clientes`);
    
    console.log('Status da resposta:', response.status);
    console.log('Response OK:', response.ok);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const clientes = await response.json();
    console.log('Clientes recebidos:', clientes);
    resultadoDiv.innerHTML = renderizarTodosClientes(clientes);
    
  } catch (error) {
    console.error('Erro completo ao buscar todos os clientes:', error);
    console.error('Tipo do erro:', error.name);
    console.error('Mensagem do erro:', error.message);
    
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Network'))) {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3>❌ API Offline - Acesso Bloqueado</h3>
          <p><strong>Erro:</strong> Não foi possível buscar todos os clientes.</p>
          <p><strong>Motivo:</strong> A API não está online no momento.</p>
          <p><strong>Solução:</strong> Verifique se o servidor está rodando em localhost:3000</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="testarConexaoAPI()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              🔄 Testar Conexão Novamente
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              🔄 Recarregar Página
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            💡 Enquanto a API estiver offline, não é possível buscar clientes.
          </p>
        </div>
      `;
    } else if (error.name === 'SyntaxError') {
      mostrarErro('❌ Erro ao processar resposta da API. Verifique o formato dos dados.');
    } else {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3>❌ Erro ao Buscar Clientes</h3>
          <p><strong>Erro:</strong> ${error.message}</p>
          <p><strong>Motivo:</strong> Ocorreu um erro inesperado ao buscar clientes.</p>
          <p><strong>Solução:</strong> Tente novamente mais tarde ou verifique se o servidor está rodando corretamente.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="buscarTodosClientes()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              🔄 Tentar Novamente
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              🔄 Recarregar Página
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            💡 Se o erro persistir, verifique se o servidor está rodando corretamente.
          </p>
        </div>
      `;
    }
  }
}

async function buscarClientePorCpf() {
  const cpfInput = document.getElementById('cpf');
  const resultadoDiv = document.getElementById('resultado');
  const cpf = cpfInput.value.replace(/\D/g, '');
  
  if (!cpf || cpf.length !== 11) {
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #f39c12;">
        <h3>❌ CPF Inválido</h3>
        <p><strong>Erro:</strong> O CPF digitado não é válido.</p>
        <p><strong>Motivo:</strong> O CPF deve conter exatamente 11 números.</p>
        <p><strong>Solução:</strong> Digite um CPF no formato XXX.XXX.XXX-XX</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="document.getElementById('cpf').focus()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            ✏️ Corrigir CPF
          </button>
          <button onclick="document.getElementById('cpf').value=''; resultadoDiv.innerHTML='';" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              🔄 Limpar Campo
            </button>
        </div>
        <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
          💡 Exemplo válido: 123.456.789-00
        </p>
      </div>
    `;
    return;
  }
  
  try {
    esconderErro();
    mostrarLoading();
    
    const response = await fetch(`${API_BASE_URL}/clientes/${cpf}`);
    
    if (response.status === 404) {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #f39c12;">
          <h3>🔍 Cliente Não Encontrado</h3>
          <p><strong>CPF pesquisado:</strong> ${formatarCPF(cpf)}</p>
          <p><strong>Motivo:</strong> Não há cliente cadastrado com este CPF.</p>
          <p><strong>Solução:</strong> Verifique o CPF digitado ou cadastre este cliente.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="irParaCadastro()" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              ➕ Cadastrar Este Cliente
            </button>
            <button onclick="document.getElementById('cpf').focus()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              ✏️ Buscar Outro CPF
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            💡 Dica: Use o botão "Cadastrar Novo Cliente" para adicionar clientes novos.
          </p>
        </div>
      `;
      return;
    }
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const cliente = await response.json();
    resultadoDiv.innerHTML = renderizarCliente(cliente);
    
  } catch (error) {
    console.error('Erro ao buscar cliente por CPF:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3>❌ API Offline - Acesso Bloqueado</h3>
          <p><strong>Erro:</strong> Não foi possível buscar o cliente por CPF.</p>
          <p><strong>Motivo:</strong> A API não está online no momento.</p>
          <p><strong>Solução:</strong> Verifique se o servidor está rodando em localhost:3000</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="testarConexaoAPI()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              🔄 Testar Conexão Novamente
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              🔄 Recarregar Página
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            💡 Enquanto a API estiver offline, não é possível buscar clientes por CPF.
          </p>
        </div>
      `;
    } else {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3>❌ Erro ao Buscar Cliente</h3>
          <p><strong>Erro:</strong> ${error.message}</p>
          <p><strong>Motivo:</strong> Ocorreu um erro inesperado ao buscar o cliente.</p>
          <p><strong>Solução:</strong> Tente novamente mais tarde ou verifique se o servidor está rodando corretamente.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="buscarClientePorCpf()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              🔄 Tentar Novamente
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              🔄 Recarregar Página
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            💡 Se o erro persistir, verifique se o servidor está rodando corretamente.
          </p>
        </div>
      `;
    }
  }
}

document.getElementById('cpf').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  e.target.value = value;
});

// Função para navegar para página de cadastro
async function irParaCadastro() {
  try {
    // Primeiro, testa se a API está online
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Se a API está respondendo, permite navegar para o cadastro
    window.location.href = 'cadastro.html';
    
  } catch (error) {
    console.error('API está offline:', error);
    
    // Mostra erro impedindo o acesso ao cadastro
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
        <h3>❌ API Offline - Acesso Bloqueado</h3>
        <p><strong>Erro:</strong> Não foi possível acessar a página de cadastro.</p>
        <p><strong>Motivo:</strong> A API não está online no momento.</p>
        <p><strong>Solução:</strong> Verifique se o servidor está rodando em localhost:3000</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="testarConexaoAPI()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            🔄 Testar Conexão Novamente
          </button>
          <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            🔄 Recarregar Página
          </button>
        </div>
        <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
          💡 Enquanto a API estiver offline, não é possível cadastrar novos clientes.
        </p>
      </div>
    `;
  }
}