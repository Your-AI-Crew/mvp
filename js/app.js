// js/app.js

import { loadLanguage, getCurrentLang } from './i18n.js';
import { init as initLanguage } from '../modules/language/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  const context = await initData();
  initModules(context);
});

async function initData() {
  const lang = getCurrentLang();
  await loadLanguage(lang);

  return {
    i18n: {
      lang
    }
  };
}

function initModules(context) {
  initLanguage(context);
}
