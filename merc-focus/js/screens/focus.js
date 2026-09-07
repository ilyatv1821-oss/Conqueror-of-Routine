import { state, saveState, nav, isHalted, isPaused } from '../state.js';
import { el, heroSVG, esc, fmtClock } from '../ui.js';
import { ARCHETYPES } from '../data.js';
import { openPauseForm, confirmDrop, resumeQuest, completeQuest } from '../quest.js';
import { renderHome } from './home.js';

export function renderFocus() {
  const q = state.activeQuest;
  if (!q) { nav.screen = 'home'; return renderHome(); }
  const info = ARCHETYPES[q.archetype];
  const pauseLabel = isPaused(q) ? `⏸ Пауза до ${fmtClock(q.pausedUntil)}` : '❄ Заморожено';
  const pauseBlock = isHalted(q) ? `<div class="paper cover pausebox">${pauseLabel}
    <div class="row">
      <button class="btn primary" id="pz-go">Продолжить сейчас</button>
      ${isPaused(q) ? '<button class="btn" id="pz-ext">Продлить</button>' : ''}
    </div></div>` : '';

  const wrap = el(`<main class="screen"><div class="paper focuscard">
    <div class="focushead">${heroSVG('work', 64)}<h3 class="hand">${info.icon} ${info.title}</h3></div>
    <p style="margin:0"><b>Реальность:</b> ${esc(q.essence)}</p>
    <div class="timer" id="timer">--:--</div>
    <div id="stepbox" class="ritual" style="width:100%"></div>
    ${pauseBlock}
    <div class="row">
      <button class="btn" id="f-pause" ${isHalted(q) ? 'disabled' : ''}>Пауза</button>
      <button class="btn ${q.flowMode ? 'flow-on' : ''}" id="f-flow" ${q.flowMode ? 'disabled' : ''}>${q.flowMode ? '🎯 в потоке' : '🎯 Словил фикс'}</button>
      <button class="btn danger" id="f-drop">Бросить контракт</button>
    </div>
  </div></main>`);
  const box = wrap.querySelector('#stepbox');
  q.steps.forEach(s => {
    const lab = el(`<label class="check"><input type="checkbox" ${s.done ? 'checked' : ''}><span>${esc(s.text)}</span></label>`);
    lab.querySelector('input').onchange = e => {
      s.done = e.target.checked; saveState();
      if (q.steps.every(x => x.done)) completeQuest();
    };
    box.appendChild(lab);
  });
  wrap.querySelector('#f-pause').onclick = () => openPauseForm(true);
  wrap.querySelector('#f-flow').onclick = () => { q.flowMode = true; q.nextEventAt = null; saveState(); nav.onRender && nav.onRender(); };
  wrap.querySelector('#f-drop').onclick = () => confirmDrop();
  if (isHalted(q)) {
    wrap.querySelector('#pz-go').onclick = () => { resumeQuest(); nav.onRender && nav.onRender(); };
    const ext = wrap.querySelector('#pz-ext');
    if (ext) ext.onclick = () => openPauseForm(false);
  }
  return wrap;
}