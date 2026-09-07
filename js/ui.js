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

// ---------- ПЕРСОНАЖ (по концепт-арту: булочка-голова, красный шарф, кожаный доспех) ----------
export function heroSVG(mood, size) {
  const faces = {
    sleepy: `<path d="M50 48 q6 6 12 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M78 48 q6 6 12 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="70" cy="62" r="3" fill="#33302a"/>
      <text x="104" y="26" font-size="16" fill="#7a7264" font-family="Caveat">z</text>
      <text x="114" y="14" font-size="12" fill="#7a7264" font-family="Caveat">z</text>`,
    awake: `<circle cx="56" cy="48" r="3.5" fill="#33302a"/><circle cx="84" cy="48" r="3.5" fill="#33302a"/>
      <path d="M64 60 q6 6 12 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>`,
    happy: `<path d="M50 50 q6 -7 12 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M78 50 q6 -7 12 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M62 58 q8 12 16 0" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>`,
    work: `<path d="M50 47 h12" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M78 47 h12" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>
      <path d="M64 61 h12" fill="none" stroke="#33302a" stroke-width="3" stroke-linecap="round"/>`,
  };
  return `<svg class="hero-svg" viewBox="0 0 140 170" width="${size || 140}" aria-hidden="true">
    <!-- ботинки -->
    <rect x="50" y="148" width="16" height="14" rx="6" fill="#6b4423" stroke="#33302a" stroke-width="3"/>
    <rect x="74" y="148" width="16" height="14" rx="6" fill="#6b4423" stroke="#33302a" stroke-width="3"/>
    <!-- тело-доспех -->
    <ellipse cx="70" cy="118" rx="36" ry="34" fill="#8a5a33" stroke="#33302a" stroke-width="3"/>
    <!-- крест-ремни с заклёпками -->
    <path d="M46 98 L94 138" stroke="#b98d5f" stroke-width="7" stroke-linecap="round"/>
    <path d="M94 98 L46 138" stroke="#b98d5f" stroke-width="7" stroke-linecap="round"/>
    <circle cx="52" cy="104" r="4" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <circle cx="88" cy="104" r="4" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <circle cx="52" cy="132" r="4" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <circle cx="88" cy="132" r="4" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <circle cx="70" cy="118" r="5" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <!-- ремень с бляхой -->
    <rect x="38" y="132" width="64" height="10" rx="3" fill="#5b3a1e" stroke="#33302a" stroke-width="2"/>
    <rect x="62" y="130" width="16" height="14" rx="2" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <rect x="66" y="134" width="8" height="6" fill="none" stroke="#33302a" stroke-width="2"/>
    <!-- руки -->
    <ellipse cx="32" cy="116" rx="9" ry="12" fill="#6b4423" stroke="#33302a" stroke-width="3"/>
    <ellipse cx="108" cy="116" rx="9" ry="12" fill="#6b4423" stroke="#33302a" stroke-width="3"/>
    <!-- наплечники с шипами -->
    <path d="M30 86 l5 -11 l6 11 z" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <path d="M40 84 l5 -11 l6 11 z" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <ellipse cx="40" cy="94" rx="15" ry="11" fill="#7a4f2a" stroke="#33302a" stroke-width="3"/>
    <path d="M94 84 l5 -11 l6 11 z" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <path d="M104 86 l5 -11 l6 11 z" fill="#cfd4d8" stroke="#33302a" stroke-width="2"/>
    <ellipse cx="100" cy="94" rx="15" ry="11" fill="#7a4f2a" stroke="#33302a" stroke-width="3"/>
    <!-- сумка на бедре -->
    <ellipse cx="104" cy="142" rx="10" ry="9" fill="#c9a06a" stroke="#33302a" stroke-width="2.5"/>
    <path d="M96 139 q8 -6 16 0" fill="none" stroke="#33302a" stroke-width="2"/>
    <!-- шарф -->
    <path d="M42 76 Q70 94 98 76 L98 90 Q70 108 42 90 Z" fill="#d4574a" stroke="#33302a" stroke-width="3"/>
    <path d="M86 90 q12 12 6 28 q-10 -8 -14 -18 z" fill="#d4574a" stroke="#33302a" stroke-width="3"/>
    <!-- голова-булочка с хохолком -->
    <circle cx="70" cy="46" r="34" fill="#fdf6e8" stroke="#33302a" stroke-width="3"/>
    <path d="M63 12 Q70 2 77 13 Q70 9 63 12 Z" fill="#fdf6e8" stroke="#33302a" stroke-width="3" stroke-linejoin="round"/>
    <!-- румянец -->
    <circle cx="48" cy="56" r="6" fill="#f6b3a6"/>
    <circle cx="92" cy="56" r="6" fill="#f6b3a6"/>
    ${faces[mood] || faces.awake}
  </svg>`;
}