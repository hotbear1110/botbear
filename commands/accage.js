const tools = require('../tools/tools.js');
const got = require('../got');

module.exports = {
    name: 'accage',
    ping: true,
    description: 'This command will tell you the specified users account age. Example: "bb accage NymN"',
    permission: 100,
    category: 'Info command',
    noBanphrase: true,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let username = user.username;

            if (input[2]) {
                if (input[2].startsWith('@')) {
                    input[2] = input[2].substring(1);
                }
                username = input[2];
            }

            const { body: twitchdata } = await got(`https://api.ivr.fi/v2/twitch/user?login=${username}`);

            const ms = new Date().getTime() - Date.parse(twitchdata[0].createdAt);

            return `Account is ${tools.humanizeDuration(ms)} old`;
        } catch (err) {
            console.error(err);
            if (err.name === 'TimeoutError') {
                return `FeelsDankMan api error: ${err.name}`;
            } else if (err.response && err.response.data) {
                return `FeelsDankMan Error: ${err.response.data.error}`;
            } else {
                return 'FeelsDankMan Error';
            }
        }
    }
};