// js/diagnostics.js

import { sendEvent } from './tracker.js';

/**
 * Диагностические вопросы (данные, не логика)
 */
const QUESTIONS = [
  {
    id: "q1",
    text: "Какой тип бизнеса вы ведёте?",
    type: "single",
    options: [
      "Услуги для частных клиентов",
      "Услуги для бизнеса (B2B)",
      "Агентство / посредник",
      "Онлайн-сервисы / EdTech",
      "Другое"
    ]
  },
  {
    id: "q2",
    text: "Откуда сейчас приходят основные обращения?",
    type: "multi",
    options: [
      "Сайт / лендинг",
      "Мессенджеры",
      "Соцсети",
      "Рекомендации",
      "Холодные обращения",
      "Пока нестабильно / хаотично"
    ]
  },
  {
    id: "q3",
    text: "Как сейчас обрабатываются входящие обращения?",
    type: "single",
    options: [
      "Вручную сотрудниками",
      "Частично автоматизировано",
      "Чат-бот / ассистент",
      "Часто теряются / отвечаем не сразу"
    ]
  },
  {
    id: "q4",
    text: "Где сотрудники тратят больше всего времени?",
    type: "multi",
    options: [
      "Ответы на однотипные вопросы",
      "Квалификация лидов",
      "Документы и расчёты",
      "Переписка и напоминания",
      "Контроль задач"
    ]
  },
  {
    id: "q5",
    text: "Насколько прозрачна для вас текущая воронка продаж?",
    type: "single",
    options: [
      "Полностью прозрачна",
      "Частично",
      "Скорее интуитивно",
      "Почти не понимаю"
    ]
  },
  {
    id: "q6",
    text: "Что беспокоит сильнее всего?",
    type: "multi",
    options: [
      "Потеря клиентов",
      "Зависимость от сотрудников",
      "Утечка базы или знаний",
      "Рост без увеличения штата",
      "Сложность контроля"
    ]
  },
  {
    id: "q7",
    text: "Как вы относитесь к внедрению ИИ сейчас?",
    type: "single",
    options: [
      "Уже внедряем",
      "Планируем",
      "Интересно, но есть сомнения",
      "Пока не готов"
    ]
  }
];

/**
 * Состояние диагностики
 */
let currentIndex = 0;
const answers = {};

/**
 * DOM элементы
 */
const startBtn = document.getElementById('start-diagnostics');
const diagnosticsEl = document.getElementById('diagnostics');
const questionTextEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');

/**
 * Запуск диагностики
 */
startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  diagnosticsEl.style.display = 'block';

  sendEvent('diagnostic_start');

  renderQuestion();
});

/**
 * Рендер текущего вопроса
 */
function renderQuestion() {
  const q = QUESTIONS[currentIndex];

  questionTextEl.textContent = q.text;
  optionsEl.innerHTML = '';

  q.options.forEach(option => {
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '8px';

    const input = document.createElement('input');
    input.type = q.type === 'multi' ? 'checkbox' : 'radio';
    input.name = q.id;
    input.value = option;
    input.style.marginRight = '8px';

    label.appendChild(input);
    label.append(option);
    optionsEl.appendChild(label);
  });
}

/**
 * Переход к следующему вопросу
 */
nextBtn.addEventListener('click', () => {
  const q = QUESTIONS[currentIndex];

  const selected = Array.from(
    document.querySelectorAll(`input[name="${q.id}"]:checked`)
  ).map(i => i.value);

  const answer =
    q.type === 'multi'
      ? selected
      : selected.length > 0
        ? selected[0]
        : null;

  answers[q.id] = answer;

  sendEvent('diagnostic_answer', {
    question_id: q.id,
    answer
  });

  currentIndex++;

  if (currentIndex < QUESTIONS.length) {
    renderQuestion();
  } else {
    finishDiagnostics();
  }
});

/**
 * Завершение диагностики
 */
function finishDiagnostics() {
  sendEvent('diagnostic_complete', {
    answers
  });

  diagnosticsEl.innerHTML = `
    <p><strong>Спасибо!</strong></p>
    <p>Диагностика завершена. Анализируем ответы…</p>
  `;
}