const API_BASE_URL = 'http://localhost:3000';

function formatarCPF(cpf) {
  const cpfStr = String(cpf).replace(/\D/g, '');
  return cpfStr
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function mostrarErro(mensagem) {
  const erroDiv = document.getElementById('erro');
  const resultadoDiv = document.getElementById('resultado-cadastro');
  
  erroDiv.textContent = mensagem;
  erroDiv.classList.remove('hidden');
  resultadoDiv.innerHTML = '';
}

function esconderErro() {
  const erroDiv = document.getElementById('erro');
  erroDiv.classList.add('hidden');
}

function mostrarLoading() {
  const resultadoDiv = document.getElementById('resultado-cadastro');
  resultadoDiv.innerHTML = '<div class="loading">Cadastrando cliente...</div>';
}

function mostrarSucesso(cliente) {
  const resultadoDiv = document.getElementById('resultado-cadastro');
  resultadoDiv.innerHTML = `
    <div class="cliente-card" style="border-left: 4px solid #27ae60;">
      <h3>✅ Cliente Cadastrado com Sucesso!</h3>
      <p><strong>Nome:</strong> ${cliente.nome}</p>
      <p><strong>CPF:</strong> <span class="cpf">${formatarCPF(String(cliente.cpf))}</span></p>
      <p><strong>Idade:</strong> ${cliente.idade} anos</p>
      <p><strong>Endereço:</strong> ${cliente.endereco}</p>
      <p><strong>Bairro:</strong> ${cliente.bairro}</p>
      <p><strong>Contato:</strong> ${cliente.contato}</p>
      <p style="margin-top: 1rem; color: #27ae60; font-weight: 600;">
        🎉 O cliente foi adicionado ao sistema com sucesso!
      </p>
      <div style="margin-top: 1.5rem;">
        <button class="btn-voltar" onclick="voltarParaInicio()" style="margin-right: 1rem;">
          🏠 Voltar para Início
        </button>
        <button class="btn-novo" onclick="limparFormulario()">
          📝 Cadastrar Outro Cliente
        </button>
      </div>
    </div>
  `;
}

function voltarParaInicio() {
  window.location.href = 'index.html';
}

function limparFormulario() {
  document.getElementById('form-cadastro').reset();
  document.getElementById('resultado-cadastro').innerHTML = '';
  esconderErro();
}

// Função para testar a API (página de cadastro)
async function testarConexaoAPI() {
  const resultadoDiv = document.getElementById('resultado-cadastro');
  
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
          <button onclick="limparFormulario()" style="background: #27ae60; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
             Cadastrar Novo Cliente
          </button>
          <button onclick="voltarParaInicio()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
             Voltar para Início
          </button>
        </div>
        <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
           Ótimo! A API está funcionando. Você pode cadastrar novos clientes normalmente.
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
          💡 Enquanto a API estiver offline, não será possível cadastrar clientes.
        </p>
      </div>
    `;
  }
}

// Formatação do CPF
document.getElementById('cpf-cadastro').addEventListener('input', function(e) {
  let value = e.target.value.replace(/\D/g, '');
  
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  
  e.target.value = value;
});

// Função para cadastrar cliente
async function cadastrarCliente(event) {
  event.preventDefault();
  
  const cpfInput = document.getElementById('cpf-cadastro');
  const nomeInput = document.getElementById('nome-cadastro');
  const idadeInput = document.getElementById('idade-cadastro');
  const enderecoInput = document.getElementById('endereco-cadastro');
  const bairroInput = document.getElementById('bairro-cadastro');
  const contatoInput = document.getElementById('contato-cadastro');
  
  const cpf = cpfInput.value.replace(/\D/g, '');
  const nome = nomeInput.value.trim();
  const idade = parseInt(idadeInput.value);
  const endereco = enderecoInput.value.trim();
  const bairro = bairroInput.value.trim();
  const contato = contatoInput.value.trim();
  
  // Validações básicas
  if (!cpf || cpf.length !== 11) {
    mostrarErro('❌ CPF inválido. Digite 11 números.');
    return;
  }
  
  if (!nome || nome.length < 2) {
    mostrarErro('❌ Nome inválido. Digite pelo menos 2 caracteres.');
    return;
  }
  
  if (!idade || idade < 1 || idade > 120) {
    mostrarErro('❌ Idade inválida. Digite um número entre 1 e 120.');
    return;
  }
  
  if (!endereco || endereco.length < 5) {
    mostrarErro('❌ Endereço inválido. Digite pelo menos 5 caracteres.');
    return;
  }
  
  if (!bairro || bairro.length < 2) {
    mostrarErro('❌ Bairro inválido. Digite pelo menos 2 caracteres.');
    return;
  }
  
  if (!contato || contato.length < 3) {
    mostrarErro('❌ Contato inválido. Digite pelo menos 3 caracteres.');
    return;
  }
  
  const clienteData = {
    cpf,
    nome,
    idade,
    endereco,
    bairro,
    contato
  };
  
  try {
    esconderErro();
    mostrarLoading();
    
    // Primeiro, verifica se o CPF já existe
    console.log('Verificando se CPF já existe:', cpf);
    const checkResponse = await fetch(`${API_BASE_URL}/clientes/${cpf}`);
    
    if (checkResponse.ok) {
      // CPF já existe
      mostrarErro('❌ Este CPF já está cadastrado no sistema. Não é possível cadastrar o mesmo cliente duas vezes.');
      return;
    }
    
    // Se chegou aqui, CPF não existe (404), então pode cadastrar
    console.log('CPF não cadastrado, prosseguindo com cadastro...');
    
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData),
      mode: 'cors'
    });
    
    console.log('Cadastro - Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro no cadastro:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const novoCliente = await response.json();
    console.log('Cliente cadastrado com sucesso:', novoCliente);
    
    // Se a API não retornar os dados completos, usa os dados do formulário
    const clienteExibicao = {
      nome: novoCliente.nome || nome,
      cpf: novoCliente.cpf || cpf,
      idade: novoCliente.idade || idade,
      endereco: novoCliente.endereco || endereco,
      bairro: novoCliente.bairro || bairro,
      contato: novoCliente.contato || contato
    };
    
    // Mostra mensagem de sucesso
    mostrarSucesso(clienteExibicao);
    
  } catch (error) {
    console.error('Erro ao cadastrar cliente:', error);
    
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Network'))) {
      const resultadoDiv = document.getElementById('resultado-cadastro');
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3>❌ API Offline - Acesso Bloqueado</h3>
          <p><strong>Erro:</strong> Não foi possível cadastrar o cliente.</p>
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
    } else if (error.name === 'SyntaxError') {
      const resultadoDiv = document.getElementById('resultado-cadastro');
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3>❌ Erro de Resposta da API</h3>
          <p><strong>Erro:</strong> Não foi possível processar a resposta do servidor.</p>
          <p><strong>Motivo:</strong> A API retornou dados em formato inesperado.</p>
          <p><strong>Solução:</strong> Verifique o formato dos dados enviados.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="cadastrarCliente(event)" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              🔄 Tentar Novamente
            </button>
            <button onclick="location.reload()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              🔄 Recarregar Página
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            💡 Verifique se todos os campos foram preenchidos corretamente.
          </p>
        </div>
      `;
    } else {
      const resultadoDiv = document.getElementById('resultado-cadastro');
      resultadoDiv.innerHTML = `
        <div class="cliente-card" style="border-left: 4px solid #e74c3c;">
          <h3>❌ Erro ao Cadastrar Cliente</h3>
          <p><strong>Erro:</strong> ${error.message}</p>
          <p><strong>Motivo:</strong> Ocorreu um erro inesperado ao tentar cadastrar.</p>
          <p><strong>Solução:</strong> Verifique os dados e tente novamente.</p>
          <div style="margin-top: 1.5rem;">
            <button onclick="cadastrarCliente(event)" style="background: #f39c12; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">
              🔄 Tentar Novamente
            </button>
            <button onclick="limparFormulario()" style="background: #667eea; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 10px; cursor: pointer;">
              🔄 Limpar Formulário
            </button>
          </div>
          <p style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">
            💡 Se o erro persistir, verifique se o servidor está funcionando corretamente.
          </p>
        </div>
      `;
    }
  }
}
