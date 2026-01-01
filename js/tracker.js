// js/tracker.js
import { CONFIG } from './config.js';
import { getUserId, getSessionId } from './utils.js';

const userId = getUserId();
const sessionId = getSessionId();

export function sendEvent(eventType, payload = {}) {
  const data = {
    event_type: eventType,
    user_id: userId,
    session_id: sessionId,
    payload
  };

  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json'
  });

  navigator.sendBeacon(CONFIG.WEBHOOK_URL, blob);

  if (CONFIG.DEBUG) {
    console.log(data);
  }
}

sendEvent('page_view');

const ctaButton = document.getElementById('cta-button');
if (ctaButton) {
  ctaButton.addEventListener('click', () => {
    sendEvent('cta_click');
  });
}