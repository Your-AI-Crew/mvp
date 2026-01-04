//  modules/language/ui.js

export function renderLanguageUI(container, currentLang, t) {
  container.innerHTML = '';

  const label = document.createElement('label');
  const labelText = document.createElement('span');
  const select = document.createElement('select');

  labelText.setAttribute('data-lang-label', '');
  select.id = 'language-switcher';

  const languages = [
    { code: 'ru', key: 'language.ru' },
    { code: 'en', key: 'language.en' }
  ];

  languages.forEach(({ code, key }) => {
    const option = document.createElement('option');
    option.value = code;
    option.textContent = t(key);
    if (code === currentLang) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  label.appendChild(labelText);
  label.appendChild(select);
  container.appendChild(label);
}