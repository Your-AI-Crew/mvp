// modules/result/index.js

import { sendEvent } from '../../js/tracker.js';
import {
  renderProcessing,
  renderReady,
  renderError
} from './ui.js';

export function init(context) {
  // 🔒 ЖЁСТКИЙ GUARD — без валидного контекста модуль НИЧЕГО не делает
  if (!context?.result) return;
  if (!(context.ui?.resultRoot instanceof HTMLElement)) return;

  const { result } = context;
  const container = context.ui.resultRoot;

  // 🔒 Поддерживаются ТОЛЬКО валидные статусы
  if (result.status === 'processing') {
    renderProcessing(container);
    sendEvent('result_view');
    return;
  }

  if (result.status === 'ready') {
    renderReady(container, result.data, () => {
      sendEvent('result_cta_click');
    });

    sendEvent('result_view');
    return;
  }

  if (result.status === 'error') {
    renderError(container, () => {
      sendEvent('result_retry');
    });
    return;
  }

  // ❌ Любой иной статус — молчаливый выход (по ТЗ)
}
