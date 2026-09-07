import { state, saveState, nav, isHalted, FROZEN } from './state.js';
import { overlay, chipGroup, sfx } from './ui.js';
import { EVENTS } from './data.js';

export function freezeNow() {
  const q = state.activeQuest; if (!q || isHalted(q)) return;
  q.pausedAt = Date.now();
  q.pausedUntil = FROZEN;
  saveState();
}

export function resumeQuest() {
  const q = state.activeQuest; if (!q) return;
  if (q.pausedAt != null) q.endsAt += Date.now() - q.pausedAt;
  q.pausedAt = null; q.pausedUntil = null;
  q.nextEventAt = (!q.flowMode && q.reminderMin > 0) ? Date.now() + q.reminderMin * 60000 : null;
  saveState();
}

export function openPauseForm(fromRunning) {
  const q = state.activeQuest; if (!q) return;
  if (fromRunning) freezeNow();
  let dur = null;
  const m = overlay(`<div class="paper dialog">
    <h3 class="hand">Привал</h3>
    <p style="margin:0">На сколько встаём? (обязательно)</p>
    <div class="row" id="p-chips"></div>
    <div class="row">
      <button class="btn primary" id="p-ok" disabled>Встать на привал</button>
      <button class="btn" id="p-cancel">Отмена</button>
    </div>
  </div>`);
  const okBtn = m.querySelector('#p-ok');
  chipGroup(m.querySelector('#p-chips'), [5,10,15,30], () => dur, v => { dur = v; okBtn.disabled = false; }, x => x + 'м');
  m.querySelector('#p-cancel').onclick = () => {
    m.remove();
    if (fromRunning) { resumeQuest(); nav.onRender && nav.onRender(); }
  };
  okBtn.onclick = () => {
    q.pausedUntil = Date.now() + dur * 60000;
    saveState(); sfx.pause();
    try { if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission(); } catch (e) {}
    m.remove(); nav.onRender && nav.onRender();
  };
}

export function confirmDrop() {
  const q = state.activeQuest; if (!q) return;
  const doneSteps = q.steps.filter(s => s.done).length;
  const m = overlay(`<div class="paper dialog">
    <h3 class="hand">Бросить контракт?</h3>
    <p style="margin:0">Монеты за отмеченные шаги (${doneSteps} × 2 = 🪙 ${doneSteps * 2}) останутся у тебя.</p>
    <div class="row">
      <button class="btn danger" id="s-yes">Бросить</button>
      <button class="btn" id="s-no">Остаться</button>
    </div>
  </div>`);
  m.querySelector('#s-yes').onclick = () => { m.remove(); drop(); };
  m.querySelector('#s-no').onclick = () => m.remove();
}

export function drop() {
  const q = state.activeQuest; if (!q) return;
  state.player.coins += q.steps.filter(s => s.done).length * 2;
  state.board[q.archetype] = 'available';
  state.activeQuest = null;
  saveState(); nav.go('board');
}

export function completeQuest() {
  const q = state.activeQuest; if (!q) return;
  const stepCoins = q.steps.length * 2, bonus = 20;
  state.player.coins += stepCoins + bonus;
  state.player.completed += 1;
  state.player.focusMin += q.durationMin;
  state.board[q.archetype] = 'done';
  state.activeQuest = null;
  saveState(); sfx.done();
  const m = overlay(`<div class="paper dialog pop" style="text-align:center">
    <h3 class="hand">🪙 Контракт выполнен!</h3>
    <p style="margin:0">+${stepCoins} за шаги · +${bonus} за завершение</p>
    <div class="row" style="justify-content:center">
      <button class="btn primary" id="r-shop">В магазин</button>
      <button class="btn" id="r-board">К доске</button>
      <button class="btn" id="r-home">Домой</button>
    </div>
  </div>`);
  m.querySelector('#r-shop').onclick = () => { m.remove(); nav.go('shop'); };
  m.querySelector('#r-board').onclick = () => { m.remove(); nav.go('board'); };
  m.querySelector('#r-home').onclick = () => { m.remove(); nav.go('home'); };
}

export function openEvent() {
  const q = state.activeQuest; if (!q) return;
  freezeNow(); sfx.event();
  const m = overlay(`<div class="paper dialog pop">
    <h3 class="hand">Событие в пути</h3>
    <p style="margin:0">${EVENTS[q.archetype]}</p>
    <div class="row">
      <button class="btn primary" id="ev-go">Продолжаю приключение</button>
    </div>
  </div>`);
  m.querySelector('#ev-go').onclick = () => { m.remove(); resumeQuest(); nav.onRender && nav.onRender(); };
}

export function openTimeUp() {
  freezeNow(); sfx.event();
  const m = overlay(`<div class="paper dialog pop">
    <h3 class="hand">⏰ Время вышло!</h3>
    <p style="margin:0">На сколько продлить контракт?</p>
    <div class="row" id="t-chips"></div>
  </div>`);
  chipGroup(m.querySelector('#t-chips'), [5,10,15,30], () => null, v => {
    const q = state.activeQuest;
    if (q) {
      q.endsAt = Date.now() + v * 60000;
      q.pausedAt = null; q.pausedUntil = null;
      q.endShown = false;
      q.nextEventAt = (!q.flowMode && q.reminderMin > 0) ? Date.now() + q.reminderMin * 60000 : null;
      saveState();
    }
    m.remove(); nav.onRender && nav.onRender();
  }, x => '+' + x + ' мин');
}

export function openPauseExpired() {
  sfx.pause();
  try {
    if ('Notification' in window && Notification.permission === 'granted')
      new Notification('Привал окончен!', { body: 'Наёмник, контракт ждёт.' });
  } catch (e) {}
  const m = overlay(`<div class="paper dialog pop">
    <h3 class="hand">⏰ Привал окончен</h3>
    <p style="margin:0">Пауза закончилась. Возвращаемся к контракту?</p>
    <div class="row">
      <button class="btn primary" id="x-go">Продолжить</button>
      <button class="btn" id="x-ext">Продлить</button>
      <button class="btn danger" id="x-drop">Бросить контракт</button>
    </div>
  </div>`);
  m.querySelector('#x-go').onclick = () => { m.remove(); resumeQuest(); nav.onRender && nav.onRender(); };
  m.querySelector('#x-ext').onclick = () => { m.remove(); openPauseForm(false); };
  m.querySelector('#x-drop').onclick = () => { m.remove(); drop(); };
}