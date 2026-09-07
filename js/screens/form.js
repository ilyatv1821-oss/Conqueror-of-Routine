import { state, saveState, nav } from '../state.js';
import { overlay, fmtDur } from '../ui.js';
import { ARCHETYPES } from '../data.js';

export function openForm(archetype) {
  const info = ARCHETYPES[archetype];
  const steps = ['', ''];
  let duration = 60, reminder = 10;
  const modal = overlay(`<div class="paper dialog">
    <h3 class="hand">${info.icon} ${info.title}</h3>
    <label class="field">Суть в реальности<input id="f-essence" placeholder="например, помыть посуду"></label>
    <div class="field"><span>Шаги (минимум 2)</span><div id="f-steps"></div></div>
    <button class="chip" id="f-add" type="button">+ шаг</button>
    <label class="field"><span>Время задачи: <b id="f-dur-label"></b></span>
      <input type="range" id="f-dur" min="30" max="720" step="30" value="60"></label>
    <label class="field"><span>События-напоминания: <b id="f-rem-label"></b></span>
      <input type="range" id="f-rem" min="5" max="30" step="5" value="10"></label>
    <div class="reward" id="f-reward"></div>
    <div class="row">
      <button class="btn primary" id="f-accept" type="button" disabled>Принять контракт</button>
      <button class="btn" id="f-cancel" type="button">Отмена</button>
    </div>
  </div>`);
  const essenceInput = modal.querySelector('#f-essence');
  const stepsBox = modal.querySelector('#f-steps');
  const rewardEl = modal.querySelector('#f-reward');
  const acceptBtn = modal.querySelector('#f-accept');
  const durInput = modal.querySelector('#f-dur');
  const remInput = modal.querySelector('#f-rem');
  const durLabel = modal.querySelector('#f-dur-label');
  const remLabel = modal.querySelector('#f-rem-label');

  function syncSliders() {
    duration = +durInput.value;
    reminder = +remInput.value;
    durLabel.textContent = fmtDur(duration);
    remLabel.textContent = 'каждые ' + reminder + ' мин';
  }
  durInput.oninput = syncSliders;
  remInput.oninput = syncSliders;

  function renderSteps() {
    stepsBox.innerHTML = '';
    steps.forEach((s, i) => {
      const inp = document.createElement('input');
      inp.placeholder = 'Шаг ' + (i + 1);
      inp.value = s;
      inp.oninput = () => { steps[i] = inp.value; refresh(); };
      stepsBox.appendChild(inp);
    });
    modal.querySelector('#f-add').style.display = steps.length < 6 ? '' : 'none';
  }
  function refresh() {
    const valid = essenceInput.value.trim() && steps[0] && steps[0].trim() && steps[1] && steps[1].trim();
    rewardEl.textContent = 'Награда: 🪙 ' + (20 + steps.filter(s => s && s.trim()).length * 2);
    acceptBtn.disabled = !valid;
  }
  essenceInput.oninput = refresh;
  modal.querySelector('#f-add').onclick = () => { steps.push(''); renderSteps(); refresh(); };
  modal.querySelector('#f-cancel').onclick = () => modal.remove();
  acceptBtn.onclick = () => {
    const now = Date.now();
    state.activeQuest = {
      archetype,
      essence: essenceInput.value.trim(),
      steps: steps.filter(s => s && s.trim()).map(t => ({ text: t.trim(), done: false })),
      durationMin: duration, reminderMin: reminder,
      endsAt: now + duration * 60000,
      pausedAt: null, pausedUntil: null,
      nextEventAt: now + reminder * 60000,
      endShown: false, flowMode: false,
    };
    state.board[archetype] = 'active';
    saveState(); modal.remove(); nav.go('focus');
  };
  renderSteps(); refresh(); syncSliders();
}