const { got } = require('./../got');
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
      const authKey = process.env.APEX_API;
      if (!authKey) {
        return 'This command is not available at the moment';
      }
      
      let map = JSON.parse((await got(
        `https://api.mozambiquehe.re/maprotation?version=2&auth=${process.env.APEX_API}`,
        )).body);

      let { map: currentMap, end } = map.battle_royale.current;

      let { map: nextMap, DurationInMinutes } = map.battle_royale.next;
      
      let remainingTime = (end * 1000) - (Date.now());
      return `Current map is ${currentMap} which lasts for ${tools.humanizeDuration(remainingTime)}. Next map is ${nextMap} which lasts for ${DurationInMinutes} minutes.`;
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
