// js/app.js

import { loadLanguage, getCurrentLang } from './i18n.js';
import { init as initLanguage } from '../modules/language/index.js';
import { loadDiagnosticsConfig } from './diagnostics.config.js';
import { init as initDiagnostics } from '../modules/diagnostics/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  const context = await initData();
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
      diagnosticsRoot: document.getElementById('diagnostics')
    }
  };
}

function initModules(context) {
  initLanguage(context);
  initDiagnostics(context);
}
