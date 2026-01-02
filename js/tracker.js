// js/tracker.js
import { CONFIG } from './config.js';
import { getUserId, getSessionId } from './utils.js';
import { getCurrentLang } from './i18n.js';

const userId = getUserId();
const sessionId = getSessionId();

export function sendEvent(eventType, payload = {}) {
  const data = {
    event_type: eventType,
    user_id: userId,
    session_id: sessionId,
    language: getCurrentLang(),
    payload
  };

  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json'
  });

  navigator.sendBeacon(CONFIG.WEBHOOK_URL, blob);

  if (CONFIG.DEBUG) {
    console.log('[event]', data);
  }
}

// базовое событие
sendEvent('page_view');
