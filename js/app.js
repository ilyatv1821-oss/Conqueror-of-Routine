import { state, saveState, nav, ritualDone, isHalted, isPaused, isFrozen, questRemaining } from './state.js';
import { el, fmtMS, modalOpen } from './ui.js';
import { renderHome } from './screens/home.js';
import { renderBoard } from './screens/board.js';
import { renderShop } from './screens/shop.js';
import { renderFocus } from './screens/focus.js';
import { openEvent, openTimeUp, openPauseExpired } from './quest.js';

function renderTopbar() {
  const unlocked = ritualDone() || state.activeQuest;
  const bar = el(`<header class="topbar">
    <span class="coins">🪙 ${state.player.coins}</span>
    <nav>
      <button class="btn ${nav.screen==='home'?'on':''}" data-nav="home">Дом</button>
      <button class="btn ${nav.screen==='board'?'on':''}" data-nav="board" ${unlocked?'':'disabled'}>Доска</button>
      <button class="btn ${nav.screen==='shop'?'on':''}" data-nav="shop">Магазин</button>
    </nav>
  </header>`);
  bar.querySelectorAll('[data-nav]').forEach(b => b.onclick = () => nav.go(b.dataset.nav));
  return bar;
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  if (nav.screen !== 'focus') app.appendChild(renderTopbar());
  if (nav.screen === 'home') app.appendChild(renderHome());
  if (nav.screen === 'board') app.appendChild(renderBoard());
  if (nav.screen === 'shop') app.appendChild(renderShop());
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