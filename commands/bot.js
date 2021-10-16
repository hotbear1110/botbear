module.exports = {
    name: "bot",
    ping: true,
    description: 'This command will give a short explanation of the bot',
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return `nymnDank botbear1110 is a bot that can notify you in chat when a streamer goes live/changes title/changes game, by pinging you in chat. You can even set specific games that should ping you. The bot also has some other chat improving commands, that gives the chatters useful/fun information about the chat, other users and the stream :) The bot is writen in node.js and is made by: Hotbear1110. Link to my GitHub: https://github.com/hotbear1110/botbear`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}