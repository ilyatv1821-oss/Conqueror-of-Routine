export const KEY = 'merc-focus-save-v1';
export const FROZEN = Infinity;
export const today = () => new Date().toISOString().slice(0, 10);

export function initialState() {
  return {
    player: { coins: 0, inventory: [], completed: 0, focusMin: 0, days: 1 },
    day: { date: today() },
    ritualItems: [],
    ritualSeq: 1,
    board: { gathering: 'available', fight: 'available', escort: 'available', search: 'available' },
    activeQuest: null,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initialState();
    const s = JSON.parse(raw);
    if (!Array.isArray(s.ritualItems)) {
      const old = (s.day && s.day.ritual) || {};
      const texts = { shower: 'Душ', teeth: 'Зубы', breakfast: 'Завтрак / стакан воды' };
      s.ritualItems = Object.keys(texts).filter(k => k in old)
        .map((k, i) => ({ id: i + 1, text: texts[k], done: !!old[k] }));
      s.ritualSeq = s.ritualItems.length + 1;
    }
    if (s.ritualSeq == null) s.ritualSeq = s.ritualItems.reduce((m, i) => Math.max(m, i.id), 0) + 1;
    if (s.day.date !== today()) {
      s.day = { date: today() };
      s.ritualItems.forEach(i => { i.done = false; });
      Object.keys(s.board).forEach(a => { if (s.board[a] === 'done') s.board[a] = 'available'; });
      s.player.days = (s.player.days || 1) + 1;
    }
    const q = s.activeQuest;
    if (q) {
      if (q.pausedAt == null && q.pausedUntil != null) q.pausedAt = Date.now();
      if (q.nextEventAt === undefined)
        q.nextEventAt = (!q.flowMode && q.reminderMin > 0) ? Date.now() + q.reminderMin * 60000 : null;
    }
    return s;
  } catch { return initialState(); }
}

export let state = loadState();
export const saveState = () => localStorage.setItem(KEY, JSON.stringify(state));
export const ritualDone = () => state.ritualItems.length > 0 && state.ritualItems.every(i => i.done);

// модель времени
export const isHalted = q => q.pausedAt != null;
export const isPaused = q => q.pausedUntil != null && q.pausedUntil !== FROZEN;
export const isFrozen = q => q.pausedUntil === FROZEN;
export const questRemaining = q => isHalted(q) ? q.endsAt - q.pausedAt : q.endsAt - Date.now();

// навигация без циклических импортов
export const nav = {
  screen: 'home',
  onRender: null,
  go(s) { this.screen = s; if (this.onRender) this.onRender(); },
};