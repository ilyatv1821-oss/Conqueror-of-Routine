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
export function heroSVG(mood, size) {
  const faces = {
    sleepy: `<path d="M40 52 q6 6 12 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M68 52 q6 6 12 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="60" cy="67" r="3" fill="#33302a"/>
      <text x="96" y="28" font-size="16" fill="#7a7264" font-family="Caveat">z</text>
      <text x="106" y="16" font-size="12" fill="#7a7264" font-family="Caveat">z</text>`,
    awake: `<circle cx="46" cy="52" r="3.5" fill="#33302a"/><circle cx="74" cy="52" r="3.5" fill="#33302a"/>
      <path d="M52 64 q8 7 16 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>`,
    happy: `<path d="M40 54 q6 -7 12 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M68 54 q6 -7 12 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 63 q10 12 20 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>`,
    work: `<path d="M40 51 h12" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M68 51 h12" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M54 66 h12" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>`,
  };
  return `<svg class="hero-svg" viewBox="0 0 120 140" width="${size || 140}" aria-hidden="true">
    <ellipse cx="60" cy="106" rx="34" ry="28" fill="#8a5a33" stroke="#33302a" stroke-width="3"/>
    <rect x="28" y="104" width="64" height="9" fill="#5b3a1e"/>
    <rect x="53" y="101" width="14" height="14" fill="#d9a441" stroke="#33302a" stroke-width="2"/>
    <path d="M26 84 Q60 98 94 84 L94 94 Q60 108 26 94 Z" fill="#a63d2f" stroke="#33302a" stroke-width="3"/>
    <circle cx="60" cy="50" r="34" fill="#fdf6e8" stroke="#33302a" stroke-width="3"/>
    <path d="M50 18 Q60 8 68 20" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
    <circle cx="38" cy="60" r="5" fill="#f3b8a8"/><circle cx="82" cy="60" r="5" fill="#f3b8a8"/>
    ${faces[mood] || faces.awake}
  </svg>`;
}