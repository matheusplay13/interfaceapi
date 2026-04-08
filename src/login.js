// Função para formatar CPF
function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return cpf;
}

// Função para validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let soma = 0;
  let resto;
  
  // Validação do primeiro dígito
  for (let i = 1; i <= 9; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  
  // Validação do segundo dígito
  soma = 0;
  for (let i = 1; i <= 10; i++) {
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  
  return true;
}

// Função principal de login
async function fazerLogin(event) {
  event.preventDefault();
  
  const cpfInput = document.getElementById('cpf-login');
  const senhaInput = document.getElementById('senha-login');
  const erroDiv = document.getElementById('erro-login');
  const loginButton = document.querySelector('.btn-login');
  
  const cpf = cpfInput.value.trim();
  const senha = senhaInput.value.trim();
  
  // Limpa mensagens de erro anteriores
  erroDiv.classList.add('hidden');
  erroDiv.textContent = '';
  
  // Validação do CPF
  if (!cpf) {
    mostrarErro('Por favor, digite seu CPF.');
    return;
  }
  
  if (!validarCPF(cpf)) {
    mostrarErro('CPF inválido. Verifique os dígitos informados.');
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
    await autenticarUsuario(cpf, senha);
    
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

// Função de autenticação (simulação)
async function autenticarUsuario(cpf, senha) {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Dados de teste (substitua por chamada à API real)
  const usuariosTeste = [
    { cpf: '12345678909', senha: 'admin123' },
    { cpf: '98765432100', senha: 'user123' },
    { cpf: '11122233344', senha: 'test123' }
  ];
  
  // Remove formatação do CPF para comparação
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  // Verifica se o usuário existe
  const usuario = usuariosTeste.find(u => u.cpf === cpfLimpo && u.senha === senha);
  
  if (!usuario) {
    throw new Error('CPF ou senha incorretos. Tente novamente.');
  }
  
  // Salva dados do usuário no localStorage
  localStorage.setItem('usuarioLogado', JSON.stringify({
    cpf: cpfLimpo,
    dataLogin: new Date().toISOString()
  }));
  
  return usuario;
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

// Formatação automática do CPF
document.addEventListener('DOMContentLoaded', function() {
  const cpfInput = document.getElementById('cpf-login');
  
  if (cpfInput) {
    cpfInput.addEventListener('input', function(e) {
      let valor = e.target.value;
      valor = formatarCPF(valor);
      e.target.value = valor;
    });
    
    cpfInput.addEventListener('keypress', function(e) {
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

// Função para "Cadastre-se"
document.addEventListener('DOMContentLoaded', function() {
  const cadastreSeLink = document.querySelector('.login-footer a');
  
  if (cadastreSeLink) {
    cadastreSeLink.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Funcionalidade de cadastro em desenvolvimento. Entre em contato com o administrador.');
    });
  }
});
