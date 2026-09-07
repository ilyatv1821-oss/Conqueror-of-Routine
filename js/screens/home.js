import { state, saveState, ritualDone, nav } from '../state.js';
import { el, sceneStage, fxSleepy, fxSpark, esc } from '../ui.js';
import { SHOP } from '../data.js';

export function renderHome() {
  const done = ritualDone();
  const items = state.ritualItems;
  const inv = state.player.inventory.map(id => SHOP.find(x => x.id === id)).filter(Boolean);
  const charRow = inv.filter(i => i.type === 'char').map(i => `<span>${i.icon}</span>`).join('');
  const homeRow = inv.filter(i => i.type === 'home').map(i => `<span>${i.icon}</span>`).join('');
  const p = state.player;
  const wrap = el(`<main class="screen">
    <h1 class="hand brand">Покоритель рутины</h1>
    <div class="slogan">Рутина будет покорена</div>
    ${sceneStage(done ? 'room-awake' : 'room-sleepy', '', done ? fxSpark : fxSleepy)}
    ${charRow ? `<div class="invrow">${charRow}</div>` : ''}
    <div class="paper stats">📜 контрактов: ${p.completed} · ⏱ минут: ${p.focusMin} · 🌅 дней: ${p.days}</div>
    <section class="paper ritual">
      <h2 class="hand">Утренний ритуал</h2>
      ${items.length ? '' : '<div class="placeholder">Пока пусто — добавь первый пункт ниже 👇</div>'}
      <div style="display:flex;flex-direction:column;gap:8px">
        ${items.map(it => `<div class="checkrow">
          <label class="check"><input type="checkbox" data-rit="${it.id}" ${it.done ? 'checked' : ''}><span>${esc(it.text)}</span></label>
          <button class="btn ghost del" data-del="${it.id}" title="Удалить пункт">✕</button>
        </div>`).join('')}
      </div>
      <div class="row">
        <input id="rit-new" placeholder="Новый пункт рутины…">
        <button class="btn" id="rit-add" disabled>+ Добавить</button>
      </div>
    </section>
    ${homeRow ? `<div class="invrow">${homeRow}</div>` : ''}
    <button class="btn primary" data-go ${done ? '' : 'disabled'}>${done ? 'К доске объявлений →' : '🔒 Сначала утренний ритуал'}</button>
  </main>`);
  wrap.querySelectorAll('[data-rit]').forEach(cb => cb.onchange = () => {
    const it = items.find(x => x.id == cb.dataset.rit);
    if (it) { it.done = cb.checked; saveState(); nav.onRender && nav.onRender(); }
  });
  wrap.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    state.ritualItems = state.ritualItems.filter(x => x.id != b.dataset.del);
    saveState(); nav.onRender && nav.onRender();
  });
  const newInput = wrap.querySelector('#rit-new');
  const addBtn = wrap.querySelector('#rit-add');
  newInput.oninput = () => { addBtn.disabled = !newInput.value.trim(); };
  const add = () => {
    const text = newInput.value.trim();
    if (!text) return;
    state.ritualItems.push({ id: state.ritualSeq++, text, done: false });
    saveState(); nav.onRender && nav.onRender();
    const ni = document.querySelector('#rit-new');
    if (ni) ni.focus();
  };
  addBtn.onclick = add;
  newInput.onkeydown = e => { if (e.key === 'Enter') add(); };
  wrap.querySelector('[data-go]').onclick = () => nav.go('board');
  return wrap;
}