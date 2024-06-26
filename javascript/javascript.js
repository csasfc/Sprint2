// Variáveis
let filtroDePesquisa = 'nome' // Para saber o filtro de pesquisa

// Adicionando o JSON ao localStorage quando a página iniciar
document.addEventListener('DOMContentLoaded', () => {
  const dadosDoLocalStorage = localStorage.getItem('dadosPalestras')

  // Caso não exista, criar um
  if (dadosDoLocalStorage === null) {
    localStorage.setItem('dadosPalestras', JSON.stringify({
      idGlobal: 0,
      palestras: [],
    }))
  }
})

// Adicionando event listener para o form
document.getElementById('cadastro-form').addEventListener('submit', (event) => {
  // Parando o F5 da página automático
  event.preventDefault()

  // Função para mostrar um erro no formulário
  function mostrarErro(texto) {
    const erro = document.getElementById('form-error')

    if (!erro.classList.contains('form-error-active')) {
      erro.classList.add('form-error-active')
    }

    erro.textContent = texto
  }

  function tirarErro() {
    const erro = document.getElementById('form-error')

    if (erro.classList.contains('form-error-active')) {
      erro.classList.remove('form-error-active')
    }

    erro.textContent = ''
  }

  function validarHorario(horario) {
    for (let i = 0; i < horario.length; i++) {
      if (i < 2) {
        if (isNaN(parseInt(horario[i]))) {
          mostrarErro('O horário precisa conter somente números dividos por ":"')
          return false
        }
      }
      else if (i == 2) {
        if (horario[i] !== ':') {
          mostrarErro('O horário precisa estar divido por ":"')
          return false
        }
      }
      else if (i < 6) {
        if (isNaN(parseInt(horario[i]))) {
          mostrarErro('O horário precisa conter somente números dividos por ":"')
          return false
        }
      }
      else {
        mostrarErro('O horário contem 4 números dividos por ":"')
        return false
      }
    }

    if (horario.length !== 5) {
      mostrarErro('O horário precisa conter 4 números dividos por ":"')
      return false
    }

    // Tirando o erro caso ele esteja na tela
    tirarErro()
    return true
  }

  function cadastrarPalestras(dados) {
    // Recebendo dados
    const dadosDoLocalStorage = JSON.parse(localStorage.getItem('dadosPalestras'));

    // Colocando id
    const id = dadosDoLocalStorage.idGlobal;
    dadosDoLocalStorage.idGlobal++ // Incrementando o idGlobal
    dados.id = id

    // Adicionando palestra nos dados
    dadosDoLocalStorage.palestras.push(dados)

    // Atualizando o localStorage
    localStorage.setItem('dadosPalestras', JSON.stringify(dadosDoLocalStorage))

    // Limpando o formulário
    document.getElementById('cadastro-form').reset()
  }

  // Recebendo os dados do formulário
  const formData = new FormData(event.target)

  const formParametros = {}

  // Tratando os dados para serem um objeto
  let teveErro = false // Variável para saber se houve um erro

  formData.forEach((value, key) => {
    if (!teveErro) {
      switch (key) {
        case 'nome_palestra': {
          if (value.length < 5) {
            mostrarErro('O nome precisa conter pelo menos 5 caracteres')
            teveErro = true
            return
          }

          tirarErro()

          break
        }
        case 'saida_palestra': {
          if (value.length < 2) {
            mostrarErro('A saída da palestra precisa conter pelo menos 2 caracteres')
            teveErro = true
            return
          }

          tirarErro()

          break
        }
        
        case 'horario_saida_palestra': {
          const validado = validarHorario(value)

          if (!validado) {
            // Parando o código caso a validação falhe
            teveErro = true
            return
          }

          break
        }
        case 'horario_destino_palestra': {
          const validado = validarHorario(value)

          if (!validado) {
            // Parando o código caso a validação falhe
            teveErro = true
            return
          }

          break
        }
        case 'data_saida_palestra': {
          break
        }
        case 'data_chegada_palestra': {
          break
        }
        case 'info_palestra': {
          break
        }
        default: {
          teveErro = true
          console.error('Key inesperada no tratamento de dados do form: ', key)
        }
      }

      formParametros[key] = value;
    }
  })

  // Validando intervalo de datas
  const dataSaida = new Date(formParametros['data_saida_palestra'])
  const dataChegada = new Date(formParametros['data_chegada_palestra'])

  // Validando a data
  if (dataSaida > dataChegada) {
    mostrarErro('A data de saída não pode ser maior que a data de chegada')
    teveErro = true
    return
  }

  if (dataSaida > new Date()) {
    mostrarErro('A data de saída não pode ser maior que a data atual')
    teveErro = true
    return
  }

  if (dataChegada > new Date()) {
    mostrarErro('A data de chegada não pode ser maior que a data atual')
    teveErro = true
    return
  }

  if (teveErro) {
    return
  }

  tirarErro()

  // Cadastrando palestra
  cadastrarPalestras(formParametros)

  alert("Palestra cadastrada!")
})

// Função para mudar a tela no clique do botão
function mudarTela(tela) {
  const listaTela = document.getElementById('lista');
  const cadastroTela = document.getElementById('cadastro');

  // Função para deixar o botão com aspecto de selecionado
  function toggleBotao(nome) {
    const botaoLista = document.getElementById('botao-lista')
    const botaoCadastro = document.getElementById('botao-cadastro')

    switch (nome) {
      case 'lista': {
        if (!botaoLista.classList.contains('side-button-active')) {
          botaoLista.classList.add('side-button-active')
        }
        if (botaoCadastro.classList.contains('side-button-active')) {
          botaoCadastro.classList.remove('side-button-active')
        }
        break
      }
      case 'cadastro': {
        if (!botaoCadastro.classList.contains('side-button-active')) {
          botaoCadastro.classList.add('side-button-active')
        }
        if (botaoLista.classList.contains('side-button-active')) {
          botaoLista.classList.remove('side-button-active')
        }
        break
      }
      default: {
        console.error('Erro interno ao fazer highlight no botao!')
      }
    }
  }

  // Trocando as telas
  switch (tela) {
    case 'lista': {
      if (!listaTela.classList.contains('block')) {
        listaTela.classList.add('block')
      }
      if (cadastroTela.classList.contains('flex')) {
        cadastroTela.classList.remove('flex')
      }

      // Fazendo o botão ficar selecionado
      toggleBotao('lista')

      mostrarListagem()
      break
    }
    case 'cadastro': {
      if (listaTela.classList.contains('block')) {
        listaTela.classList.remove('block')
      }
      if (!cadastroTela.classList.contains('flex')) {
        cadastroTela.classList.add('flex')
      }

      toggleBotao('cadastro')
      break
    }
    default: {
      console.error('Tela inesperada, ERRO!')
    }
  }
}

function excluirPalestra(id) {
  // Recebendo os dados
  const dadosDoLocalStorage = JSON.parse(localStorage.getItem('dadosPalestras'))

  const novosDados = dadosDoLocalStorage.palestras.filter((emb) => {
    if (emb.id !== id) {
      return emb
    }
  })

  dadosDoLocalStorage.palestras = novosDados

  localStorage.setItem('dadosPalestras', JSON.stringify(dadosDoLocalStorage))
  mostrarListagem()
}

function mostrarListagem() {
  // Recebendo os dados
  const dadosDoLocalStorage = JSON.parse(localStorage.getItem('dadosPalestras'))
  const palestras = dadosDoLocalStorage.palestras

  // Limpando a listagem
  const lista = document.getElementById('listagem')
  lista.innerHTML = ''

  // Criando a listagem
  let listaHTML = ''

  // Recebendo o input de pesquisa
  const inputPesquisa = document.getElementById('input-pesquisa')

  // Caso o input de pesquisa esteja vazio
  if (inputPesquisa.value === '') {
    for (let i = 0; i < palestras.length; i++) {
      listaHTML += `
      <div class="palestra-card">
      <p>Nome da Palestra: ${palestras[i].nome_palestra}</p>
      <p>Data da Palestra: ${palestras[i].data_saida_palestra}</p>
      <p>Horário da Palestra: ${palestras[i].horario}</p>
      <p>Informações Adicionais:</p>
      <p>${palestras[i].info_palestra === '' ? '(vazio)' : palestras[i].info_palestra}</p>
      <button onclick="excluirpalestra(${palestras[i].id})">Excluir</button>
      </div>
      `
    }

  }
  // Caso o input de pesquisa tenha conteúdo
  else {
    for (let i = 0; i < palestras.length; i++) {
      if (filtroDePesquisa === 'nome' && palestras[i].nome_palestra.includes(inputPesquisa.value)) {
        listaHTML += `
       <div class="palestra-card">
      <p>Nome da Palestra: ${palestras[i].nome_palestra}</p>
      <p>Data da Palestra: ${palestras[i].data_saida_palestra}</p>
      <p>Horário da Palestra: ${palestras[i].horario}</p>
      <p>Informações Adicionais:</p>
      <p>${palestras[i].info_palestra === '' ? '(vazio)' : palestras[i].info_palestra}</p>
      <button onclick="excluirpalestra(${palestras[i].id})">Excluir</button>
      </div>
      `
      } else if (filtroDePesquisa === 'info' && palestras[i].info_palestra.includes(inputPesquisa.value)) {
        listaHTML += `
        <div class="palestra-card">
      <p>Nome da Palestra: ${palestras[i].nome_palestra}</p>
      <p>Data da Palestra: ${palestras[i].data_saida_palestra}</p>
      <p>Horário da Palestra: ${palestras[i].horario}</p>
      <p>Informações Adicionais:</p>
      <p>${palestras[i].info_palestra === '' ? '(vazio)' : palestras[i].info_palestra}</p>
      <button onclick="excluirpalestra(${palestras[i].id})">Excluir</button>
      </div>
      `
      } else if (filtroDePesquisa === 'saida' && palestras[i].saida_palestra.includes(inputPesquisa.value)) {
        listaHTML += `
        <div class="palestra-card">
      <p>Nome da Palestra: ${palestras[i].nome_palestra}</p>
      <p>Data da Palestra: ${palestras[i].data_saida_palestra}</p>
      <p>Horário da Palestra: ${palestras[i].horario}</p>
      <p>Informações Adicionais:</p>
      <p>${palestras[i].info_palestra === '' ? '(vazio)' : palestras[i].info_palestra}</p>
      <button onclick="excluirpalestra(${palestras[i].id})">Excluir</button>
      </div>
      `
      } else if (filtroDePesquisa === 'destino' && palestras[i].destino_palestra.includes(inputPesquisa.value)) {
        listaHTML += `
       <div class="palestra-card">
      <p>Nome da Palestra: ${palestras[i].nome_palestra}</p>
      <p>Data da Palestra: ${palestras[i].data_saida_palestra}</p>
      <p>Horário da Palestra: ${palestras[i].horario}</p>
      <p>Informações Adicionais:</p>
      <p>${palestras[i].info_palestra === '' ? '(vazio)' : palestras[i].info_palestra}</p>
      <button onclick="excluirpalestra(${palestras[i].id})">Excluir</button>
      </div>
      `
      }
    }
  }

  lista.innerHTML = listaHTML
}

function trocarFiltro(filtro) {
  const buttonFiltroNome = document.getElementById('button-filtro-nome')
  const buttonFiltroInfo = document.getElementById('button-filtro-info')
  const buttonFiltroSaida = document.getElementById('button-filtro-saida')
  const buttonFiltroDestino = document.getElementById('button-filtro-destino')

  switch (filtro) {
    case 'nome': {
      filtroDePesquisa = filtro

      if (!buttonFiltroNome.classList.contains('button-filtro-selected')) {
        buttonFiltroNome.classList.add('button-filtro-selected')
      }

      buttonFiltroInfo.classList.remove('button-filtro-selected')
      buttonFiltroSaida.classList.remove('button-filtro-selected')
      buttonFiltroDestino.classList.remove('button-filtro-selected')

      break
    }
    case 'info': {
      filtroDePesquisa = filtro

      if (!buttonFiltroInfo.classList.contains('button-filtro-selected')) {
        buttonFiltroInfo.classList.add('button-filtro-selected')
      }

      buttonFiltroNome.classList.remove('button-filtro-selected')
      buttonFiltroSaida.classList.remove('button-filtro-selected')
      buttonFiltroDestino.classList.remove('button-filtro-selected')

      break
    }
    case 'saida': {
      filtroDePesquisa = filtro

      if (!buttonFiltroSaida.classList.contains('button-filtro-selected')) {
        buttonFiltroSaida.classList.add('button-filtro-selected')
      }

      buttonFiltroInfo.classList.remove('button-filtro-selected')
      buttonFiltroNome.classList.remove('button-filtro-selected')
      buttonFiltroDestino.classList.remove('button-filtro-selected')

      break
    }
    case 'destino': {
      filtroDePesquisa = filtro

      if (!buttonFiltroDestino.classList.contains('button-filtro-selected')) {
        buttonFiltroDestino.classList.add('button-filtro-selected')
      }

      buttonFiltroInfo.classList.remove('button-filtro-selected')
      buttonFiltroSaida.classList.remove('button-filtro-selected')
      buttonFiltroNome.classList.remove('button-filtro-selected')

      break
    }
    default: {
      console.error('Filtro inesperado, ERRO!', filtro)
      break
    }
  }
}