const tools = require("../tools/tools.js");

module.exports = {
    name: "bruh",
    ping: false,
    description: 'This command will check if the person passes the BRUH test(50/50)',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let username = user.username;

            if (input[2]) {
                username = input[2];
                if (tools.isMod(user, channel) === false && perm < 2000 && username.match(/[&|$|/|.|?|!|-]|\bkb\b|^\bmelon\b/g)) { // ignores &, $, kb, /, ., ?, !, - bot prefixes (. and / are twitch reserved prefixes)  
                    username = username.charAt(0) + "\u{E0000}" + username.substring(1);
                }
            }

            let responses = ["did not pass the BRUH test... nymnBRUH TeaTime", "passed the BRUH test, RlyTho  👍"]

            let number = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

            return `/me ${username} ${responses[number]}`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}
