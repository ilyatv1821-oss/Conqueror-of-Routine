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

export const SHOP = [
  { id: 'mug',     name: 'Кружка наёмника',   type: 'home', price: 40,  icon: '🍵' },
  { id: 'plant',   name: 'Растение в горшке', type: 'home', price: 50,  icon: '🪴' },
  { id: 'scarf',   name: 'Красный шарф',      type: 'char', price: 60,  icon: '🧣' },
  { id: 'map',     name: 'Карта на стену',    type: 'home', price: 70,  icon: '🗺️' },
  { id: 'hat',     name: 'Шляпа следопыта',   type: 'char', price: 80,  icon: '🎩' },
  { id: 'garland', name: 'Гирлянда',          type: 'home', price: 90,  icon: '🎇' },
  { id: 'shield',  name: 'Щит стража',        type: 'char', price: 100, icon: '🛡️' },
  { id: 'sword',   name: 'Новый меч',         type: 'char', price: 120, icon: '🗡️' },
];