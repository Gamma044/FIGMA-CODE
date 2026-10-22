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