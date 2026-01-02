// js/tracker.js
import { CONFIG } from './config.js';
import { getUserId, getSessionId } from './utils.js';
import { getCurrentLang } from './i18n.js';

const userId = getUserId();
const sessionId = getSessionId();

/**
 * Универсальная отправка события
 * event_type — строка
 * payload — объект (будет сериализован)
 */
export function sendEvent(eventType, payload = {}) {
  const data = {
    timestamp: new Date().toISOString(),
    event_type: eventType,
    user_id: userId,
    session_id: sessionId,
    language: getCurrentLang(),
    payload
  };

  try {
    const blob = new Blob([JSON.stringify(data)], {
      type: 'application/json'
    });

    navigator.sendBeacon(CONFIG.WEBHOOK_URL, blob);

    if (CONFIG.DEBUG) {
      console.log('[event]', data);
    }
  } catch (e) {
    // fallback на fetch, если вдруг понадобится
    fetch(CONFIG.WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// базовое событие просмотра страницы
sendEvent('page_view');
