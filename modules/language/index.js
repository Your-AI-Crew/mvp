//      modules/language/index.js

import { loadLanguage, getCurrentLang, t } from '../../js/i18n.js';
import { sendEvent } from '../../js/tracker.js';
import { renderLanguageUI } from './ui.js';

const STORAGE_KEY = 'lang';

function getStoredLang() {
  return localStorage.getItem(STORAGE_KEY);
}

function setStoredLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function init() {
  const container = document.getElementById('language');
  if (!container) return;

  const currentLang = getCurrentLang();
  renderLanguageUI(container, currentLang, t);

  const select = container.querySelector('select');
  const label = container.querySelector('[data-lang-label]');

  label.textContent = t('language.label');

  select.addEventListener('change', async (e) => {
    const fromLang = getCurrentLang();
    const toLang = e.target.value;

    if (fromLang === toLang) return;

    setStoredLang(toLang);

    sendEvent('language_change', {
      from: fromLang,
      to: toLang
    });

    await loadLanguage(toLang);
    location.reload();
  });
}