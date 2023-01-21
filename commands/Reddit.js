const { got } = require('./../got');
/* lists top 3 posts from NymN reddit */
module.exports = {
  name: 'Reddit',
  ping: true,
  description: 'This command will list the top 3 posts on the Forsen subreddit.',
  permission: 100,
  category: 'Random command',
  execute: async (channel, user, input, perm) => {
    try {
      if (module.exports.permission > perm) {
        return;
      }

      const response = await got('https://www.reddit.com/r/RedditAndChill/.json', { json: true });
      const posts = response.body.data.children;

      let top3 = [];
      for (let i = 0; i < 3; i++) {
        top3.push(`${i+1}. ${posts[i].data.title} - by ${posts[i].data.author}`);
      }

      return top3.join('\n');
    } catch (err) {
      console.log(err);
      return 'FeelsDankMan Error';
    }
  }
};