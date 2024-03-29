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
      let count = 0;
      for (let i = 0; i < posts.length; i++) {
        if (!posts[i].data.stickied && count < 3) {
          top3.push(`${count+1}. ${posts[i].data.title} - https://redd.it/${posts[i].data.id} by ${posts[i].data.author}`);
          count++;
        }
      }

      return `Top 3 posts in redditandchill: ${top3.join(' | ')}`;
    } catch (err) {
      console.log(err);
      return 'FeelsDankMan Error';
    }
  }
};
