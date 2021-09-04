const got = require("got");

module.exports = {
    name: "uid",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                username = input[2];
            }

            const userColor = await got(`https://api.ivr.fi/twitch/resolve/${username}`).json();
            console.log(userColor)

            const colorName = await got(`https://www.thecolorapi.com/id?hex=${userColor.chatColor.replace('#', '')}`).json();

            return `That user has the color: ${colorName.name.value} ${userColor.chatColor}`;
        } catch (err) {
            console.log(err);
            return `Error FeelsBadMan `;
        }
    }
}