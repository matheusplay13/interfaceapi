// Função para formatar código
function formatarCodigo(codigo) {
  // Remove não-dígitos
  codigo = codigo.replace(/\D/g, '');
  
  // Limita a 10 dígitos
  if (codigo.length > 10) {
    codigo = codigo.substring(0, 10);
  }
  
  return codigo;
}

// Função para validar código
function validarCodigo(codigo) {
  // Remove formatação
  codigo = codigo.replace(/\D/g, '');
  
  // Verifica se tem pelo menos 3 dígitos
  if (codigo.length < 3) return false;
  
  // Verifica se não são todos iguais
  if (/^(\d)\1+$/.test(codigo)) return false;
  
  return true;
}

// Função principal de login
async function fazerLogin(event) {
  event.preventDefault();
  
  const codigoInput = document.getElementById('cpf-login');
  const senhaInput = document.getElementById('senha-login');
  const erroDiv = document.getElementById('erro-login');
  const loginButton = document.querySelector('.btn-login');
  
  const codigo = codigoInput.value.trim();
  const senha = senhaInput.value.trim();
  
  // Limpa mensagens de erro anteriores
  erroDiv.classList.add('hidden');
  erroDiv.textContent = '';
  
  // Validação do código
  if (!codigo) {
    mostrarErro('Por favor, digite seu código.');
    return;
  }
  
  if (!validarCodigo(codigo)) {
    mostrarErro('Código inválido. Use pelo menos 3 números.');
    return;
  }
  
  // Validação da senha
  if (!senha) {
    mostrarErro('Por favor, digite sua senha.');
    return;
  }
  
  if (senha.length < 6) {
    mostrarErro('A senha deve ter pelo menos 6 caracteres.');
    return;
  }
  
  // Desabilita o botão durante o login
  loginButton.disabled = true;
  loginButton.textContent = 'Entrando...';
  loginButton.style.opacity = '0.7';
  
  try {
    // Simulação de autenticação (substitua por sua API real)
    await autenticarUsuario(codigo, senha);
    
    // Login bem-sucedido - redireciona para a página principal
    window.location.href = 'index.html';
    
  } catch (error) {
    mostrarErro(error.message);
  } finally {
    // Reabilita o botão
    loginButton.disabled = false;
    loginButton.textContent = 'Entrar';
    loginButton.style.opacity = '1';
  }
}

// Configuração da API
const API_CONFIG = {
  baseURL: 'http://localhost:3000',
  endpoints: {
    usuarios: '/usuarios'
  }
};

// Função de autenticação via API
async function autenticarUsuario(codigo, senha) {
  console.log('=== INICIANDO AUTENTICAÇÃO ===');
  console.log('Código original:', codigo);
  console.log('Senha original:', senha);
  
  // Remove formatação do código
  const codigoLimpo = codigo.replace(/\D/g, '');
  console.log('Código limpo:', codigoLimpo);
  
  try {
    console.log('Tentando buscar usuários da API:', `${API_CONFIG.baseURL}${API_CONFIG.endpoints.usuarios}`);
    
    // Busca todos os usuários da API
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.usuarios}`);
    
    console.log('Status da resposta:', response.status);
    
    if (!response.ok) {
      console.error('Erro ao buscar usuários da API');
      throw new Error('Erro ao conectar com a API de usuários.');
    }
    
    const usuarios = await response.json();
    console.log('Usuários encontrados na API:', usuarios);
    
    // Procura usuário com código e senha correspondentes
    const usuario = usuarios.find(u => 
      u.codigo === codigoLimpo && u.senha === senha
    );
    
    console.log('Usuário encontrado:', usuario);
    
    if (!usuario) {
      console.error('Nenhum usuário encontrado com código:', codigoLimpo, 'e senha:', senha);
      throw new Error('Código ou senha incorretos. Tente novamente.');
    }
    
    // Salva dados do usuário no localStorage
    localStorage.setItem('usuarioLogado', JSON.stringify({
      id: usuario.id || Date.now(),
      nome: usuario.nome,
      codigo: codigoLimpo,
      email: usuario.email,
      dataLogin: new Date().toISOString()
    }));
    
    console.log('Login realizado com sucesso via API');
    return usuario;
    
  } catch (error) {
    console.error('ERRO NA AUTENTICAÇÃO:', error);
    console.log('=== USANDO FALLBACK ===');
    
    // Se a API falhar, tenta usar dados de teste como fallback
    console.warn('API indisponível, usando dados de teste:', error);
    
    // Dados de teste (fallback)
    const usuariosTeste = [
      { id: 1, nome: 'Administrador', codigo: '123', senha: 'admin123', email: 'admin@teste.com' },
      { id: 2, nome: 'Usuário Teste', codigo: '456', senha: 'user123', email: 'user@teste.com' },
      { id: 3, nome: 'Demo User', codigo: '789', senha: 'test123', email: 'demo@teste.com' }
    ];
    
    console.log('Usuários de teste disponíveis:', usuariosTeste.map(u => ({ codigo: u.codigo, senha: u.senha })));
    
    const usuario = usuariosTeste.find(u => u.codigo === codigoLimpo && u.senha === senha);
    console.log('Usuário encontrado no fallback:', usuario);
    
    if (!usuario) {
      console.error('Nenhum usuário encontrado com código:', codigoLimpo, 'e senha:', senha);
      throw new Error('Código ou senha incorretos. Tente novamente.');
    }
    
    // Salva dados do usuário no localStorage
    localStorage.setItem('usuarioLogado', JSON.stringify({
      id: usuario.id,
      nome: usuario.nome,
      codigo: codigoLimpo,
      email: usuario.email,
      dataLogin: new Date().toISOString()
    }));
    
    console.log('Fallback executado com sucesso');
    return usuario;
  }
}

// Função para mostrar erros
function mostrarErro(mensagem) {
  const erroDiv = document.getElementById('erro-login');
  erroDiv.textContent = mensagem;
  erroDiv.classList.remove('hidden');
  
  // Auto-remove a mensagem após 5 segundos
  setTimeout(() => {
    erroDiv.classList.add('hidden');
  }, 5000);
}

// Formatação automática do código
document.addEventListener('DOMContentLoaded', function() {
  const codigoInput = document.getElementById('cpf-login');
  
  if (codigoInput) {
    codigoInput.addEventListener('input', function(e) {
      let valor = e.target.value;
      valor = formatarCodigo(valor);
      e.target.value = valor;
    });
    
    codigoInput.addEventListener('keypress', function(e) {
      // Permite apenas números
      const char = String.fromCharCode(e.which);
      if (!/[0-9]/.test(char)) {
        e.preventDefault();
      }
    });
  }
  
  // Verifica se já existe um usuário logado
  const usuarioLogado = localStorage.getItem('usuarioLogado');
  if (usuarioLogado) {
    // Se já estiver logado, redireciona para a página principal
    window.location.href = 'index.html';
  }
});

// Função para "Esqueci minha senha"
document.addEventListener('DOMContentLoaded', function() {
  const forgotPasswordLink = document.querySelector('.forgot-password');
  
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Funcionalidade de recuperação de senha em desenvolvimento. Entre em contato com o suporte.');
    });
  }
});

