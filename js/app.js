// js/app.js — FINAL, SCREEN-CONTROLLED v2.8

import { loadLanguage, getCurrentLang } from './i18n.js';
import { init as initLanguage } from '../modules/language/index.js';
import { loadDiagnosticsConfig } from './diagnostics.config.js';
import { init as initDiagnostics } from '../modules/diagnostics/index.js';
import { init as initResult } from '../modules/result/index.js';
import { sendEvent } from './tracker.js';

let context = null;

document.addEventListener('DOMContentLoaded', async () => {
  context = await initData();
  initModules(context);

  // начальное состояние экрана
  showDiagnostics();
});

/* ======================
   DATA LAYER
====================== */
async function initData() {
  const lang = getCurrentLang();
  await loadLanguage(lang);

  const diagnostics = await loadDiagnosticsConfig();

  return {
    i18n: { lang },
    diagnostics,
    ui: {
      diagnosticsRoot: document.getElementById('diagnostics'),
      resultRoot: document.getElementById('result')
    }
  };
}

/* ======================
   UI MODULES
====================== */
function initModules(ctx) {
  initLanguage(ctx);
  initDiagnostics(ctx);
  initResult(ctx); // safe init
}

/* ======================
   SCREEN CONTROL
====================== */
function showDiagnostics() {
  if (context?.ui?.diagnosticsRoot) {
    context.ui.diagnosticsRoot.style.display = '';
  }
  if (context?.ui?.resultRoot) {
    context.ui.resultRoot.style.display = 'none';
  }
}

function showResult() {
  if (context?.ui?.diagnosticsRoot) {
    context.ui.diagnosticsRoot.style.display = 'none';
  }
  if (context?.ui?.resultRoot) {
    context.ui.resultRoot.style.display = '';
  }
}

/* ======================
   PUBLIC TRANSITIONS
====================== */

// вызывается после diagnostic_complete (из n8n / вручную)
export function startResultProcessing() {
  if (!context) return;

  context.result = { status: 'processing' };

  showResult();
  initResult(context);
}

// вызывается, когда LLM вернул результат
export function updateResult(data) {
  if (!context?.result) return;

  context.result = {
    status: 'ready',
    data
  };

  sendEvent('result_ready');

  showResult();
  initResult(context);
}

export function setResultError() {
  if (!context) return;

  context.result = { status: 'error' };

  showResult();
  initResult(context);
}
