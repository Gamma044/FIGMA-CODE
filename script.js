/* ==========================================
   AURA DELUXE — script.js
   ========================================== */

// ==========================================================================
// AULA 1: SELEÇÃO DE ELEMENTOS E EVENTOS
// ==========================================================================

// 1. SELECIONANDO OS ELEMENTOS NO DOM
// (use as classes que existem no SEU HTML: .newsletter-form e .newsletter-input)
const formNewsletter = document.querySelector('.newsletter-form'); // o formulário
const inputEmail = document.querySelector('.newsletter-input');    // o campo de e-mail
const btnSubmit = document.querySelector('.btn--form');            // o botão de enviar

// Guarda o texto original do botão para poder restaurá-lo depois
const textoOriginal = btnSubmit.textContent;

// 2. O evento de envio (submit) agora é tratado na AULA 3, com validação por Regex.

// ==========================================================================
// AULA 2: classList.toggle() — MENU MOBILE E ALTERNADOR DE TEMA
// ==========================================================================

// ---------- MENU HAMBÚRGUER ----------
const menuToggle = document.querySelector('#menu-toggle'); // botão do hambúrguer
const navMenu = document.querySelector('#menu-principal'); // o <nav> com os links

// Abre ou fecha o menu e mantém a acessibilidade em dia
function definirMenu(aberto) {
  // toggle(classe, true/false): adiciona se for true, remove se for false
  navMenu.classList.toggle('is-open', aberto);       // mostra/esconde o menu
  menuToggle.classList.toggle('is-active', aberto);  // anima o hambúrguer em X
  menuToggle.setAttribute('aria-expanded', String(aberto)); // leitores de tela: aberto ou fechado
  menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

// Clique no hambúrguer: inverte o estado atual (é o "interruptor")
menuToggle.addEventListener('click', function () {
  definirMenu(!navMenu.classList.contains('is-open'));
});

// Clicou em um link do menu: fecha para não cobrir a página
navMenu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    definirMenu(false);
  });
});

// Tecla Esc fecha o menu e devolve o foco ao botão
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
    definirMenu(false);
    menuToggle.focus();
  }
});

// Se a tela crescer além do mobile, volta ao estado fechado
window.matchMedia('(min-width: 769px)').addEventListener('change', function (evento) {
  if (evento.matches) definirMenu(false);
});

// ---------- ALTERNADOR DE TEMA (CLARO / ESCURO) ----------
const botaoTema = document.querySelector('#theme-toggle');
const raiz = document.documentElement; // a tag <html>, onde ficam as classes de tema

// Descobre o tema em uso: a classe manual, ou (se não houver) a preferência do sistema
function temaAtual() {
  if (raiz.classList.contains('theme-light')) return 'light';
  if (raiz.classList.contains('theme-dark')) return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

// Atualiza o texto lido por leitores de tela (o ícone sol/lua é trocado pelo CSS)
function atualizarBotaoTema() {
  const claro = temaAtual() === 'light';
  botaoTema.setAttribute('aria-label', claro ? 'Ativar modo escuro' : 'Ativar modo claro');
}

// Clique: troca o tema com toggle e guarda a escolha no navegador
botaoTema.addEventListener('click', function () {
  const novoTema = temaAtual() === 'light' ? 'dark' : 'light';

  raiz.classList.toggle('theme-light', novoTema === 'light'); // liga/desliga o claro
  raiz.classList.toggle('theme-dark', novoTema === 'dark');   // liga/desliga o escuro

  try { localStorage.setItem('aura-theme', novoTema); } catch (e) { /* sem armazenamento: vale só nesta visita */ }

  atualizarBotaoTema();
});

atualizarBotaoTema(); // ajusta o ícone assim que a página abre

// ==========================================================================
// AULA 3: VALIDAÇÃO COM REGEX E FEEDBACK VISUAL
// ==========================================================================

// Padrão de e-mail: ^ início | [^\s@]+ nome sem espaço nem @ | @ | [^\s@]+ domínio | \. ponto | [^\s@]+ extensão | $ fim
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// CRIAÇÃO DINÂMICA DA MENSAGEM: o JavaScript monta o <small> e o insere logo abaixo do campo de e-mail
const feedbackNewsletter = document.createElement('small');
feedbackNewsletter.id = 'newsletter-feedback';
feedbackNewsletter.className = 'newsletter-feedback';        // o visual fica no style.css
feedbackNewsletter.setAttribute('role', 'status');           // leitores de tela anunciam quando o texto muda
feedbackNewsletter.setAttribute('aria-live', 'polite');
inputEmail.parentNode.appendChild(feedbackNewsletter);       // entra logo depois do <input>
inputEmail.setAttribute('aria-describedby', 'newsletter-feedback'); // liga o campo à mensagem

// Desliga o aviso padrão do navegador pelo JS: se o script falhar, a validação nativa continua funcionando
formNewsletter.noValidate = true;

let usuarioJaInteragiu = false; // só valida "ao vivo" depois que o usuário saiu do campo ou tentou enviar
let timerBotao;                 // guarda o temporizador que restaura o botão

// Mostra a mensagem e pinta o campo. tipo: 'erro', 'sucesso' ou '' (limpa tudo)
function mostrarFeedback(tipo, mensagem) {
  feedbackNewsletter.textContent = mensagem;
  feedbackNewsletter.classList.toggle('is-error', tipo === 'erro');
  feedbackNewsletter.classList.toggle('is-success', tipo === 'sucesso');
  inputEmail.classList.toggle('is-invalid', tipo === 'erro');
  inputEmail.classList.toggle('is-valid', tipo === 'sucesso');
  inputEmail.setAttribute('aria-invalid', String(tipo === 'erro')); // avisa leitores de tela
}

// Confere o campo e mostra o resultado; devolve true se o e-mail é válido
function validarEmail() {
  const email = inputEmail.value.trim();

  if (email === '') {
    mostrarFeedback('erro', 'Digite seu e-mail para continuar.');
    return false;
  }

  // .test() devolve true se o texto segue o padrão da Regex
  if (!REGEX_EMAIL.test(email)) {
    mostrarFeedback('erro', 'Por favor, digite um e-mail válido (ex: nome@dominio.com).');
    return false;
  }

  mostrarFeedback('sucesso', 'E-mail válido.');
  return true;
}

// Ao digitar: depois da primeira interação, o aviso acompanha em tempo real
inputEmail.addEventListener('input', function () {
  if (usuarioJaInteragiu) {
    validarEmail();
  } else {
    mostrarFeedback('', ''); // antes disso, não incomoda quem ainda está digitando
  }
});

// Ao sair do campo: se algo foi digitado, já valida
inputEmail.addEventListener('blur', function () {
  if (inputEmail.value.trim() !== '') {
    usuarioJaInteragiu = true;
    validarEmail();
  }
});

// Ao enviar: só confirma se a Regex aprovar
formNewsletter.addEventListener('submit', function (event) {
  event.preventDefault();     // impede o recarregamento da página
  usuarioJaInteragiu = true;

  if (!validarEmail()) {
    inputEmail.focus();       // leva o cursor de volta ao campo com problema
    return;                   // para aqui: dado incorreto não é enviado
  }

  const emailDigitado = inputEmail.value.trim();

  // Confirmação no botão (classe definida no style.css)
  btnSubmit.textContent = 'Inscrição Confirmada';
  btnSubmit.classList.add('btn--success');
  mostrarFeedback('sucesso', 'Inscrição realizada com sucesso!');

  console.log(`E-mail cadastrado com sucesso: ${emailDigitado}`);

  inputEmail.value = '';      // limpa o campo
  usuarioJaInteragiu = false; // recomeça sem avisos ao vivo

  // Depois de 4 segundos o botão e o campo voltam ao normal
  clearTimeout(timerBotao);
  timerBotao = setTimeout(function () {
    btnSubmit.textContent = textoOriginal;
    btnSubmit.classList.remove('btn--success');
    mostrarFeedback('', '');
  }, 4000);
});