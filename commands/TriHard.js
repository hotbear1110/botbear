module.exports = {
    name: "TriHard",
    ping: true,
    description: 'Says TriHard',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            return "TriHard";
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}