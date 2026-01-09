// modules/diagnostics/index.js

import { sendEvent } from '../../js/tracker.js';
import {
  renderStartScreen,
  renderQuestion,
  renderComplete
} from './ui.js';

export function init(context) {
  const { diagnostics, ui } = context;
  if (!diagnostics || !ui?.diagnosticsRoot) return;

  const container = ui.diagnosticsRoot;
  const { questions, ui: uiTexts } = diagnostics;

  let currentIndex = -1;
  const answers = {};

  // Стартовый экран
  renderStartScreen(container, uiTexts, onStart);

  function onStart() {
    currentIndex = 0;

    sendEvent('diagnostic_start', {
      questions_count: questions.length
    });

    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    const question = questions[currentIndex];
    renderQuestion(container, question, uiTexts, onNext);
  }

  function onNext(answer) {
    const question = questions[currentIndex];

    answers[question.id] = {
      question_text: question.text,
      answer
    };

    sendEvent('diagnostic_answer', {
      question_id: question.id,
      question_text: question.text,
      answer
    });

    currentIndex += 1;

    if (currentIndex >= questions.length) {
      /**
       * 1️⃣ Последний экран диагностики
       * (Спасибо + "Анализируем ответы…")
       * diagnostics ещё ВИДЕН
       */
      renderComplete(container, uiTexts);

      /**
       * 2️⃣ diagnostic_complete
       * Отправляем асинхронно, чтобы:
       * - последний diagnostic_answer ушёл раньше
       * - n8n не схлопывал события
       */
      setTimeout(() => {
        sendEvent('diagnostic_complete', {
          questions_count: questions.length,
          answers
        });
      }, 0);

      /**
       * ❗ ВАЖНО:
       * diagnostics НЕ скрывает себя
       * управление экраном перейдёт к result
       */
      return;
    }

    renderCurrentQuestion();
  }
}
