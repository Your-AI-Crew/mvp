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
      // ⚠️ важно: сначала UI, потом событие
      /**
       * 1️⃣ Финальный экран диагностики
       * (Спасибо + "Анализируем ответы…")
       */
      renderComplete(container, uiTexts);

      /**
       * 2️⃣ После этого diagnostics-UI больше
       * НЕ управляет экраном
       * — result-модуль берёт контроль
       */
      container.style.display = 'none';

      /**
       * 3️⃣ diagnostic_complete
       * Отправляем асинхронно, чтобы:
       * - последний diagnostic_answer (q7) гарантированно ушёл первым
       * - избежать гонок в n8n / analytics
       */

      // микротик, чтобы diagnostic_answer(q7) ушёл раньше
      setTimeout(() => {
        sendEvent('diagnostic_complete', {
          questions_count: questions.length,
          answers
        });
      }, 0);

      return;
    }

    renderCurrentQuestion();
  }
}
