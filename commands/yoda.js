const got = require('got');
require('dotenv').config();
const tools = require('../tools/tools.js');

//Made by: @sougataghar477
module.exports = {
  name: 'apexmap',
  ping: true,
  description: 'This command will give you the current map in apex pubs',
  permission: 100,
  category: 'Random command',
  execute: async (channel, user, input, perm) => {
    try {
      if (module.exports.permission > perm) {
        return;
      }
      let yoda = await got(
        `https://api.funtranslations.com/translate/yoda.json?text=${input.join(" ")}`,
        { 
            timeout: 10000 
        }
      ).json();
        // yoda = JSON.parse(yoda.body);

      

      return yoda.contents.translated;
    } catch (err) {
      console.log(err);
      if (err.name) {
        if (err.name === 'TimeoutError') {
          return `FeelsDankMan api error: ${err.name}`;
        }
      }
      return 'FeelsDankMan Error';
    }
  },
};
