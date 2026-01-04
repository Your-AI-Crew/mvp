// js/app.js

import { loadLanguage, getCurrentLang } from './i18n.js';
import { init as initLanguage } from '../modules/language/index.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1️⃣ Сначала загружаем словарь языка
  await loadLanguage(getCurrentLang());

  // 2️⃣ Только потом инициализируем language-модуль
  initLanguage();
});
