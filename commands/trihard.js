module.exports = {
    name: "trihard",
    ping: true,
    description: 'Says TriHard',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            return "TriEasy";
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}