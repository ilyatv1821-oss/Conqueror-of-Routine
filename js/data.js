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

// Слоты комнаты (x/y/w/h — проценты сцены)
export const SLOTS = {
  bed:     { x: 4,  y: 48, w: 24, h: 30, name: 'Кровать' },
  board:   { x: 30, y: 32, w: 16, h: 36, name: 'Доска' },
  shelf:   { x: 47, y: 26, w: 13, h: 22, name: 'Полка' },
  rug:     { x: 36, y: 76, w: 20, h: 14, name: 'Коврик' },
  storage: { x: 70, y: 60, w: 13, h: 20, name: 'Хранилище' },
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
  sleepy: { x: 24, y: 44, w: 11 },
  awake:  { x: 43, y: 40, w: 13 },
};