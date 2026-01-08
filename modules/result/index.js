// modules/result/index.js — ИСПРАВЛЕННАЯ (FINAL)

import { sendEvent } from '../../js/tracker.js';
import {
  renderProcessing,
  renderReady,
  renderError
} from './ui.js';

export function init(context) {
  const { result, ui } = context;
  if (!result || !ui?.resultRoot) return;

  const container = ui.resultRoot;

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
  }
}