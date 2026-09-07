import { state, saveState, nav } from '../state.js';
import { el, sfx } from '../ui.js';
import { SHOP } from '../data.js';

export function renderShop() {
  const wrap = el(`<main class="screen">
    <h2 class="hand">Лавка торговца</h2>
    <div class="coins">🪙 ${state.player.coins}</div>
    <div class="shopgrid">
      ${SHOP.map(it => {
        const owned = state.player.inventory.includes(it.id);
        const afford = state.player.coins >= it.price;
        return `<button class="paper shopitem" data-item="${it.id}" ${owned || !afford ? 'disabled' : ''}>
          <span class="icon">${it.icon}</span>
          <span class="name">${it.name}</span>
          <span class="stamp ${owned ? 'done' : ''}">${owned ? '✓ куплено' : '🪙 ' + it.price}</span>
        </button>`;
      }).join('')}
    </div>
  </main>`);
  wrap.querySelectorAll('[data-item]').forEach(b => b.onclick = () => {
    const it = SHOP.find(x => x.id === b.dataset.item);
    if (!it || state.player.inventory.includes(it.id) || state.player.coins < it.price) return;
    state.player.coins -= it.price;
    state.player.inventory.push(it.id);
    saveState(); sfx.coin(); nav.onRender && nav.onRender();
  });
  return wrap;
}