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

// 2. ESCUTANDO O EVENTO DE ENVIO DO FORMULÁRIO (submit)
formNewsletter.addEventListener('submit', function (event) {
  // Evita que a página recarregue ao enviar o formulário
  event.preventDefault();

  // Pega o valor digitado pelo usuário e remove espaços extras
  const emailDigitado = inputEmail.value.trim();

  if (emailDigitado !== '') {
    // Troca o texto do botão para confirmar o recebimento
    btnSubmit.textContent = 'Inscrição Confirmada! 🎉';

    // Adiciona a classe CSS de sucesso (o visual fica no style.css, não no JS)
    btnSubmit.classList.add('btn--success');

    // Limpa o campo de entrada
    inputEmail.value = '';

    console.log(`E-mail cadastrado com sucesso: ${emailDigitado}`);

    // Depois de 4 segundos, o botão volta ao normal
    setTimeout(function () {
      btnSubmit.textContent = textoOriginal;
      btnSubmit.classList.remove('btn--success');
    }, 4000);
  }
});

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

// Mostra no botão o ícone do tema PARA O QUAL ele vai trocar
function atualizarBotaoTema() {
  const claro = temaAtual() === 'light';
  botaoTema.textContent = claro ? '🌙' : '☀️';
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