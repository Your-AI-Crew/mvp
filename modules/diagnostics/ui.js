// modules/diagnostics/ui.js

export function renderStartScreen(container, uiTexts, onStart) {
  container.innerHTML = '';

  const title = document.createElement('h1');
  title.textContent = uiTexts.title;

  const subtitle = document.createElement('p');
  subtitle.textContent = uiTexts.subtitle;

  const button = document.createElement('button');
  button.textContent = uiTexts.startButton;
  button.addEventListener('click', onStart);

  container.appendChild(title);
  container.appendChild(subtitle);
  container.appendChild(button);
}

export function renderQuestion(container, question, uiTexts, onNext) {
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = question.text;

  const optionsContainer = document.createElement('div');
  const inputs = [];

  question.options.forEach((opt) => {
    const label = document.createElement('label');
    label.style.display = 'block';

    const input = document.createElement('input');
    input.type = question.type === 'single' ? 'radio' : 'checkbox';
    input.name = 'diagnostic-option';
    input.value = opt;

    inputs.push(input);

    label.appendChild(input);
    label.appendChild(document.createTextNode(opt));
    optionsContainer.appendChild(label);
  });

  const nextBtn = document.createElement('button');
  nextBtn.textContent = uiTexts.nextButton;

  nextBtn.addEventListener('click', () => {
    let answer;

    if (question.type === 'single') {
      const selected = inputs.find(i => i.checked);
      if (!selected) return;
      answer = selected.value;
    } else {
      answer = inputs.filter(i => i.checked).map(i => i.value);
      if (answer.length === 0) return;
    }

    onNext(answer);
  });

  container.appendChild(title);
  container.appendChild(optionsContainer);
  container.appendChild(nextBtn);
}

export function renderComplete(container, uiTexts) {
  container.innerHTML = '';

  const thankYou = document.createElement('p');
  thankYou.innerHTML = `<strong>${uiTexts.thankYou}</strong>`;

  const text = document.createElement('p');
  text.textContent = uiTexts.completeText;

  container.appendChild(thankYou);
  container.appendChild(text);
}
