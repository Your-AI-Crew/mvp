// js/app.js (orchestrator)

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
});

async function initData() {
  const lang = getCurrentLang();
  await loadLanguage(lang);

  const diagnostics = await loadDiagnosticsConfig();

  // 🔒 ЯВНОЕ, ЗАФИКСИРОВАННОЕ начальное состояние result
  const result = {
    status: 'processing'
  };

  return {
    i18n: { lang },
    diagnostics,
    result, // ✅ КРИТИЧЕСКИЙ ФИКС
    ui: {
      diagnosticsRoot: document.getElementById('diagnostics'),
      resultRoot: document.getElementById('result')
    }
  };
}

function initModules(ctx) {
  initLanguage(ctx);
  initDiagnostics(ctx);
  initResult(ctx);
}

/**
 * ✅ ЕДИНСТВЕННАЯ допустимая точка перехода result → ready
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
