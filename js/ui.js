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

// ---------- ПЕРСОНАЖ ----------
// Спрайт-лист 2×2 (img/hero-sheet.png): сон / бодр / деловой / радостный.
// Нужная четверть вырезается через background-position (классы mood-*).
export function hero(mood, sizeCls) {
  return `<div class="hero-frame ${sizeCls || 'hero-lg'}">
    <div class="hero-img mood-${mood}" role="img" aria-label="наёмник"></div>
  </div>`;
}