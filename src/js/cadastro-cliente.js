const API_BASE_URL = 'http://localhost:3000';

// Formatação automática de CPF
function formatarCPF(input) {
  let valor = input.value.replace(/\D/g, '');
  
  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  input.value = valor;
}

// Validação de CPF (temporariamente simplificada para teste)
function validarCPF(cpf) {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  console.log('Validando CPF:', cpf, '-> Limpo:', cpfLimpo);
  
  // Verificação básica: apenas 11 dígitos
  if (cpfLimpo.length !== 11) {
    console.log('CPF inválido: tamanho diferente de 11');
    return false;
  }
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpfLimpo)) {
    console.log('CPF inválido: todos os dígitos iguais');
    return false;
  }
  
  console.log('CPF válido (validação simplificada)!');
  return true;
}

// Limpar mensagens de erro
function limparErros() {
  document.querySelectorAll('.error-text').forEach(el => el.classList.add('hidden'));
  document.getElementById('erro-cadastro').classList.add('hidden');
  document.getElementById('sucesso-cadastro').classList.add('hidden');
}

// Mostrar erro de campo específico
function mostrarErroCampo(campoId, mensagem) {
  const erroElement = document.getElementById(`${campoId}-error`);
  erroElement.textContent = mensagem;
  erroElement.classList.remove('hidden');
  
  const campo = document.getElementById(campoId);
  campo.style.borderColor = 'var(--danger)';
  campo.focus();
}

// Mostrar erro geral
function mostrarErroGeral(mensagem) {
  const erroDiv = document.getElementById('erro-cadastro');
  erroDiv.textContent = mensagem;
  erroDiv.classList.remove('hidden');
}

// Mostrar sucesso
function mostrarSucesso(mensagem) {
  const sucessoDiv = document.getElementById('sucesso-cadastro');
  sucessoDiv.textContent = mensagem;
  sucessoDiv.classList.remove('hidden');
}

// Resetar estilos dos campos
function resetarEstilosCampos() {
  document.querySelectorAll('input').forEach(campo => {
    campo.style.borderColor = '';
  });
}

// Verificar se CPF já existe
async function verificarCPFDuplicado(cpf) {
  try {
    const response = await fetch(`${API_BASE_URL}/clientes/${cpf.replace(/\D/g, '')}`);
    return response.ok; // Se ok, CPF já existe
  } catch (error) {
    console.error('Erro ao verificar CPF:', error);
    return false; // Se der erro, assume que não existe
  }
}

// Validação do formulário
async function validarFormulario(dados) {
  console.log('Iniciando validação do formulário com dados:', dados);
  let valido = true;
  
  // Validar CPF
  console.log('Validando CPF:', dados.cpf);
  if (!validarCPF(dados.cpf)) {
    console.log('CPF inválido, mostrando erro');
    mostrarErroCampo('cpf', 'CPF inválido');
    valido = false;
  } else {
    console.log('CPF válido, verificando duplicidade');
    // Verificar duplicidade
    const cpfDuplicado = await verificarCPFDuplicado(dados.cpf);
    if (cpfDuplicado) {
      console.log('CPF já cadastrado');
      mostrarErroCampo('cpf', 'CPF já cadastrado');
      valido = false;
    } else {
      console.log('CPF não está duplicado');
    }
  }
  
  // Validar nome
  if (!dados.nome || dados.nome.trim().length < 3) {
    mostrarErroCampo('nome', 'Nome deve ter pelo menos 3 caracteres');
    valido = false;
  }
  
  // Validar idade
  const idade = parseInt(dados.idade);
  if (!idade || idade < 1 || idade > 120) {
    mostrarErroCampo('idade', 'Idade deve ser entre 1 e 120 anos');
    valido = false;
  }
  
  // Validar endereço
  if (!dados.endereco || dados.endereco.trim().length < 5) {
    mostrarErroCampo('endereco', 'Endereço é obrigatório');
    valido = false;
  }
  
  // Validar bairro
  if (!dados.bairro || dados.bairro.trim().length < 2) {
    mostrarErroCampo('bairro', 'Bairro é obrigatório');
    valido = false;
  }
  
  // Validar contato
  if (!dados.contato || dados.contato.trim().length < 3) {
    mostrarErroCampo('contato', 'Contato é obrigatório');
    valido = false;
  }
  
  return valido;
}

// Cadastrar cliente
async function cadastrarCliente(event) {
  event.preventDefault();
  
  limparErros();
  resetarEstilosCampos();
  
  const btnSalvar = document.getElementById('btn-salvar');
  const textoOriginal = btnSalvar.textContent;
  
  try {
    // Coletar dados do formulário
    const dados = {
      cpf: document.getElementById('cpf').value,
      nome: document.getElementById('nome').value.trim(),
      idade: document.getElementById('idade').value,
      endereco: document.getElementById('endereco').value.trim(),
      bairro: document.getElementById('bairro').value.trim(),
      contato: document.getElementById('contato').value.trim()
    };
    
    console.log('Dados do cliente:', dados);
    
    // Validar formulário
    const isValido = await validarFormulario(dados);
    if (!isValido) {
      return;
    }
    
    // Desabilitar botão e mostrar loading
    btnSalvar.disabled = true;
    btnSalvar.textContent = 'Cadastrando...';
    
    // Enviar para API
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados)
    });
    
    console.log('Status da resposta:', response.status);
    
    if (response.ok) {
      const resultado = await response.json();
      console.log('Cliente cadastrado:', resultado);
      
      // Mostrar sucesso
      mostrarSucesso('Cliente cadastrado com sucesso!');
      
      // Limpar formulário
      document.getElementById('cadastro-cliente-form').reset();
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
      
    } else {
      const erro = await response.json();
      console.error('Erro ao cadastrar:', erro);
      
      let mensagemErro = 'Erro ao cadastrar cliente';
      
      if (erro.error) {
        if (erro.error.includes('CPF')) {
          mostrarErroCampo('cpf', erro.error);
        } else {
          mensagemErro = erro.error;
        }
      }
      
      if (response.status === 400) {
        mostrarErroGeral(mensagemErro);
      } else {
        mostrarErroGeral('Erro no servidor. Tente novamente mais tarde.');
      }
    }
    
  } catch (error) {
    console.error('Erro completo:', error);
    mostrarErroGeral('Erro de conexão. Verifique se a API está online.');
  } finally {
    // Restaurar botão
    btnSalvar.disabled = false;
    btnSalvar.textContent = textoOriginal;
  }
}

// Voltar para dashboard
function voltarParaDashboard() {
  window.location.href = 'index.html';
}

// Configurar eventos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
  const cpfInput = document.getElementById('cpf');
  
  // Formatar CPF enquanto digita
  cpfInput.addEventListener('input', function() {
    formatarCPF(this);
  });
  
  // Limpar erro ao digitar
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function() {
      this.style.borderColor = '';
      const erroElement = document.getElementById(`${this.id}-error`);
      if (erroElement) {
        erroElement.classList.add('hidden');
      }
    });
  });
  
  // Foco no CPF ao carregar
  cpfInput.focus();
});
