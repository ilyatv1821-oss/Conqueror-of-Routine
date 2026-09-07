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

// Слоты: x/w — слева и ширина в %; b — отступ НИЗА от пола (напольные), t — от верха (настенные); h — высота пунктирного слота
export const SLOTS = {
  bed:     { x: 2,  w: 30, b: 8,  h: 26, name: 'Кровать' },
  board:   { x: 34, w: 20, b: 14, h: 34, name: 'Доска' },
  shelf:   { x: 7,  w: 16, t: 20, h: 20, name: 'Полка' },
  rug:     { x: 38, w: 28, b: 0,  h: 12, name: 'Коврик' },
  storage: { x: 68, w: 15, b: 10, h: 22, name: 'Хранилище' },
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

// Позиции героя: тоже якорь по низу
export const HERO_POS = {
  sleepy: { x: 27, w: 14, b: 12 },
  awake:  { x: 45, w: 16, b: 6 },
};