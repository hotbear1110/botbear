const { got } = require('./../got');
/* lists top 3 posts from NymN reddit */
module.exports = {
  name: 'reddit',
  ping: true,
  description: 'This command will list the top 3 posts on the NymN subreddit.',
  permission: 100,
  category: 'Random command',
  execute: async (channel, user, input, perm) => {
    try {
      if (module.exports.permission > perm) {
        return;
      }

      const response = await got('https://www.reddit.com/r/RedditAndChill/.json').json();
      const posts = response.data.children;

      let top3 = [];
      for (let i = 0; i < 3; i++) {
        top3.push(`${i+1}. [${posts[i].data.title}](https://www.reddit.com${posts[i].data.permalink}) - by ${posts[i].data.author}`);
      }

      return `Top 3 posts in redditandchill: ${top3.join(' | ')}`;
    } catch (err) {
      console.log(err);
      return 'FeelsDankMan Error';
    }
  }
};
