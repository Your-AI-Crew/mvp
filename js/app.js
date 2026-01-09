// js/app.js — FINAL (UI Completion Rule compliant)

import { loadLanguage, getCurrentLang } from './i18n.js';
import { init as initLanguage } from '../modules/language/index.js';
import { loadDiagnosticsConfig } from './diagnostics.config.js';
import { init as initDiagnostics } from '../modules/diagnostics/index.js';
import { init as initResult } from '../modules/result/index.js';
import { sendEvent } from './tracker.js';

let context = null;
let resultLocked = false;

document.addEventListener('DOMContentLoaded', async () => {
  context = await initData();
  initModules(context);
});

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

function initModules(ctx) {
  initLanguage(ctx);
  initDiagnostics(ctx);
  initResult(ctx); // безопасен — выйдет, если result отсутствует
}

/**
 * 🔒 ВЫЗЫВАЕТСЯ СТРОГО после diagnostic_complete
 * Реализует UI Completion Rule
 */
export function startResultProcessing() {
  if (!context || context.result) return;

  // 🔴 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
  // diagnostics освобождает экран
  if (context.ui?.diagnosticsRoot instanceof HTMLElement) {
    context.ui.diagnosticsRoot.innerHTML = '';
    context.ui.diagnosticsRoot.style.display = 'none';
  }

  context.result = {
    status: 'processing'
  };

  initResult(context);
}

/**
 * 🔒 ЕДИНСТВЕННАЯ точка перехода result → ready
 */
export function updateResult(payload) {
  if (!context?.result) return;
  if (resultLocked) return;

  const { result, session_id } = payload;

  if (session_id !== context.diagnostics?.session_id) return;
  if (context.result.status !== 'processing') return;

  resultLocked = true;

  context.result = {
    status: 'ready',
    data: result
  };

  sendEvent('result_ready');

  initResult(context);
}
