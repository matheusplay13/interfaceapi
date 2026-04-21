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
        <h3> Teste de Conexão Bem-Sucedido!</h3>
        <p><strong>Status:</strong> ${response.status}</p>
        <p><strong>Clientes encontrados:</strong> ${data.length}</p>
        <p><strong>API respondendo:</strong> Sim</p>
        <p><strong>Servidor:</strong> localhost:3000</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="buscarTodosClientes()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
             Ver Todos os Clientes
          </button>
          <button onclick="irParaCadastro()" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
             Cadastrar Novo Cliente
          </button>
        </div>
        <details style="margin-top: 1rem;">
          <summary style="cursor: pointer; font-weight: 600; color: #667eea; padding: 0.5rem; border-radius: 8px; transition: background 0.3s ease;">
             Ver dados brutos da resposta
          </summary>
          <pre style="background: #3150705d; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.9rem; border: 1px solid #e1e8ed; margin-top: 0.5rem;">
${JSON.stringify(data, null, 2)}
          </pre>
        </details>
        <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
           Ótimo! A API está funcionando perfeitamente. Você pode usar todas as funcionalidades do sistema.
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
    
    console.log('=== INÍCIO BUSCA CPF ===');
    console.log('CPF original do input:', cpfInput.value);
    console.log('CPF limpo (apenas números):', cpf);
    console.log('URL da requisição:', `${API_BASE_URL}/clientes/${cpf}`);
    
    // Teste se API está respondendo
    try {
      console.log('Testando conexão com API...');
      const testResponse = await fetch(`${API_BASE_URL}/clientes`);
      console.log('API está online? Status:', testResponse.status);
      
      if (!testResponse.ok) {
        throw new Error('API não está respondendo corretamente');
      }
      
      const todosClientes = await testResponse.json();
      console.log('Todos os clientes na API:', todosClientes);
      console.log('Procurando CPF:', cpf, 'na lista de clientes');
      
      // Normaliza o CPF de busca (remove formatação e converte para string)
      const cpfNormalizado = String(cpf).replace(/\D/g, '');
      console.log('CPF normalizado para busca:', cpfNormalizado);
      
      // Análise detalhada dos clientes com normalização
      console.log('=== ANÁLISE DE CLIENTES ===');
      todosClientes.forEach((cliente, index) => {
        // Normaliza o CPF do cliente (remove formatação)
        const cpfClienteNormalizado = String(cliente.cpf).replace(/\D/g, '');
        
        console.log(`Cliente ${index + 1}:`, {
          cpfOriginal: cliente.cpf,
          cpfNormalizado: cpfClienteNormalizado,
          tipoCPF: typeof cliente.cpf,
          nome: cliente.nome,
          comparacaoNormalizada: cpfClienteNormalizado === cpfNormalizado
        });
      });
      console.log('=== FIM ANÁLISE ===');
      
      // Busca usando CPF normalizado
      const clienteEncontrado = todosClientes.find(c => {
        const cpfClienteNormalizado = String(c.cpf).replace(/\D/g, '');
        return cpfClienteNormalizado === cpfNormalizado;
      });
      
      console.log('Cliente encontrado na busca normalizada:', clienteEncontrado);
      
      if (!clienteEncontrado) {
        console.log('CPF não encontrado na base de dados');
        resultadoDiv.innerHTML = `
          <div class="cliente-card" style="border-left: 4px solid #f39c12;">
            <h3> Cliente Não Encontrado</h3>
            <p><strong>CPF pesquisado:</strong> ${formatarCPF(cpf)}</p>
            <p><strong>Motivo:</strong> Não há cliente cadastrado com este CPF.</p>
            <p><strong>CPFs disponíveis:</strong> ${todosClientes.map(c => formatarCPF(c.cpf)).join(', ')}</p>
            <div style="margin-top: 1.5rem;">
              <button onclick="window.location.href='cadastro-cliente.html'" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
                + Cadastrar Este Cliente
              </button>
              <button onclick="document.getElementById('cpf').focus()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
                Buscar Outro CPF
              </button>
            </div>
          </div>
        `;
        return;
      }
      
      console.log('Cliente encontrado, renderizando...');
      resultadoDiv.innerHTML = renderizarCliente(clienteEncontrado);
      
    } catch (testError) {
      console.error('Erro no teste da API:', testError);
      throw testError;
    }
    
    console.log('=== FIM BUSCA CPF ===');
    return;
    
    if (response.status === 404) {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #f39c12;">
          <h3> Cliente Não Encontrado</h3>
          <p><strong>CPF pesquisado:</strong> ${formatarCPF(cpf)}</p>
          <p><strong>Motivo:</strong> Não há cliente cadastrado com este CPF.</p>
          <p><strong>Solução:</strong> Verifique o CPF digitado ou cadastre este cliente.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="window.location.href='cadastro-cliente.html'" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              + Cadastrar Este Cliente
            </button>
            <button onclick="document.getElementById('cpf').focus()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              Buscar Outro CPF
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            Dica: Use o botão "Cadastrar Novo Cliente" para adicionar clientes novos.
          </p>
        </div>
      `;
      return;
    }
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const cliente = await response.json();
    console.log('Cliente encontrado:', cliente);
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

// Função para buscar todos os produtos
async function buscarTodosProdutos() {
  const resultadoDiv = document.getElementById('resultado');
  
  try {
    esconderErro();
    mostrarLoading();
    
    console.log('Fazendo requisição para produtos:', `${API_BASE_URL}/produtos`);
    
    const response = await fetch(`${API_BASE_URL}/produtos`);
    
    console.log('Status da resposta produtos:', response.status);
    console.log('Response OK produtos:', response.ok);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const produtos = await response.json();
    console.log('Produtos recebidos:', produtos);
    resultadoDiv.innerHTML = renderizarTodosProdutos(produtos);
    
  } catch (error) {
    console.error('Erro completo ao buscar todos os produtos:', error);
    console.error('Tipo do erro produtos:', error.name);
    console.error('Mensagem do erro produtos:', error.message);
    
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Network'))) {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3>API Offline - Acesso Bloqueado</h3>
          <p><strong>Erro:</strong> Não foi possível buscar todos os produtos.</p>
          <p><strong>Motivo:</strong> A API não está online no momento.</p>
          <p><strong>Solução:</strong> Verifique se o servidor está rodando em localhost:3000</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="testarConexaoAPI()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              Testar Conexão Novamente
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              Recarregar Página
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            Enquanto a API estiver offline, não é possível buscar produtos.
          </p>
        </div>
      `;
    } else if (error.name === 'SyntaxError') {
      mostrarErro('Erro ao processar resposta da API. Verifique o formato dos dados.');
    } else {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3>Erro ao Buscar Produtos</h3>
          <p><strong>Erro:</strong> ${error.message}</p>
          <p><strong>Motivo:</strong> Ocorreu um erro inesperado ao buscar produtos.</p>
          <p><strong>Solução:</strong> Tente novamente mais tarde ou verifique se o servidor está rodando corretamente.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="buscarTodosProdutos()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              Tentar Novamente
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              Recarregar Página
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            Se o erro persistir, verifique se o servidor está rodando corretamente.
          </p>
        </div>
      `;
    }
  }
}

// Função para renderizar produto individual
function renderizarProduto(produto) {
  return `
    <div class="cliente-card" style="border-left: 4px solid #8e44ad;">
      <h3>${produto.nome}</h3>
      <p><strong>ID:</strong> <span style="color: #8e44ad; font-weight: bold;">${produto.id}</span></p>
      <p><strong>Valor:</strong> <span style="color: #27ae60; font-weight: bold;">R$ ${parseFloat(produto.valor).toFixed(2)}</span></p>
      <p><strong>Descrição:</strong> ${produto.descricao}</p>
    </div>
  `;
}

// Função para renderizar todos os produtos
function renderizarTodosProdutos(produtos) {
  if (produtos.length === 0) {
    return `
      <div class="cliente-card" style="border-left: 4px solid #f39c12;">
        <h3> Nenhum Produto Encontrado</h3>
        <p><strong>Motivo:</strong> Não há produtos cadastrados no sistema.</p>
        <p><strong>Solução:</strong> Cadastre novos produtos usando o botão "Cadastrar Novo Produto".</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="window.location.href='cadastro-produto.html'" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            Cadastrar Primeiro Produto
          </button>
        </div>
      </div>
    `;
  }
  
  return `
    <div style="margin-bottom: 2rem;">
      <h2 style="color: #8e44ad; margin-bottom: 1rem; font-size: 1.8rem; font-weight: 700;">
        <span style="margin-right: 0.5rem;"></span>Produtos Cadastrados (${produtos.length})
      </h2>
      ${produtos.map(produto => renderizarProduto(produto)).join('')}
    </div>
  `;
}

// Função para mostrar painel de deleção
function mostrarPainelDeletar() {
  const resultadoDiv = document.getElementById('resultado');
  
  resultadoDiv.innerHTML = `
    <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
      <h3>Deletar Registro</h3>
      <p>Selecione o tipo de registro que deseja deletar:</p>
      
      <div style="margin-top: 1.5rem;">
        <button onclick="mostrarFormularioDeletarCliente()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem; margin-bottom: 0.5rem;">
          Deletar Cliente
        </button>
        <button onclick="mostrarFormularioDeletarUsuario()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem; margin-bottom: 0.5rem;">
          Deletar Usuário
        </button>
        <button onclick="mostrarFormularioDeletarProduto()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-bottom: 0.5rem;">
          Deletar Produto
        </button>
      </div>
      
      <div style="margin-top: 1rem;">
        <button onclick="document.getElementById('resultado').innerHTML='';" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
          Cancelar
        </button>
      </div>
    </div>
  `;
}

// Função para mostrar formulário de deleção de cliente
function mostrarFormularioDeletarCliente() {
  const resultadoDiv = document.getElementById('resultado');
  
  resultadoDiv.innerHTML = `
    <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
      <h3>Deletar Cliente</h3>
      <p>Digite o CPF do cliente que deseja deletar:</p>
      
      <div style="margin-top: 1rem;">
        <input type="text" id="cpf-deletar" placeholder="Ex: 123.456.789-00" maxlength="14" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 1rem;">
        
        <button onclick="deletarCliente()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
          Deletar Cliente
        </button>
        <button onclick="mostrarPainelDeletar()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
          Voltar
        </button>
      </div>
    </div>
  `;
  
  // Adicionar máscara de CPF
  document.getElementById('cpf-deletar').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    e.target.value = value;
  });
}

// Função para mostrar formulário de deleção de usuário
function mostrarFormularioDeletarUsuario() {
  const resultadoDiv = document.getElementById('resultado');
  
  resultadoDiv.innerHTML = `
    <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
      <h3>Deletar Usuário</h3>
      <p>Digite o código do usuário que deseja deletar:</p>
      
      <div style="margin-top: 1rem;">
        <input type="text" id="codigo-deletar" placeholder="Ex: 123" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 1rem;">
        
        <button onclick="deletarUsuario()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
          Deletar Usuário
        </button>
        <button onclick="mostrarPainelDeletar()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
          Voltar
        </button>
      </div>
    </div>
  `;
}

// Função para mostrar formulário de deleção de produto
function mostrarFormularioDeletarProduto() {
  const resultadoDiv = document.getElementById('resultado');
  
  resultadoDiv.innerHTML = `
    <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
      <h3>Deletar Produto</h3>
      <p>Digite o ID do produto que deseja deletar:</p>
      
      <div style="margin-top: 1rem;">
        <input type="number" id="id-deletar" placeholder="Ex: 1" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 1rem;">
        
        <button onclick="deletarProduto()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
          Deletar Produto
        </button>
        <button onclick="mostrarPainelDeletar()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
          Voltar
        </button>
      </div>
    </div>
  `;
}

// Função para deletar cliente
async function deletarCliente() {
  const cpfInput = document.getElementById('cpf-deletar');
  const resultadoDiv = document.getElementById('resultado');
  const cpf = cpfInput.value.replace(/\D/g, '');
  const cpfFormatado = formatarCPF(cpf);
  
  if (!cpf || cpf.length !== 11) {
    mostrarErro('CPF inválido. Digite um CPF válido com 11 dígitos.');
    return;
  }
  
  if (!confirm(`Tem certeza que deseja deletar o cliente com CPF ${cpfFormatado}? Esta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    mostrarLoading();
    
    console.log('=== INÍCIO DELETE CLIENTE ===');
    console.log('CPF para deletar:', cpf);
    console.log('CPF formatado:', cpfFormatado);
    console.log('URL da requisição:', `${API_BASE_URL}/clientes/${cpfFormatado}`);
    
    // Tenta deletar diretamente - se o cliente não existir, a API retornará 404
    const response = await fetch(`${API_BASE_URL}/clientes/${cpfFormatado}`, {
      method: 'DELETE'
    });
    
    console.log('Status da resposta DELETE:', response.status);
    console.log('Response OK DELETE:', response.ok);
    console.log('Headers da resposta:', response.headers);
    
    if (response.status === 404) {
      // Se não encontrar, busca todos para mostrar os CPFs disponíveis
      const checkResponse = await fetch(`${API_BASE_URL}/clientes`);
      if (checkResponse.ok) {
        const todosClientes = await checkResponse.json();
        resultadoDiv.innerHTML = `
          <div class="cliente-card" style="border-left: 4px solid #f39c12;">
            <h3>Cliente Não Encontrado</h3>
            <p><strong>CPF pesquisado:</strong> ${formatarCPF(cpf)}</p>
            <p><strong>Motivo:</strong> Não há cliente cadastrado com este CPF.</p>
            <p><strong>CPFs disponíveis:</strong> ${todosClientes.map(c => formatarCPF(c.cpf)).join(', ')}</p>
            <div style="margin-top: 1.5rem;">
              <button onclick="mostrarFormularioDeletarCliente()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
                Tentar Outro CPF
              </button>
              <button onclick="mostrarPainelDeletar()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
                Voltar
              </button>
            </div>
          </div>
        `;
      } else {
        resultadoDiv.innerHTML = `
          <div class="cliente-card" style="border-left: 4px solid #f39c12;">
            <h3>Cliente Não Encontrado</h3>
            <p><strong>CPF pesquisado:</strong> ${formatarCPF(cpf)}</p>
            <p><strong>Motivo:</strong> Não há cliente cadastrado com este CPF.</p>
            <div style="margin-top: 1.5rem;">
              <button onclick="mostrarFormularioDeletarCliente()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
                Tentar Outro CPF
              </button>
              <button onclick="mostrarPainelDeletar()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
                Voltar
              </button>
            </div>
          </div>
        `;
      }
      return;
    }
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #27ae60;">
        <h3>Cliente Deletado com Sucesso!</h3>
        <p><strong>CPF deletado:</strong> ${formatarCPF(cpf)}</p>
        <p><strong>Status:</strong> Registro removido permanentemente do sistema.</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="mostrarPainelDeletar()" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            Deletar Outro Registro
          </button>
          <button onclick="document.getElementById('resultado').innerHTML='';" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            Fechar
          </button>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
        <h3>Erro ao Deletar Cliente</h3>
        <p><strong>Erro:</strong> ${error.message}</p>
        <p><strong>Motivo:</strong> Ocorreu um erro inesperado ao deletar o cliente.</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="deletarCliente()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            Tentar Novamente
          </button>
          <button onclick="mostrarPainelDeletar()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            Voltar
          </button>
        </div>
      </div>
    `;
  }
}

// Função para deletar usuário
async function deletarUsuario() {
  const codigoInput = document.getElementById('codigo-deletar');
  const resultadoDiv = document.getElementById('resultado');
  const codigo = codigoInput.value.trim();
  
  if (!codigo) {
    mostrarErro('Código do usuário é obrigatório.');
    return;
  }
  
  if (!confirm(`Tem certeza que deseja deletar o usuário com código ${codigo}? Esta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    mostrarLoading();
    
    const response = await fetch(`${API_BASE_URL}/usuarios/${codigo}`, {
      method: 'DELETE'
    });
    
    if (response.status === 404) {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #f39c12;">
          <h3>Usuário Não Encontrado</h3>
          <p><strong>Código pesquisado:</strong> ${codigo}</p>
          <p><strong>Motivo:</strong> Não há usuário cadastrado com este código.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="mostrarFormularioDeletarUsuario()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              Tentar Outro Código
            </button>
            <button onclick="mostrarPainelDeletar()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              Voltar
            </button>
          </div>
        </div>
      `;
      return;
    }
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #27ae60;">
        <h3>Usuário Deletado com Sucesso!</h3>
        <p><strong>Código deletado:</strong> ${codigo}</p>
        <p><strong>Status:</strong> Registro removido permanentemente do sistema.</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="mostrarPainelDeletar()" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            Deletar Outro Registro
          </button>
          <button onclick="document.getElementById('resultado').innerHTML='';" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            Fechar
          </button>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
        <h3>Erro ao Deletar Usuário</h3>
        <p><strong>Erro:</strong> ${error.message}</p>
        <p><strong>Motivo:</strong> Ocorreu um erro inesperado ao deletar o usuário.</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="deletarUsuario()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            Tentar Novamente
          </button>
          <button onclick="mostrarPainelDeletar()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            Voltar
          </button>
        </div>
      </div>
    `;
  }
}

// Função para deletar produto
async function deletarProduto() {
  const idInput = document.getElementById('id-deletar');
  const resultadoDiv = document.getElementById('resultado');
  const id = idInput.value.trim();
  
  if (!id) {
    mostrarErro('ID do produto é obrigatório.');
    return;
  }
  
  if (!confirm(`Tem certeza que deseja deletar o produto com ID ${id}? Esta ação não pode ser desfeita!`)) {
    return;
  }
  
  try {
    mostrarLoading();
    
    console.log('=== INÍCIO DELETE PRODUTO ===');
    console.log('ID para deletar:', id);
    console.log('URL da requisição:', `${API_BASE_URL}/produtos/${id}`);
    
    // Primeiro, vamos verificar se o produto existe
    console.log('Verificando se produto existe...');
    const checkResponse = await fetch(`${API_BASE_URL}/produtos`);
    console.log('Status da busca de todos produtos:', checkResponse.status);
    
    if (checkResponse.ok) {
      const todosProdutos = await checkResponse.json();
      console.log('Todos os produtos:', todosProdutos);
      console.log('Procurando ID:', id, 'na lista de produtos');
      
      const produtoEncontrado = todosProdutos.find(p => {
        const produtoId = String(p.id).trim();
        const searchId = String(id).trim();
        console.log(`Comparando: produto.id="${produtoId}" vs search="${searchId}"`);
        return produtoId === searchId;
      });
      console.log('Produto encontrado para delete:', produtoEncontrado);
      
      if (!produtoEncontrado) {
        resultadoDiv.innerHTML = `
          <div class="cliente-card" style="border-left: 4px solid #f39c12;">
            <h3>Produto Não Encontrado</h3>
            <p><strong>ID pesquisado:</strong> ${id}</p>
            <p><strong>Motivo:</strong> Não há produto cadastrado com este ID.</p>
            <p><strong>IDs disponíveis:</strong> ${todosProdutos.map(p => p.id).join(', ')}</p>
            <div style="margin-top: 1.5rem;">
              <button onclick="mostrarFormularioDeletarProduto()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
                Tentar Outro ID
              </button>
              <button onclick="mostrarPainelDeletar()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
                Voltar
              </button>
            </div>
          </div>
        `;
        return;
      }
    }
    
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`, {
      method: 'DELETE'
    });
    
    console.log('Status da resposta DELETE:', response.status);
    console.log('Response OK DELETE:', response.ok);
    console.log('Headers da resposta:', response.headers);
    
    if (response.status === 404) {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #f39c12;">
          <h3>Produto Não Encontrado</h3>
          <p><strong>ID pesquisado:</strong> ${id}</p>
          <p><strong>Motivo:</strong> Não há produto cadastrado com este ID.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="mostrarFormularioDeletarProduto()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              Tentar Outro ID
            </button>
            <button onclick="mostrarPainelDeletar()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              Voltar
            </button>
          </div>
        </div>
      `;
      return;
    }
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #27ae60;">
        <h3>Produto Deletado com Sucesso!</h3>
        <p><strong>ID deletado:</strong> ${id}</p>
        <p><strong>Status:</strong> Registro removido permanentemente do sistema.</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="mostrarPainelDeletar()" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            Deletar Outro Registro
          </button>
          <button onclick="document.getElementById('resultado').innerHTML='';" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            Fechar
          </button>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
        <h3>Erro ao Deletar Produto</h3>
        <p><strong>Erro:</strong> ${error.message}</p>
        <p><strong>Motivo:</strong> Ocorreu um erro inesperado ao deletar o produto.</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="deletarProduto()" style="background: #e74c3c; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            Tentar Novamente
          </button>
          <button onclick="mostrarPainelDeletar()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            Voltar
          </button>
        </div>
      </div>
    `;
  }
}

// Função para buscar produto por ID
async function buscarProdutoPorId() {
  const idInput = document.getElementById('id-produto');
  const resultadoDiv = document.getElementById('resultado');
  const id = idInput.value;
  
  if (!id || id <= 0) {
    resultadoDiv.innerHTML = `
      <div class="cliente-card" style="border-left: 4px solid #f39c12;">
        <h3> ID Inválido</h3>
        <p><strong>Erro:</strong> O ID digitado não é válido.</p>
        <p><strong>Motivo:</strong> O ID deve ser um número positivo.</p>
        <p><strong>Solução:</strong> Digite um ID válido (ex: 1, 2, 3...)</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="document.getElementById('id-produto').focus()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            Corrigir ID
          </button>
          <button onclick="document.getElementById('id-produto').value=''; resultadoDiv.innerHTML='';" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            Limpar Campo
          </button>
        </div>
      </div>
    `;
    return;
  }
  
  try {
    esconderErro();
    mostrarLoading();
    
    console.log('Buscando produto por ID:', id);
    console.log('URL da requisição:', `${API_BASE_URL}/produtos/${id}`);
    
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
    
    console.log('Status da resposta:', response.status);
    console.log('Response OK:', response.ok);
    
    if (response.status === 404) {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #f39c12;">
          <h3> Produto Não Encontrado</h3>
          <p><strong>ID pesquisado:</strong> ${id}</p>
          <p><strong>Motivo:</strong> Não há produto cadastrado com este ID.</p>
          <p><strong>Solução:</strong> Verifique o ID digitado ou cadastre este produto.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="window.location.href='cadastro-produto.html'" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              + Cadastrar Novo Produto
            </button>
            <button onclick="document.getElementById('id-produto').focus()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              Buscar Outro ID
            </button>
          </div>
        </div>
      `;
      return;
    }
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const produto = await response.json();
    console.log('Produto encontrado:', produto);
    resultadoDiv.innerHTML = renderizarProduto(produto);
    
  } catch (error) {
    console.error('Erro ao buscar produto por ID:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3> API Offline - Acesso Bloqueado</h3>
          <p><strong>Erro:</strong> Não foi possível buscar o produto por ID.</p>
          <p><strong>Motivo:</strong> A API não está online no momento.</p>
          <p><strong>Solução:</strong> Verifique se o servidor está rodando em localhost:3000</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="testarConexaoAPI()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              Testar Conexão Novamente
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              Recarregar Página
            </button>
          </div>
        </div>
      `;
    } else {
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3> Erro ao Buscar Produto</h3>
          <p><strong>Erro:</strong> ${error.message}</p>
          <p><strong>Motivo:</strong> Ocorreu um erro inesperado ao buscar o produto.</p>
          <p><strong>Solução:</strong> Tente novamente mais tarde ou verifique se o servidor está rodando corretamente.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="buscarProdutoPorId()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              Tentar Novamente
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              Recarregar Página
            </button>
          </div>
        </div>
      `;
    }
  }
}

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
        <h3>API Offline - Acesso Bloqueado</h3>
        <p><strong>Erro:</strong> Não foi possível acessar a página de cadastro.</p>
        <p><strong>Motivo:</strong> A API não está online no momento.</p>
        <p><strong>Solução:</strong> Verifique se o servidor está rodando em localhost:3000</p>
        <div style="margin-top: 1.5rem;">
          <button onclick="testarConexaoAPI()" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
            Testar Conexão Novamente
          </button>
          <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
            Recarregar Página
          </button>
        </div>
        <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
          Enquanto a API estiver offline, não é possível cadastrar novos clientes.
        </p>
      </div>
    `;
  }
}