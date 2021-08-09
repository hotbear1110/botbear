module.exports = {
    name: "bot",
    execute: async (channel, user, input) => {
        try {
            return `nymnDank botbear1110 is a scuffed bot, that works a bit like titlechange bot rn, for the future i would like the bot to be an all purpose bot. The bot is written entirely in Node.js and is made by HotBear1110 Link to my GitHub: https://github.com/hotbear1110/botbear`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}