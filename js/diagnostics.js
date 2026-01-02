// js/diagnostics.js

import { loadLanguage, t, getCurrentLang } from './i18n.js';
import { sendEvent } from './tracker.js';

await loadLanguage(getCurrentLang());

// DOM
const startBtn = document.getElementById('start-diagnostics');
const diagnosticsEl = document.getElementById('diagnostics');
const questionTextEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');

// Questions order = IDs
const QUESTION_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];

let currentIndex = 0;
const answers = {};

// INIT UI TEXTS
document.getElementById('app-title').textContent = t('app.title');
document.getElementById('app-subtitle').textContent = t('app.subtitle');
startBtn.textContent = t('app.startDiagnostics');
nextBtn.textContent = t('app.next');

// START
startBtn.addEventListener('click', () => {
  // 🔹 ДОБАВЛЕНО: логирование CTA
  sendEvent('cta_click');

  startBtn.disabled = true;
  diagnosticsEl.style.display = 'block';

  sendEvent('diagnostic_start', {
    language: getCurrentLang()
  });

  renderQuestion();
});

function renderQuestion() {
  const id = QUESTION_IDS[currentIndex];
  const q = t(`questions.${id}`);

  questionTextEl.textContent = q.text;
  optionsEl.innerHTML = '';

  q.options.forEach(option => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '8px';

    const input = document.createElement('input');
    input.type = q.type === 'multi' ? 'checkbox' : 'radio';
    input.name = id;
    input.value = option;
    input.style.marginRight = '8px';

    label.appendChild(input);
    label.append(option);
    optionsEl.appendChild(label);
  });
}

nextBtn.addEventListener('click', () => {
  const id = QUESTION_IDS[currentIndex];
  const q = t(`questions.${id}`);

  const selected = Array.from(
    document.querySelectorAll(`input[name="${id}"]:checked`)
  ).map(i => i.value);

  const answer = q.type === 'multi'
    ? selected
    : selected[0] || null;

  answers[id] = {
    question_text: q.text,
    answer
  };

  sendEvent('diagnostic_answer', {
    question_id: id,
    question_text: q.text,
    answer,
    language: getCurrentLang()
  });

  currentIndex++;

  if (currentIndex < QUESTION_IDS.length) {
    renderQuestion();
  } else {
    finishDiagnostics();
  }
});

function finishDiagnostics() {
  sendEvent('diagnostic_complete', {
    answers,
    language: getCurrentLang()
  });

  diagnosticsEl.innerHTML = `
    <p><strong>${t('app.thankYou')}</strong></p>
    <p>${t('app.diagnosticsComplete')}</p>
  `;
}
