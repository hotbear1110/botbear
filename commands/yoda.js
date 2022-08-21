const got = require('got');
require('dotenv').config();
const tools = require('../tools/tools.js');
const regex = require('../tools/regex.js');

//Made by: @sougataghar477
module.exports = {
  name: 'yoda',
  ping: true,
  description: 'This command will translate the input to Yoda speach',
  permission: 100,
  category: 'Random command',
  execute: async (channel, user, input, perm) => {
    try {
      if (module.exports.permission > perm) {
        return;
      }
      input = input.splice(2);
      let msg = input.join(' ');
      
      msg.replace(regex.invisChar, '');
      
      let yoda = await got(
        `https://api.funtranslations.com/translate/yoda.json?text=${msg}`,
        { 
            timeout: 10000 
        }
      ).json();
      
      let yodaText = yoda.contents.translated;
      
      if (tools.isMod(user, channel) === false && perm < 2000 && msg.match(/[&|$|/|.|?|-]|\bkb\b|^\bmelon\b/g)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
				yodaText = yodaText.charAt(0) + '\u{E0000}' + yodaText.substring(1);
			}
			if (yodaText.match(/!/g)) {
				yodaText = '❗ ' + yodaText.substring(1);
			}

			if (perm < 2000 && msg.match(/(\.|\/)color/g)) {
        yodaText = '. ' + yodaText;
			}

			if (msg.toLowerCase().startsWith(`/ban ${process.env.TWITCH_OWNERNAME}`) || msg.toLowerCase().startsWith(`/timeout ${process.env.TWITCH_OWNERNAME}`) || msg.toLowerCase().startsWith(`/unmod ${process.env.TWITCH_USER}`)) {
        yodaText = '. ' + yodaText;
			}

      return yodaText;
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
