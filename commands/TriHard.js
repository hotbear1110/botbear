module.exports = {
    name: "TriHard",
    ping: true,
    description: 'Returns \'TriHard\'',
    permission: 100,
    category: "Random Command",
    execute: async (channel, user, input, perm) => {
        try {
            return "TriHard";
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}