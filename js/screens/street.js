import { el } from '../ui.js';
import { nav } from '../state.js';

export function renderStreet() {
  const wrap = el(`<main class="screen">
    <button class="backlink" data-home>← Дом</button>
    <div class="world">
      <div class="scene-fit">
        <img class="base" src="img/street.png" alt="" draggable="false">
        <div class="sign" style="left:8%;top:26%;pointer-events:none">Лавка</div>
        <div class="sign" style="left:78%;top:8%;pointer-events:none">Гильдия</div>
        <div class="hot" data-shop style="left:3%;top:30%;width:44%;height:65%"></div>
        <div class="hot" data-guild style="left:53%;top:8%;width:44%;height:80%"></div>
      </div>
    </div>
  </main>`);
  wrap.querySelector('[data-home]').onclick = () => nav.go('home');
  wrap.querySelector('[data-shop]').onclick = () => nav.go('shop');
  wrap.querySelector('[data-guild]').onclick = () => nav.go('guild');
  return wrap;
}