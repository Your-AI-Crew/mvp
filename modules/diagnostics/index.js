// modules/diagnostics/index.js

import { sendEvent } from '../../js/tracker.js';
import { renderStartScreen, renderQuestion } from './ui.js';

export function init(context) {
  const { diagnostics, ui } = context;
  if (!diagnostics || !ui?.diagnosticsRoot) return;

  const container = ui.diagnosticsRoot;
  const { questions } = diagnostics;

  let currentIndex = -1;
  const answers = {};

  renderStartScreen(container, onStart);

  function onStart() {
    currentIndex = 0;

    sendEvent('diagnostic_start', {
      questions_count: questions.length
    });

    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    const question = questions[currentIndex];
    renderQuestion(container, question, onNext);
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
      sendEvent('diagnostic_complete', {
        questions_count: questions.length
      });
      return;
    }

    renderCurrentQuestion();
  }
}