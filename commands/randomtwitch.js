const { got } = require('got');

module.exports = {
  name: 'randomstream',
  ping: true,
  description: 'This command will link a random stream from Twitch.',
  permission: 100,
  category: 'Random command',
  execute: async (channel, user, input, perm) => {
    try {
      if (module.exports.permission > perm) {
        return;
      }

      const response = await got('https://api.twitch.tv/kraken/streams', { json: true });
      const streams = response.body.streams;
      if(streams.length === 0) return "FeelsDankMan Sorry, there are no live streams at this moment";
      const randomStream = streams[Math.floor(Math.random() * streams.length)];
      return `Check out this random stream: https://www.twitch.tv/${randomStream.channel.name}`;
    } catch (err) {
      console.log(err);
      return 'FeelsDankMan Error';
    }
  }
};
/*Surely this works, right?*/