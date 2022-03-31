module.exports = {
    name: "borpa",
    ping: true,
    description: 'This command will respond with "borpaSpin"',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return "borpaHalt";

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}