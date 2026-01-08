// modules/result/ui.js

export function renderProcessing(container) {
  container.innerHTML = '';

  const text = document.createElement('p');
  text.textContent = 'Анализируем ответы…';

  const spinner = document.createElement('div');
  spinner.className = 'spinner';

  container.appendChild(text);
  container.appendChild(spinner);
}

export function renderReady(container, data, onCtaClick) {
  container.innerHTML = '';

  const summary = document.createElement('p');
  summary.textContent = data.summary;

  const maturity = document.createElement('div');
  maturity.textContent = `Уровень зрелости: ${data.maturity_level}`;

  const painsTitle = document.createElement('h3');
  painsTitle.textContent = 'Ключевые проблемы';

  const pains = document.createElement('ul');
  data.key_pains.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    pains.appendChild(li);
  });

  const oppTitle = document.createElement('h3');
  oppTitle.textContent = 'Возможности';

  const opportunities = document.createElement('ul');
  data.opportunities.forEach(o => {
    const li = document.createElement('li');
    li.textContent = o;
    opportunities.appendChild(li);
  });

  const solutionsTitle = document.createElement('h3');
  solutionsTitle.textContent = 'Рекомендуемые решения';

  const solutions = document.createElement('div');
  data.recommended_solutions.forEach(s => {
    const card = document.createElement('div');

    const name = document.createElement('strong');
    name.textContent = s.name;

    const desc = document.createElement('p');
    desc.textContent = s.description;

    const effect = document.createElement('p');
    effect.textContent = s.expected_effect;

    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(effect);
    solutions.appendChild(card);
  });

  const cta = document.createElement('button');
  cta.textContent = data.next_step_cta;
  cta.addEventListener('click', onCtaClick);

  container.append(
    summary,
    maturity,
    painsTitle,
    pains,
    oppTitle,
    opportunities,
    solutionsTitle,
    solutions,
    cta
  );
}

export function renderError(container, onRetry) {
  container.innerHTML = '';

  const text = document.createElement('p');
  text.textContent = 'Произошла ошибка. Попробуйте ещё раз.';

  const button = document.createElement('button');
  button.textContent = 'Связаться с консультантом';
  button.addEventListener('click', onRetry);

  container.appendChild(text);
  container.appendChild(button);
}
