// Configuração da API
const API_CONFIG = {
  baseURL: 'http://localhost:3000', // URL da sua API
  endpoints: {
    usuarios: '/usuarios',
    validarEmail: '/usuarios/'
  }
};

// Função para formatar CPF
function formatarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return cpf;
}

// Função para formatar telefone
function formatarTelefone(telefone) {
  telefone = telefone.replace(/\D/g, '');
  telefone = telefone.replace(/(\d{2})(\d)/, '($1) $2');
  telefone = telefone.replace(/(\d{5})(\d)/, '$1-$2');
  return telefone;
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

// Função para validar email
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Função para calcular força da senha
function calcularForcaSenha(senha) {
  let forca = 0;
  
  if (senha.length >= 8) forca += 25;
  if (senha.length >= 12) forca += 25;
  if (/[a-z]/.test(senha)) forca += 10;
  if (/[A-Z]/.test(senha)) forca += 10;
  if (/[0-9]/.test(senha)) forca += 10;
  if (/[^a-zA-Z0-9]/.test(senha)) forca += 20;
  
  return Math.min(forca, 100);
}

// Função para mostrar força da senha
function mostrarForcaSenha(senha) {
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text');
  const forca = calcularForcaSenha(senha);
  
  strengthBar.style.width = forca + '%';
  
  if (forca < 30) {
    strengthBar.style.backgroundColor = '#ff4757';
    strengthText.textContent = 'Senha fraca';
  } else if (forca < 60) {
    strengthBar.style.backgroundColor = '#ffa502';
    strengthText.textContent = 'Senha média';
  } else if (forca < 80) {
    strengthBar.style.backgroundColor = '#00ff88';
    strengthText.textContent = 'Senha forte';
  } else {
    strengthBar.style.backgroundColor = '#00ff88';
    strengthText.textContent = 'Senha muito forte';
  }
}

// Função para validar data de nascimento
function validarDataNascimento(data) {
  const dataNasc = new Date(data);
  const hoje = new Date();
  
  // Verifica se a data é válida e não está no futuro
  if (isNaN(dataNasc.getTime()) || dataNasc > hoje) return false;
  
  return true;
}

// Função para verificar se código já existe na API
async function verificarCodigoAPI(codigo) {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.usuarios}`);
    
    if (response.ok) {
      const usuarios = await response.json();
      const codigoLimpo = codigo.replace(/\D/g, '');
      const existe = usuarios.some(u => u.codigo === codigoLimpo);
      return !existe; // Retorna true se não existe
    }
    return true; // Se der erro na API, permite continuar
  } catch (error) {
    console.warn('Erro ao verificar código na API:', error);
    return true; // Se der erro na API, permite continuar
  }
}

// Função para verificar se email já existe na API
async function verificarEmailAPI(email) {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.validarEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    if (response.ok) {
      const data = await response.json();
      return !data.existe; // Retorna true se não existe
    }
    return true; // Se der erro na API, permite continuar
  } catch (error) {
    console.warn('Erro ao verificar email na API:', error);
    return true; // Se der erro na API, permite continuar
  }
}

// Função principal de cadastro
async function cadastrarUsuario(event) {
  event.preventDefault();
  
  const form = document.getElementById('cadastro-form');
  const erroDiv = document.getElementById('erro-cadastro');
  const sucessoDiv = document.getElementById('sucesso-cadastro');
  const cadastrarButton = document.querySelector('.btn-cadastrar');
  
  // Limpa mensagens anteriores
  erroDiv.classList.add('hidden');
  sucessoDiv.classList.add('hidden');
  erroDiv.textContent = '';
  sucessoDiv.textContent = '';
  
  // Coleta dados do formulário
  const formData = {
    nomeCompleto: document.getElementById('nome-completo').value.trim(),
    codigo: document.getElementById('cpf-cadastro').value.trim(),
    email: document.getElementById('email').value.trim(),
    senha: document.getElementById('senha-cadastro').value,
    confirmarSenha: document.getElementById('confirmar-senha').value,
    termos: document.getElementById('termos').checked
  };
  
  // Validações
  if (!formData.nomeCompleto || formData.nomeCompleto.length < 3) {
    mostrarErro('Nome completo deve ter pelo menos 3 caracteres.');
    return;
  }
  
  if (!validarCodigo(formData.codigo)) {
    mostrarErro('Código inválido. Use pelo menos 3 números.');
    return;
  }
  
  if (!validarEmail(formData.email)) {
    mostrarErro('E-mail inválido.');
    return;
  }
  
  if (formData.senha.length < 6) {
    mostrarErro('A senha deve ter pelo menos 6 caracteres.');
    return;
  }
  
  if (formData.senha !== formData.confirmarSenha) {
    mostrarErro('As senhas não conferem.');
    return;
  }
  
  
  if (!formData.termos) {
    mostrarErro('Você deve aceitar os termos de uso para continuar.');
    return;
  }
  
  // Desabilita o botão durante o cadastro
  cadastrarButton.disabled = true;
  cadastrarButton.textContent = 'Cadastrando...';
  cadastrarButton.style.opacity = '0.7';
  
  try {
    console.log('Iniciando cadastro de usuário...');
    
    // Verifica se código já existe (com fallback)
    let codigoDisponivel = true;
    try {
      codigoDisponivel = await verificarCodigoAPI(formData.codigo);
      console.log('Verificação de código:', codigoDisponivel);
    } catch (error) {
      console.warn('Erro ao verificar código na API, continuando...', error);
    }
    
    if (!codigoDisponivel) {
      throw new Error('Este código já está cadastrado no sistema.');
    }
    
    // Verifica se email já existe (com fallback)
    let emailDisponivel = true;
    try {
      emailDisponivel = await verificarEmailAPI(formData.email);
      console.log('Verificação de email:', emailDisponivel);
    } catch (error) {
      console.warn('Erro ao verificar email na API, continuando...', error);
    }
    
    if (!emailDisponivel) {
      throw new Error('Este e-mail já está cadastrado no sistema.');
    }
    
    // Prepara dados para enviar à API
    const dadosAPI = {
      codigo: formData.codigo.replace(/\D/g, ''),
      nome: formData.nomeCompleto,
      email: formData.email,
      senha: formData.senha // Em produção, criptografar a senha
    };
    
    console.log('Dados para API:', dadosAPI);
    
    // Tenta enviar dados para a API
    let resultado = null;
    let apiDisponivel = false;
    
    try {
      const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.usuarios}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAPI)
      });
      
      console.log('Status da resposta:', response.status);
      
      if (response.ok) {
        resultado = await response.json();
        apiDisponivel = true;
        console.log('Usuário cadastrado na API:', resultado);
      } else {
        const errorText = await response.text();
        console.error('Erro da API:', response.status, errorText);
        
        // Tenta parse do erro
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || `Erro ${response.status}: ${errorText}`);
        } catch {
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }
      }
    } catch (error) {
      console.warn('API indisponível, usando fallback local:', error);
      
      // Fallback: simula cadastro local
      resultado = {
        id: Date.now(),
        ...dadosAPI,
        mensagem: 'Usuário cadastrado localmente (API indisponível)'
      };
      
      // Salva no localStorage como backup
      const usuariosLocais = JSON.parse(localStorage.getItem('usuariosLocais') || '[]');
      usuariosLocais.push(resultado);
      localStorage.setItem('usuariosLocais', JSON.stringify(usuariosLocais));
    }
    
    // Cadastro bem-sucedido
    const mensagem = apiDisponivel 
      ? 'Usuário cadastrado com sucesso! Redirecionando para o login...'
      : 'Usuário cadastrado localmente! (API indisponível) Redirecionando para o login...';
    
    mostrarSucesso(mensagem);
    
    // Limpa formulário
    form.reset();
    document.querySelector('.strength-bar').style.width = '0%';
    document.querySelector('.strength-text').textContent = 'Força da senha';
    
    // Redireciona para o login após 3 segundos
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 3000);
    
  } catch (error) {
    console.error('Erro no cadastro:', error);
    mostrarErro(error.message);
  } finally {
    // Reabilita o botão
    cadastrarButton.disabled = false;
    cadastrarButton.textContent = 'Cadastrar';
    cadastrarButton.style.opacity = '1';
  }
}

// Função para mostrar erros
function mostrarErro(mensagem) {
  const erroDiv = document.getElementById('erro-cadastro');
  erroDiv.textContent = mensagem;
  erroDiv.classList.remove('hidden');
  
  setTimeout(() => {
    erroDiv.classList.add('hidden');
  }, 5000);
}

// Função para mostrar sucesso
function mostrarSucesso(mensagem) {
  const sucessoDiv = document.getElementById('sucesso-cadastro');
  sucessoDiv.textContent = mensagem;
  sucessoDiv.classList.remove('hidden');
}

// Função para voltar ao login
function voltarLogin() {
  window.location.href = 'login.html';
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  // Formatação automática de código
  const codigoInput = document.getElementById('cpf-cadastro');
  if (codigoInput) {
    codigoInput.addEventListener('input', function(e) {
      e.target.value = formatarCodigo(e.target.value);
    });
    
    codigoInput.addEventListener('keypress', function(e) {
      if (!/[0-9]/.test(String.fromCharCode(e.which))) {
        e.preventDefault();
      }
    });
  }
  
  
  // Verificação de força da senha
  const senhaInput = document.getElementById('senha-cadastro');
  if (senhaInput) {
    senhaInput.addEventListener('input', function(e) {
      mostrarForcaSenha(e.target.value);
    });
  }
  
  // Validação de confirmação de senha em tempo real
  const confirmarSenhaInput = document.getElementById('confirmar-senha');
  if (confirmarSenhaInput) {
    confirmarSenhaInput.addEventListener('input', function(e) {
      const senha = senhaInput.value;
      const confirmarSenha = e.target.value;
      
      if (confirmarSenha && senha !== confirmarSenha) {
        e.target.style.borderColor = '#ff4757';
      } else if (confirmarSenha && senha === confirmarSenha) {
        e.target.style.borderColor = '#00ff88';
      } else {
        e.target.style.borderColor = '';
      }
    });
  }
  
  // Links dos termos
  const termsLinks = document.querySelectorAll('.terms-link');
  termsLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Funcionalidade de visualização de termos em desenvolvimento.');
    });
  });
});
