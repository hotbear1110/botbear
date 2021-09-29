const got = require("got");

module.exports = {
    name: "color",
    ping: true,
    description: 'This command will give you the color name and hex of a given users username color. Example: "bb color NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                username = input[2];
            }

            const userColor = await got(`https://api.ivr.fi/twitch/resolve/${username}`, {timeout: 10000}).json();
            console.log(userColor)

            const colorName = await got(`https://www.thecolorapi.com/id?hex=${userColor.chatColor.replace('#', '')}`, {timeout: 10000}).json();

            return `That user has the color: ${colorName.name.value} ${userColor.chatColor}`;
        } catch (err) {
            console.log(err);
            return `Error FeelsBadMan `;
        }
    }
}