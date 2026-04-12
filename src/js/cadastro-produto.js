const API_BASE_URL = 'http://localhost:3000';

// Formatação automática de valor monetário
function formatarValor(input) {
  let valor = input.value.replace(/\D/g, '');
  
  if (valor.length === 0) {
    input.value = '';
    return;
  }
  
  // Conte para centavos
  if (valor.length === 1) {
    valor = '00' + valor;
  } else if (valor.length === 2) {
    valor = '0' + valor;
  }
  
  // Formata como moeda
  const valorFormatado = (parseInt(valor) / 100).toFixed(2);
  input.value = valorFormatado;
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
  document.querySelectorAll('input, textarea').forEach(campo => {
    campo.style.borderColor = '';
  });
}

// Verificar se ID já existe
async function verificarIDDuplicado(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/produtos/${id}`);
    return response.ok; // Se ok, ID já existe
  } catch (error) {
    console.error('Erro ao verificar ID:', error);
    return false; // Se der erro, assume que não existe
  }
}

// Validação do formulário
async function validarFormulario(dados) {
  let valido = true;
  
  // Validar ID
  if (!dados.id || dados.id.trim().length < 1) {
    mostrarErroCampo('id', 'ID é obrigatório');
    valido = false;
  } else {
    // Verificar duplicidade
    const idDuplicado = await verificarIDDuplicado(dados.id);
    if (idDuplicado) {
      mostrarErroCampo('id', 'ID já cadastrado');
      valido = false;
    }
  }
  
  // Validar nome
  if (!dados.nome || dados.nome.trim().length < 2) {
    mostrarErroCampo('nome', 'Nome deve ter pelo menos 2 caracteres');
    valido = false;
  }
  
  // Validar valor
  const valorNumerico = parseFloat(dados.valor);
  if (!dados.valor || isNaN(valorNumerico) || valorNumerico <= 0) {
    mostrarErroCampo('valor', 'Valor deve ser maior que 0');
    valido = false;
  }
  
  // Validar descrição
  if (!dados.descricao || dados.descricao.trim().length < 10) {
    mostrarErroCampo('descricao', 'Descrição deve ter pelo menos 10 caracteres');
    valido = false;
  }
  
  return valido;
}

// Cadastrar produto
async function cadastrarProduto(event) {
  event.preventDefault();
  
  limparErros();
  resetarEstilosCampos();
  
  const btnSalvar = document.getElementById('btn-salvar');
  const textoOriginal = btnSalvar.textContent;
  
  try {
    // Coletar dados do formulário
    const dados = {
      id: document.getElementById('id').value.trim(),
      nome: document.getElementById('nome').value.trim(),
      valor: document.getElementById('valor').value,
      descricao: document.getElementById('descricao').value.trim()
    };
    
    // Validar formulário
    const isValido = await validarFormulario(dados);
    if (!isValido) {
      return;
    }
    
    // Desabilitar botão e mostrar loading
    btnSalvar.disabled = true;
    btnSalvar.textContent = 'Cadastrando...';
    
    // Enviar para API
    const response = await fetch(`${API_BASE_URL}/produtos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados)
    });
    
    if (response.ok) {
      const resultado = await response.json();
      
      // Mostrar sucesso
      mostrarSucesso('Produto cadastrado com sucesso!');
      
      // Limpar formulário
      document.getElementById('cadastro-produto-form').reset();
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
      
    } else {
      const erro = await response.json();
      
      let mensagemErro = 'Erro ao cadastrar produto';
      
      if (erro.error) {
        if (erro.error.includes('ID')) {
          mostrarErroCampo('id', erro.error);
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
  const valorInput = document.getElementById('valor');
  
  // Formatar valor enquanto digita
  valorInput.addEventListener('input', function() {
    formatarValor(this);
  });
  
  // Limpar erro ao digitar
  document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', function() {
      this.style.borderColor = '';
      const erroElement = document.getElementById(`${this.id}-error`);
      if (erroElement) {
        erroElement.classList.add('hidden');
      }
    });
  });
  
  // Foco no ID ao carregar
  document.getElementById('id').focus();
});
