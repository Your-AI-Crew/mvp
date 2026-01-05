// js/diagnostics.config.js

import { t } from './i18n.js';

export async function loadDiagnosticsConfig() {
  const questionsData = t('diagnostics.questions');
  const questions = [];

  for (const id in questionsData) {
    questions.push({
      id,
      type: questionsData[id].type,
      text: questionsData[id].text,
      options: questionsData[id].options
    });
  }

  return {
    ui: {
      title: t('app.title'),
      subtitle: t('app.subtitle'),
      startButton: t('app.startDiagnostics'),
      nextButton: t('app.next'),
      thankYou: t('app.thankYou'),
      completeText: t('app.diagnosticsComplete')
    },
    questions
  };
}
