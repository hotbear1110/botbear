const got = require('got');
require('dotenv').config();
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
      const map = await got(
        `https://api.mozambiquehe.re/maprotation?version=2&auth=${process.env.APEX_API}`,
        { 
            timeout: 10000 
        }
      );

      let { map: currentMap, remainingTimer } = JSON.parse(map.battle_royale.current);

      let { map: nextMap, DurationInMinutes } = JSON.parse(map.battle_royale.next);

      return `Current map is ${currentMap} which lasts for ${remainingTimer} .Next map is ${nextMap} which lasts for ${DurationInMinutes} minutes.`;
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