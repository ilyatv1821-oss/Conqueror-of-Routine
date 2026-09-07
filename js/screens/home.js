import { state, saveState, ritualDone, nav } from '../state.js';
import { el, overlay, esc, stickerImg, hydrateStickers, enablePan } from '../ui.js';
import { SLOTS, FURN, DEFAULT_OWNED, HERO_POS } from '../data.js';

const isOwned = id => DEFAULT_OWNED.includes(id) || state.player.inventory.includes(id);

export function renderHome() {
  const done = ritualDone();
  const hero = done ? 'awake' : 'sleepy';
  const hp = HERO_POS[hero];

  const furnLayers = Object.entries(state.home).map(([slot, id]) => {
    const s = SLOTS[slot];
    if (!id || !FURN[id])
      return `<div class="slot-empty" data-slot="${slot}" style="left:${s.x}%;top:${s.y}%;width:${s.w}%;height:${s.h}%">+</div>`;
    return `<div class="furn" data-slot="${slot}" style="left:${s.x}%;top:${s.y}%;width:${s.w}%">${stickerImg(FURN[id].img)}</div>`;
  }).join('');

  const wrap = el(`<main class="screen">
    <h1 class="hand brand">Покоритель рутины</h1>
    <div class="slogan">Рутина будет покорена</div>
    <div class="world">
      <div class="world-scroll" data-pan>
        <div class="scene-room">
          <img class="base" src="img/room-base.png" alt="" draggable="false">
          ${furnLayers}
          <div class="sticker" style="left:${hp.x}%;top:${hp.y}%;width:${hp.w}%">${stickerImg('hero-' + hero)}</div>
          ${done ? '' : `<div class="sign" data-wake style="left:13%;top:33%">Разбуди меня</div>`}
          <div class="hot" data-wake style="left:${hp.x - 2}%;top:${hp.y - 2}%;width:${hp.w + 4}%;height:32%"></div>
          <div class="hot" data-door style="left:78%;top:8%;width:17%;height:66%"></div>
        </div>
      </div>
    </div>
  </main>`);

  enablePan(wrap.querySelector('[data-pan]'));
  wrap.querySelectorAll('[data-wake]').forEach(z => z.onclick = () => openRitual());
  wrap.querySelectorAll('[data-door]').forEach(z => z.onclick = () => {
    if (ritualDone()) nav.go('street'); else openRitual();
  });
  wrap.querySelectorAll('.furn').forEach(f => f.onclick = () => openFurnMenu(f.dataset.slot));
  wrap.querySelectorAll('.slot-empty').forEach(f => f.onclick = () => openFurnMenu(f.dataset.slot));
  hydrateStickers(wrap);
  return wrap;
}

export function openRitual() {
  const m = overlay(`<div class="paper dialog">
    <h3 class="hand">Утренний ритуал</h3>
    <div id="r-list" style="display:flex;flex-direction:column;gap:8px"></div>
    <div class="row">
      <input id="rit-new" placeholder="Новый пункт…">
      <button class="btn" id="rit-add" disabled>+ Добавить</button>
    </div>
    <div id="r-done-note" class="reward" style="display:none">Наёмник проснулся! ☀</div>
    <div class="row"><button class="btn primary" id="r-close">Готово</button></div>
  </div>`);
  const list = m.querySelector('#r-list');
  const note = () => { m.querySelector('#r-done-note').style.display = ritualDone() ? '' : 'none'; };
  const draw = () => {
    list.innerHTML = state.ritualItems.length ? '' : '<div class="placeholder">Пока пусто — добавь первый пункт 👇</div>';
    state.ritualItems.forEach(it => {
      list.appendChild(el(`<div class="checkrow">
        <label class="check"><input type="checkbox" ${it.done ? 'checked' : ''}><span>${esc(it.text)}</span></label>
        <button class="btn ghost del" title="Удалить">✕</button>
      </div>`));
      const row = list.lastElementChild;
      row.querySelector('input').onchange = e => {
        it.done = e.target.checked; saveState(); note();
        nav.onRender && nav.onRender();
      };
      row.querySelector('.del').onclick = () => {
        state.ritualItems = state.ritualItems.filter(x => x.id !== it.id);
        saveState(); draw(); note();
        nav.onRender && nav.onRender();
      };
    });
  };
  const ni = m.querySelector('#rit-new'), ab = m.querySelector('#rit-add');
  ni.oninput = () => { ab.disabled = !ni.value.trim(); };
  const add = () => {
    const t = ni.value.trim(); if (!t) return;
    state.ritualItems.push({ id: state.ritualSeq++, text: t, done: false });
    saveState(); ni.value = ''; ab.disabled = true; draw();
    nav.onRender && nav.onRender();
  };
  ab.onclick = add;
  ni.onkeydown = e => { if (e.key === 'Enter') add(); };
  m.querySelector('#r-close').onclick = () => m.remove();
  draw(); note();
}

function openFurnMenu(slot) {
  const s = SLOTS[slot];
  const options = Object.entries(FURN).filter(([id, f]) => f.slot === slot && isOwned(id));
  const current = state.home[slot];
  const m = overlay(`<div class="paper dialog">
    <h3 class="hand">${s.name}</h3>
    ${options.length ? '' : '<div class="placeholder">Для этого места пока ничего не куплено. Загляни в лавку!</div>'}
    <div style="display:flex;flex-direction:column;gap:6px">
      ${options.map(([id, f]) => `<button class="btn ${id === current ? 'on' : ''}" data-pick="${id}">${f.name}</button>`).join('')}
    </div>
    <div class="row">
      ${current ? '<button class="btn danger" data-clear>Убрать в кладовую</button>' : ''}
      <button class="btn" data-close>Закрыть</button>
    </div>
  </div>`);
  m.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => {
    state.home[slot] = b.dataset.pick; saveState(); m.remove();
    nav.onRender && nav.onRender();
  });
  const cl = m.querySelector('[data-clear]');
  if (cl) cl.onclick = () => { state.home[slot] = null; saveState(); m.remove(); nav.onRender && nav.onRender(); };
  m.querySelector('[data-close]').onclick = () => m.remove();
}