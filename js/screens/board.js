import { state, ritualDone, nav } from '../state.js';
import { el } from '../ui.js';
import { ARCHETYPES } from '../data.js';
import { openForm } from './form.js';

export function renderBoard() {
  const done = ritualDone();
  const cover = !done
    ? (state.ritualItems.length
        ? '<div class="paper cover">Наёмник ещё не привёл себя в порядок 🪥</div>'
        : '<div class="paper cover">Ритуал пуст — собери его в Доме 🏠</div>')
    : (state.activeQuest ? '<div class="paper cover">Сначала заверши текущий контракт 📜</div>' : '');
  const wrap = el(`<main class="screen">
    <h2 class="hand">Доска объявлений</h2>
    ${cover}
    <div class="notes">
      ${Object.entries(ARCHETYPES).map(([a, info], i) => {
        const st = state.board[a];
        const clickable = st === 'active' || (st === 'available' && done && !state.activeQuest);
        const stamp = st === 'done' ? '✓ выполнено' : st === 'active' ? 'в работе' : 'доступно';
        return `<button class="note paper r${i % 4}" data-quest="${a}" ${clickable ? '' : 'disabled'}>
          <span class="icon">${info.icon}</span>
          <span class="title hand">${info.title}</span>
          <span class="stamp ${st}">${stamp}</span>
        </button>`;
      }).join('')}
    </div>
  </main>`);
  wrap.querySelectorAll('[data-quest]').forEach(btn => btn.onclick = () => {
    const a = btn.dataset.quest;
    if (state.board[a] === 'active') nav.go('focus');
    else if (!state.activeQuest) openForm(a);
  });
  return wrap;
}