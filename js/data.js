export const ARCHETYPES = {
  gathering: { title: 'Собрать травы', icon: '🌿' },
  fight:     { title: 'Перебить слаймов', icon: '⚔️' },
  escort:    { title: 'Сопроводить обоз', icon: '🛡️' },
  search:    { title: 'Найти кошку', icon: '🔍' },
};

export const EVENTS = {
  gathering: '🌿 Ты заметил новое место для сбора! Как урожай — на каком ты шаге?',
  fight: '⚔️ Слаймы огрызаются! Время хила: выдохни, разомнись — и обратно в бой.',
  escort: '🛡️ Привал! Обоз встал на минуту — попей воды и продолжай путь.',
  search: '🔍 Ты перешёл на новое место. Осмотрись: как продвигаются поиски?',
};

export const SLOTS = {
  bed:     { x: 3,  y: 54, w: 30, h: 34, name: 'Кровать' },
  board:   { x: 36, y: 46, w: 20, h: 42, name: 'Доска' },
  shelf:   { x: 8,  y: 24, w: 16, h: 26, name: 'Полка' },
  rug:     { x: 40, y: 80, w: 26, h: 13, name: 'Коврик' },
  storage: { x: 70, y: 64, w: 15, h: 22, name: 'Хранилище' },
};

export const FURN = {
  bed:      { img: 'furn-bed',      slot: 'bed',     name: 'Кровать с лоскутным одеялом' },
  board:    { img: 'furn-board',    slot: 'board',   name: 'Доска объявлений' },
  shelf:    { img: 'furn-shelf',    slot: 'shelf',   name: 'Полка с зельями' },
  rug:      { img: 'furn-rug',      slot: 'rug',     name: 'Плетёный коврик' },
  chest:    { img: 'furn-chest',    slot: 'storage', name: 'Резной сундук' },
  bookcase: { img: 'furn-bookcase', slot: 'storage', name: 'Книжный шкаф' },
};

export const DEFAULT_OWNED = ['bed', 'board', 'shelf', 'rug'];

export const SHOP = [
  { id: 'chest',    name: 'Резной сундук', type: 'home', price: 120, icon: '🧰' },
  { id: 'bookcase', name: 'Книжный шкаф',  type: 'home', price: 150, icon: '📚' },
];

export const HERO_POS = {
  sleepy: { x: 30, y: 62, w: 13 },
  awake:  { x: 44, y: 62, w: 15 },
};