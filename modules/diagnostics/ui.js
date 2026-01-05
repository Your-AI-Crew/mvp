// modules/diagnostics/ui.js

export function renderStartScreen(container, onStart) {
  container.innerHTML = '';

  const button = document.createElement('button');
  button.addEventListener('click', onStart);

  container.appendChild(button);
}

export function renderQuestion(container, question, onNext) {
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