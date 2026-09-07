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

// ---------- СЦЕНЫ И АНИМАЦИЯ ----------
export function sceneStage(name, cls = '', fx = '') {
  return `<div class="stage ${cls}" data-stage>
    <img class="scene" src="img/${name}.png" alt="" draggable="false">
    ${fx}
  </div>`;
}
export const fxSleepy = `
  <span class="fx fx-z" style="top:20%; left:60%; animation-delay:0s">z</span>
  <span class="fx fx-z" style="top:15%; left:68%; animation-delay:1s">z</span>
  <span class="fx fx-z" style="top:10%; left:76%; animation-delay:2s">z</span>`;
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