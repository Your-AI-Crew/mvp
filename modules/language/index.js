//      modules/language/index.js

import { t } from '../../js/i18n.js';
import { sendEvent } from '../../js/tracker.js';
import { renderLanguageUI } from './ui.js';

const STORAGE_KEY = 'lang';

function setStoredLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function init(context) {
  const container = document.getElementById('language');
  if (!container) return;

  const { lang } = context.i18n;

  renderLanguageUI(container, lang, t);

  const select = container.querySelector('select');
  const label = container.querySelector('[data-lang-label]');

  label.textContent = t('language.label');

  select.addEventListener('change', (e) => {
    const toLang = e.target.value;

    if (toLang === lang) return;

    setStoredLang(toLang);

    sendEvent('language_change', {
      from: lang,
      to: toLang
    });

    location.reload();
  });
}
