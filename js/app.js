// js/app.js — FINAL, VERIFIED

import { loadLanguage, getCurrentLang } from './i18n.js';
import { init as initLanguage } from '../modules/language/index.js';
import { loadDiagnosticsConfig } from './diagnostics.config.js';
import { init as initDiagnostics } from '../modules/diagnostics/index.js';
import { init as initResult } from '../modules/result/index.js';
import { sendEvent } from './tracker.js';

let context = null;

/**
 * 🔑 Единственная точка входа приложения
 */
document.addEventListener('DOMContentLoaded', async () => {
  context = await initData();
  initModules(context);
});

/**
 * =========================
 * 1️⃣ DATA-LAYER INIT
 * =========================
 * ❗ result здесь НЕ создаётся
 */
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

/**
 * =========================
 * 2️⃣ UI MODULES INIT
 * =========================
 */
function initModules(ctx) {
  initLanguage(ctx);
  initDiagnostics(ctx);
  initResult(ctx); // safe: ничего не делает без context.result
}

/**
 * ==================================================
 * 🔒 diagnostics → result (processing)
 * ==================================================
 * Вызывается СТРОГО после diagnostic_complete
 */
export function startResultProcessing() {
  if (!context) return;

  context.result = {
    status: 'processing'
  };

  initResult(context);
}

/**
 * ==================================================
 * 🔒 result (processing) → result (ready)
 * ==================================================
 * Вызывается ИЗВНЕ:
 * — n8n webhook
 * — SSE
 * — polling
 */
export function updateResult(data) {
  if (!context?.result) return;

  context.result = {
    status: 'ready',
    data
  };

  sendEvent('result_ready');

  initResult(context);
}

/**
 * ==================================================
 * 🔒 result → error
 * ==================================================
 */
export function setResultError() {
  if (!context) return;

  context.result = {
    status: 'error'
  };

  initResult(context);
}
