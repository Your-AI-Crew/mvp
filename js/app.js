// js/app.js — FINAL, LIFECYCLE-SAFE, UX-CORRECT

import { loadLanguage, getCurrentLang } from './i18n.js';
import { init as initLanguage } from '../modules/language/index.js';
import { loadDiagnosticsConfig } from './diagnostics.config.js';
import { init as initDiagnostics } from '../modules/diagnostics/index.js';
import { init as initResult } from '../modules/result/index.js';
import { sendEvent } from './tracker.js';

let context = null;

/**
 * Единственная точка входа приложения
 */
document.addEventListener('DOMContentLoaded', async () => {
  context = await initData();
  initModules(context);
});

/**
 * Data-layer инициализация
 * ❗ result ЗДЕСЬ НЕ СОЗДАЁТСЯ
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
 * Инициализация UI-модулей
 */
function initModules(ctx) {
  initLanguage(ctx);
  initDiagnostics(ctx);
  initResult(ctx); // безопасен: выйдет, если context.result отсутствует
}

/**
 * 🔒 ЯВНЫЙ переход в состояние анализа
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
 * 🔒 ЕДИНСТВЕННАЯ допустимая точка перехода result → ready
 * Вызывается ИЗВНЕ (n8n / callback / polling)
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
