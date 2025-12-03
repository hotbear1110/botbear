const { got } = require("./../got");

module.exports = {
  name: "recap",
  ping: true,
  description:
    'This command will give you a random logged line from either yourself or a specified user in the chat (Only works if logs are available in the channel, logs used: "https://logs.ivr.fi/"). Example: "bb rl NymN"',
  permission: 100,
  category: "Info command",
  execute: async (channel, user, input, perm) => {
    try {
      if (module.exports.permission > perm) {
        return;
      }
      let realuser = user.username;
      if (input[2]) {
        if (input[2].startsWith("@")) {
          input[2] = input[2].substring(1);
        }
        realuser = input[2];
      }

      let realchannel = channel;
      if (input[3]) {
        realchannel = input[3];
      }

      let logs = await got(
        `https://logs.ivr.fi/channel/${realchannel}/user/${realuser}?from=2024-12-03T14%3A27%3A27.000Z&to=2025-12-03T14%3A27%3A27.000Z&json=true`,
      ).json();

      return (
        `Total messages from @${realuser} sent this year in #${realchannel}: ` +
        logs.messages.length
      );
    } catch (err) {
      console.log(err);
      if (
        err.toString().startsWith("HTTPError: Response code 403 (Forbidden)")
      ) {
        return "User or channel has opted out";
      }
      if (
        err
          .toString()
          .startsWith("HTTPError: Response code 500 (Internal Server Error)")
      ) {
        return "Could not load logs. Most likely the user either doesn't exist or doesn't have any logs here.";
      }
      if (err.name) {
        if (err.name === "HTTPError") {
          return "That user does not exist";
        }
        return `FeelsDankMan api error: ${err.name}`;
      }
      return "FeelsDankMan Error";
    }
  },
};
