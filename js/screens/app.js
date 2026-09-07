import { state, saveState, nav, ritualDone, isHalted, isPaused, isFrozen, questRemaining } from './state.js';
import { el, fmtMS, modalOpen } from './ui.js';
import { renderHome } from './screens/home.js';
import { renderStreet } from './screens/street.js';
import { renderBoard } from './screens/board.js';
import { renderShop } from './screens/shop.js';
import { renderFocus } from './screens/focus.js';
import { openEvent, openTimeUp, openPauseExpired } from './quest.js';

function coinsFloat() {
  const d = el(`<button class="coins coins-float" title="В лавку">🪙 ${state.player.coins}</button>`);
  d.onclick = () => nav.go('shop');
  return d;
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  if (nav.screen !== 'focus') app.appendChild(coinsFloat());
  if (nav.screen === 'home') app.appendChild(renderHome());
  if (nav.screen === 'street') app.appendChild(renderStreet());
  if (nav.screen === 'shop') app.appendChild(renderShop());
  if (nav.screen === 'guild') app.appendChild(renderBoard());
  if (nav.screen === 'focus') app.appendChild(renderFocus());
}
nav.onRender = render;

setInterval(() => {
  const q = state.activeQuest;
  if (!q || nav.screen !== 'focus') return;
  const now = Date.now();
  const tEl = document.getElementById('timer');
  if (tEl) {
    const rem = questRemaining(q);
    if (isHalted(q)) {
      tEl.textContent = (isFrozen(q) ? '❄ ' : '⏸ ') + fmtMS(rem);
      tEl.classList.remove('low');
    } else {
      tEl.textContent = fmtMS(rem);
      tEl.classList.toggle('low', rem <= 60000 && rem > 0);
    }
  }
  if (modalOpen()) return;
  if (isPaused(q) && now >= q.pausedUntil) return openPauseExpired();
  if (!isHalted(q) && !q.endShown && now >= q.endsAt) { q.endShown = true; saveState(); return openTimeUp(); }
  if (!isHalted(q) && q.nextEventAt && now >= q.nextEventAt) openEvent();
}, 500);

window.merc = { state: () => state, save: saveState, render: () => render() };
render();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}