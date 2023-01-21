const { got } = require('./../got');

module.exports = {
  name: 'harrypotter',
  ping: true,
  description: 'Can give info about Harry Potter characters as well as search for characters by name, hair color, eye color etc.',
  permission: 100,
  category: 'Random command',
  execute: async (channel, user, input, perm) => {
    if (module.exports.permission > perm) {
      return;
    }
    switch (input[2]) {
    case 'random': {
      try {
        const characters = await got('http://hp-api.herokuapp.com/api/characters').json();
        let number = Math.floor(Math.random() * (characters.length - 0) + 0);

        characters[number].wand = `[ ${Object.entries(characters[number].wand).filter(filterByEmpty).join(' | ').replaceAll(',', ': ')} ]`;
        characters[number].alternate_names = `[ ${characters[number].alternate_names.filter(filterByEmpty).join(' | ')} ]`;

        const asArray = Object.entries(characters[number]);
        let filtered = asArray.filter(filterByEmpty);
        let reply = filtered.map(([key, value]) => `${key}: ${value}`);
        return reply.join(', ');
      } catch (err) {
        console.log(err);
        return 'FeelsDankMan Error';
      }
    }
    default: return 'Available harrypotter commands: random';
    }
  }
};

function filterByEmpty(item) {
  const [key, value] = item;
  if (value.length || typeof value === 'boolean' || typeof value === 'number') {
    if ((key === 'hogwartsStudent' || key === 'hogwartsStaff') && value === false) {
      return false;
    }
    if (value === '[  ]') {
      return false;
    }
    return true;
  }
  return false;
}