const tools = require("../tools/tools.js");


module.exports = {
    name: "emotes",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            const streamer = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
            let emotes = JSON.parse(streamer[0].Emote_list);

            emotes = [emotes.slice(-6).reverse()];
            emotes = emotes.toString().replaceAll(',', ' ');

            emotes = emotes.split(' ');
            const now = new Date().getTime();

            emotes[1] = `(${tools.humanizeDuration(now - emotes[1])})`;
            emotes[3] = `(${tools.humanizeDuration(now - emotes[3])})`;
            emotes[5] = `(${tools.humanizeDuration(now - emotes[5])})`;
            emotes[7] = `(${tools.humanizeDuration(now - emotes[7])})`;
            emotes[9] = `(${tools.humanizeDuration(now - emotes[9])})`;
            emotes[11] = `(${tools.humanizeDuration(now - emotes[11])})`;

            emotes = emotes.toString().replaceAll(',', ' ');

            return `the latest added emotes are: ${emotes}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}