// js/i18n.js

const LANGUAGE_KEY = 'lang';
let currentLang = localStorage.getItem(LANGUAGE_KEY) || 'ru';
let dictionary = {};

export async function loadLanguage(lang) {
  const res = await fetch(`${CONFIG.BASE_PATH}i18n/${lang}.json`);
  dictionary = await res.json();
  currentLang = lang;
  localStorage.setItem(LANGUAGE_KEY, lang);
}

export function t(path) {
  return path.split('.').reduce((o, k) => o?.[k], dictionary) || '';
}

export function getCurrentLang() {
  return currentLang;
}

