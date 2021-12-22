module.exports = {
    name: "hint",
    ping: true,
    description: 'This command will give you a hint for the trivia. (If there is an active trivia)',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}