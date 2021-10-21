const axios = require('axios');

module.exports = {
    name: "followcount",
    ping: true,
    description: 'This command will give you the amount of followers a specified channel has. Example: "bb followcount NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let realchannel = channel;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                realchannel = input[2];
            }

            const followcount = await axios.get(`https://decapi.me/twitch/followcount/${realchannel}`, {timeout: 10000});

            if (followcount.data === 0) {
                return `Could not find the channel ${realchannel}`;
            }

            return `#${realchannel} has ${followcount.data} followers!`;

        } catch (err) {
            console.log(err);
            if (err.name) {
                if (err.name === "TimeoutError") {
                    return `FeelsDankMan Banphrase api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error`;
        }
    }
}