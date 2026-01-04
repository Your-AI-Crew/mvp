// js/tracker.js

import { CONFIG } from './config.js';
import { getUserId, getSessionId } from './utils.js';
import { getCurrentLang } from './i18n.js';

const userId = getUserId();
const sessionId = getSessionId();

function generateEventId() {
  return crypto.randomUUID();
}

export function sendEvent(eventType, payload = {}) {
  const data = {
    event_id: generateEventId(),   // ✅ НОВОЕ (единственное изменение)
    event_type: eventType,
    user_id: userId,
    session_id: sessionId,
    language: getCurrentLang(),
    payload
  };

  fetch(CONFIG.WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(data)
  });

  if (CONFIG.DEBUG) {
    console.log('[event]', data);
  }
}

// базовое событие
sendEvent('page_view');
