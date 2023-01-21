const fetch = require('node-fetch');

module.exports = {
  name: 'dinner',
  ping: true,
  description: 'This command will recommend a dinner dish.',
  permission: 100,
  category: 'Random command',
  execute: async (channel, user, input, perm) => {
    try {
      if (module.exports.permission > perm) {
        return;
      }
      let url = 'http://www.recipepuppy.com/api/';
      let response = await fetch(url);
      let data = await response.json();
      let recipes = data.results;
      let randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
      return `I recommend you make ${randomRecipe.title} tonight! The recipe can be found here: ${randomRecipe.href}`;
    } catch (err) {
      console.log(err);
      return 'FeelsDankMan Error';
    }
  }
};