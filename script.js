/* ==========================================
   AURA DELUXE — script.js
   Cada linha tem um comentário dizendo o que ela faz.
   ========================================== */

'use strict'; // modo estrito: o navegador acusa erros comuns (como variável não declarada) em vez de ignorá-los

// ==========================================================================
// AULA 2: MENU HAMBÚRGUER (classList.toggle)
// ==========================================================================
function iniciarMenu() { // agrupa tudo do menu em uma função, para o código ficar organizado
  const botao = document.querySelector('#menu-toggle');       // "pesca" no HTML o botão hambúrguer pelo id
  const menu = document.querySelector('#menu-principal');     // "pesca" o <nav> que contém os links
  if (!botao || !menu) return;                                // se algum não existir, sai sem causar erro no resto do site

  function definirMenu(aberto) {                              // abre (true) ou fecha (false) o menu
    menu.classList.toggle('is-open', aberto);                 // com 2º argumento: true adiciona a classe, false remove
    botao.classList.toggle('is-active', aberto);              // liga/desliga a animação do hambúrguer em X
    botao.setAttribute('aria-expanded', String(aberto));      // leitores de tela: informa "true" (aberto) ou "false" (fechado)
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu'); // atualiza o nome falado do botão
  }

  botao.addEventListener('click', function () {               // quando o hambúrguer for clicado...
    definirMenu(!menu.classList.contains('is-open'));         // ...inverte o estado: aberto fecha, fechado abre
  });

  menu.querySelectorAll('a').forEach(function (link) {        // para cada link dentro do menu...
    link.addEventListener('click', function () {              // ...quando ele for clicado...
      definirMenu(false);                                     // ...fecha o menu, para não cobrir a página
    });
  });

  document.addEventListener('keydown', function (evento) {    // escuta qualquer tecla apertada na página
    if (evento.key === 'Escape' && menu.classList.contains('is-open')) { // se foi Esc e o menu está aberto
      definirMenu(false);                                     // fecha o menu
      botao.focus();                                          // devolve o foco ao botão (quem usa teclado não se perde)
    }
  });

  window.matchMedia('(min-width: 769px)').addEventListener('change', function (consulta) { // avisa quando a tela cruza 769px
    if (consulta.matches) definirMenu(false);                 // se virou desktop, garante o menu fechado
  });
}

// ==========================================================================
// AULA 2: ALTERNADOR DE TEMA CLARO / ESCURO
// ==========================================================================
function iniciarTema() {
  const botao = document.querySelector('#theme-toggle');      // botão com o ícone de sol/lua
  if (!botao) return;                                         // sem botão, não há o que fazer
  const raiz = document.documentElement;                      // a tag <html>, onde ficam as classes de tema
  const CHAVE_TEMA = 'temaPreferido';                         // nome da chave no localStorage (aparece em DevTools > Application)

  // RECUPERAÇÃO: lê o tema salvo e garante que a classe esteja no <html>
  // (o script do <head> já faz isso antes de pintar a página; aqui é a rede de segurança)
  try {                                                       // localStorage pode estar bloqueado, por isso o try/catch
    const temaSalvo = localStorage.getItem(CHAVE_TEMA);       // getItem devolve 'light', 'dark' ou null (nada salvo ainda)
    if (temaSalvo === 'light' || temaSalvo === 'dark') {      // só aceita valores válidos (ignora lixo no storage)
      raiz.classList.toggle('theme-light', temaSalvo === 'light'); // liga o claro só se foi o salvo
      raiz.classList.toggle('theme-dark', temaSalvo === 'dark');   // liga o escuro só se foi o salvo
    }
  } catch (erro) { /* sem armazenamento: segue o tema do sistema */ }

  function temaAtual() {                                      // descobre qual tema está em uso agora
    if (raiz.classList.contains('theme-light')) return 'light'; // classe manual de claro
    if (raiz.classList.contains('theme-dark')) return 'dark';   // classe manual de escuro
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; // sem escolha: segue o sistema
  }

  function atualizarRotulo() {                                // atualiza o texto lido por leitores de tela
    const claro = temaAtual() === 'light';                    // true se o tema atual é o claro
    botao.setAttribute('aria-label', claro ? 'Ativar modo escuro' : 'Ativar modo claro'); // diz para qual tema vai trocar
  }

  botao.addEventListener('click', function () {               // ao clicar no botão de tema...
    const novoTema = temaAtual() === 'light' ? 'dark' : 'light'; // ...decide o tema oposto ao atual
    raiz.classList.toggle('theme-light', novoTema === 'light'); // liga a classe do claro só se o novo tema for claro
    raiz.classList.toggle('theme-dark', novoTema === 'dark');   // liga a classe do escuro só se o novo tema for escuro
    try {                                                     // tenta guardar a escolha...
      localStorage.setItem(CHAVE_TEMA, novoTema);             // ...no navegador, para lembrar na próxima visita
      console.log(`[LocalStorage] Preferência atualizada para: ${novoTema}`); // confirma no Console (remova antes de publicar)
    } catch (erro) { /* sem armazenamento disponível: a escolha vale só nesta visita */ }
    atualizarRotulo();                                        // atualiza o texto do botão para o novo estado
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', atualizarRotulo); // se o sistema mudar de tema (sem escolha manual), o rótulo acompanha

  atualizarRotulo();                                          // ajusta o rótulo assim que a página abre
}

// ==========================================================================
// AULA 3: NEWSLETTER — VALIDAÇÃO COM REGEX E FEEDBACK VISUAL
// ==========================================================================
function iniciarNewsletter() {
  const form = document.querySelector('.newsletter-form');    // o formulário
  const input = document.querySelector('.newsletter-input');  // o campo de e-mail
  const botao = document.querySelector('.btn--form');         // o botão de enviar
  if (!form || !input || !botao) return;                      // se faltar algum, não faz nada

  const textoOriginal = botao.textContent;                    // guarda o texto do botão para restaurá-lo depois
  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;           // ^início | nome sem espaço/@ | @ | domínio | ponto | extensão | fim$

  const feedback = document.createElement('small');           // CRIA um elemento <small> novo (a mensagem)
  feedback.id = 'newsletter-feedback';                        // dá um id, usado pelo aria-describedby abaixo
  feedback.className = 'newsletter-feedback';                 // aplica o visual definido no style.css
  feedback.setAttribute('role', 'status');                    // leitores de tela entendem como mensagem de status
  feedback.setAttribute('aria-live', 'polite');               // anunciam a mensagem quando ela mudar, sem interromper
  input.parentNode.appendChild(feedback);                     // INSERE a mensagem logo abaixo do campo de e-mail
  input.setAttribute('aria-describedby', 'newsletter-feedback'); // liga o campo à sua mensagem para leitores de tela
  form.noValidate = true;                                     // desliga o aviso padrão do navegador; o nosso JS valida

  let jaInteragiu = false;                                    // só valida "ao vivo" depois da primeira interação
  let timerBotao;                                             // guarda o temporizador que restaura o botão

  function mostrarFeedback(tipo, mensagem) {                  // tipo: 'erro', 'sucesso' ou '' (limpa tudo)
    feedback.textContent = mensagem;                          // escreve o texto da mensagem
    feedback.classList.toggle('is-error', tipo === 'erro');   // cor vermelha só se for erro
    feedback.classList.toggle('is-success', tipo === 'sucesso'); // cor verde só se for sucesso
    input.classList.toggle('is-invalid', tipo === 'erro');    // borda vermelha no campo se for erro
    input.classList.toggle('is-valid', tipo === 'sucesso');   // borda verde no campo se for sucesso
    input.setAttribute('aria-invalid', String(tipo === 'erro')); // avisa leitores de tela se o campo está inválido
  }

  function validarEmail() {                                   // confere o campo e mostra o resultado
    const email = input.value.trim();                         // pega o texto digitado, sem espaços nas pontas

    if (email === '') {                                       // campo vazio
      mostrarFeedback('erro', 'Digite seu e-mail para continuar.'); // mostra o erro
      return false;                                           // devolve "inválido"
    }

    if (!REGEX_EMAIL.test(email)) {                           // .test() devolve false se o texto não segue o padrão
      mostrarFeedback('erro', 'Por favor, digite um e-mail válido (ex: nome@dominio.com).'); // mostra o erro
      return false;                                           // devolve "inválido"
    }

    mostrarFeedback('sucesso', 'E-mail válido.');             // passou na Regex
    return true;                                              // devolve "válido"
  }

  input.addEventListener('input', function () {               // a cada letra digitada...
    if (jaInteragiu) {                                        // ...se o usuário já interagiu antes...
      validarEmail();                                         // ...valida em tempo real
    } else {                                                  // ...senão (ainda digitando pela 1ª vez)...
      mostrarFeedback('', '');                                // ...não incomoda com avisos
    }
  });

  input.addEventListener('blur', function () {                // quando o usuário sai do campo...
    if (input.value.trim() !== '') {                          // ...e algo foi digitado...
      jaInteragiu = true;                                     // ...marca que já interagiu...
      validarEmail();                                         // ...e valida
    }
  });

  function restaurarBotao() {                                 // devolve o botão e o campo ao estado inicial
    botao.textContent = textoOriginal;                        // texto original do botão
    botao.classList.remove('btn--success');                   // remove o visual verde
    mostrarFeedback('', '');                                  // apaga a mensagem e as bordas
  }

  // Envia o e-mail de verdade. No Netlify, o formulário com data-netlify recebe este POST em "/"
  // e guarda o cadastro (painel do site > Forms). Abrindo o arquivo direto no PC (file://) não existe
  // servidor para receber, então o envio é simulado só para você conseguir testar o visual.
  function enviarFormulario() {
    if (location.protocol === 'file:') {                      // teste local
      console.log('[Modo local] Envio simulado: o Netlify só recebe os cadastros com o site no ar.');
      return Promise.resolve();                               // finge que deu certo
    }
    return fetch('/', {                                       // envio real, sem recarregar a página
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString() // inclui form-name e o campo-armadilha
    }).then(function (resposta) {
      if (!resposta.ok) throw new Error('Falha no envio: ' + resposta.status); // 4xx/5xx vira erro
    });
  }

  form.addEventListener('submit', function (evento) {         // quando o formulário for enviado...
    evento.preventDefault();                                  // ...impede o recarregamento da página
    jaInteragiu = true;                                       // a partir daqui a validação é ao vivo

    if (!validarEmail()) {                                    // se o e-mail NÃO é válido...
      input.focus();                                          // ...leva o cursor de volta ao campo...
      return;                                                 // ...e para aqui: dado incorreto não é enviado
    }

    botao.disabled = true;                                    // evita clique duplo durante o envio
    botao.textContent = 'Enviando...';                        // avisa que está trabalhando

    enviarFormulario().then(function () {                     // deu certo:
      botao.textContent = 'Inscrição Confirmada';             // troca o texto do botão
      botao.classList.add('btn--success');                    // aplica o visual verde
      mostrarFeedback('sucesso', 'Inscrição realizada com sucesso!'); // mostra a mensagem de sucesso
      input.value = '';                                       // limpa o campo
      jaInteragiu = false;                                    // recomeça sem avisos ao vivo
      clearTimeout(timerBotao);                               // cancela um temporizador anterior, se houver
      timerBotao = setTimeout(restaurarBotao, 4000);          // depois de 4 segundos volta ao normal
    }).catch(function () {                                    // deu errado (sem internet, servidor fora...):
      botao.textContent = textoOriginal;                      // devolve o texto do botão
      mostrarFeedback('erro', 'Não foi possível enviar agora. Tente novamente em instantes.'); // o e-mail digitado é mantido
    }).finally(function () {                                  // em qualquer caso:
      botao.disabled = false;                                 // libera o botão de novo
    });
  });
}

// ==========================================================================
// IMPRESSÃO: ABRE O FAQ INTEIRO NO PDF
// ==========================================================================
function iniciarImpressao() {
  const perguntas = document.querySelectorAll('details.faq-item'); // todas as perguntas do FAQ
  if (perguntas.length === 0) return;                        // sem FAQ, nada a fazer
  let estadoAntes = [];                                      // guardará quais estavam abertas

  window.addEventListener('beforeprint', function () {       // logo antes de imprimir / salvar em PDF...
    estadoAntes = Array.from(perguntas).map(function (item) { // ...anota quais perguntas estavam abertas...
      return item.open;                                      // ...(true = aberta, false = fechada)
    });
    perguntas.forEach(function (item) {                      // ...e para cada pergunta...
      item.open = true;                                      // ...abre, para as respostas saírem no papel
    });
  });

  window.addEventListener('afterprint', function () {        // depois de imprimir...
    perguntas.forEach(function (item, indice) {              // ...para cada pergunta...
      item.open = estadoAntes[indice];                       // ...devolve o estado em que estava
    });
  });
}

// ==========================================================================
// INICIALIZAÇÃO: liga cada recurso (o script tem "defer", então o HTML já existe aqui)
// ==========================================================================
iniciarMenu();       // ativa o menu hambúrguer
iniciarTema();       // ativa o alternador de tema
iniciarNewsletter(); // ativa a validação do formulário
iniciarImpressao();  // prepara o FAQ para impressão