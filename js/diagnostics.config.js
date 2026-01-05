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

  return { questions };
}