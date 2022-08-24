const got = require('got');
require('dotenv').config();
const tools = require('../tools/tools.js');

//Made by: @sougataghar477
module.exports = {
  name: 'nasa',
  ping: true,
  description: 'This command will give random image from NASA',
  permission: 100,
  category: 'Random command',
  execute: async (channel, user, input, perm) => {
    try {
      if (module.exports.permission > perm) {
        return;
      }
      let nasa = await got(
        `https://api.nasa.gov/planetary/apod?api_key=vs9YmT1dIOOcOoyQbYuaMSCL2gm9nmnjdnZVmNJU`,
        { 
            timeout: 10000 
        }
      ).json();
      return 'Astronomy Picture Of The Day: '+nasa.hdurl;
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
