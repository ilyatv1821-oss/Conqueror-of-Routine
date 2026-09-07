export const esc = s => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const fmtMS = ms => {
  const s = Math.max(0, Math.round(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const mm = String(m).padStart(2, '0'), ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};
export const fmtClock = ts => new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
export const fmtDur = min => min < 60 ? min + ' мин' : (min % 60 === 0 ? (min / 60) + ' ч' : Math.floor(min / 60) + ' ч ' + (min % 60) + ' мин');

export const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
export const overlay = html => { const m = el(`<div class="modal">${html}</div>`); document.body.appendChild(m); return m; };
export const modalOpen = () => !!document.querySelector('.modal');

export function chipGroup(box, options, get, set, fmt) {
  const draw = () => {
    box.innerHTML = '';
    options.forEach(v => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip' + (v === get() ? ' on' : '');
      b.textContent = fmt(v);
      b.onclick = () => { set(v); draw(); };
      box.appendChild(b);
    });
  };
  draw();
}

// ---------- ЗВУК ----------
let audioCtx = null;
function beep(freq, dur, type, gain) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = gain;
    o.connect(g); g.connect(audioCtx.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    o.stop(audioCtx.currentTime + dur);
  } catch (e) {}
}
export const sfx = {
  coin()  { beep(880,.14,'square',.22); setTimeout(()=>beep(1320,.18,'square',.22), 130); },
  event() { beep(660,.22,'sine',.22); },
  pause() { beep(440,.22,'sine',.22); },
  done()  { [523,660,880,1046].forEach((f,i)=>setTimeout(()=>beep(f,.18,'triangle',.22), i*140)); },
};

// ---------- СТИКЕРЫ: хрома-вырезка зелёного фона ----------
const GLYPH = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const chromaCache = new Map();
function loadImg(src) {
  return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
}
export function processSticker(name) {
  if (chromaCache.has(name)) return chromaCache.get(name);
  const p = loadImg(`img/${name}.png`).then(img => {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height);
    const px = d.data;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2];
      if (g > 110 && g - r > 35 && g - b > 35) px[i + 3] = 0;
    }
    ctx.putImageData(d, 0, 0);
    return c.toDataURL('image/png');
  });
  chromaCache.set(name, p);
  return p;
}
export function stickerImg(name, cls = '') {
  return `<img class="${cls}" data-sticker="${name}" src="${GLYPH}" alt="" draggable="false">`;
}
export function hydrateStickers(root = document) {
  root.querySelectorAll('img[data-sticker]').forEach(img => {
    const name = img.dataset.sticker;
    processSticker(name).then(url => { img.src = url; }).catch(() => { img.src = `img/${name}.png`; });
  });
}

// ---------- ГОРИЗОНТАЛЬНЫЙ ПАН (drag-scroll) ----------
export function enablePan(scrollEl) {
  let down = false, dragged = false, sx = 0, sl = 0;
  scrollEl.addEventListener('pointerdown', e => { down = true; dragged = false; sx = e.clientX; sl = scrollEl.scrollLeft; scrollEl.classList.add('drag'); });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 6) dragged = true;
    scrollEl.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', () => { down = false; scrollEl.classList.remove('drag'); setTimeout(() => { dragged = false; }, 0); });
  scrollEl.addEventListener('click', e => {
    if (dragged) { e.stopPropagation(); e.preventDefault(); dragged = false; }
  }, true);
}

// ---------- СЦЕНЫ (для фокуса/награды) ----------
export function sceneStage(name, cls = '', fx = '') {
  return `<div class="stage ${cls}" data-stage>
    <img class="scene" src="img/${name}.png" alt="" draggable="false">
    ${fx}
  </div>`;
}
export const fxSpark = `
  <span class="fx fx-spark" style="top:18%; left:16%; animation-delay:0s">✦</span>
  <span class="fx fx-spark" style="top:12%; left:76%; animation-delay:.6s">✦</span>
  <span class="fx fx-spark" style="top:38%; left:88%; animation-delay:1.2s">✦</span>`;
export function hopStage(root = document) {
  const s = root.querySelector('[data-stage]'); if (!s) return;
  s.classList.remove('hop', 'shake'); void s.offsetWidth; s.classList.add('hop');
}
export function shakeStage(root = document) {
  const s = root.querySelector('[data-stage]'); if (!s) return;
  s.classList.remove('hop', 'shake'); void s.offsetWidth; s.classList.add('shake');
}
export function confetti(host) {
  if (!host) return;
  const colors = ['#d9a441', '#a63d2f', '#5d7a45', '#7a9cc4'];
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('span');
    p.className = 'confetti';
    p.style.left = (5 + Math.random() * 90) + '%';
    p.style.background = colors[i % 4];
    p.style.animationDelay = (Math.random() * .4) + 's';
    host.appendChild(p);
  }
}