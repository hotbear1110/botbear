module.exports = {
    name: "coinflip",
    ping: true,
    description: 'This command will do a 50/50 coinflip',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }

            let responses = ["HEADS(yes)", "TAILS(no)"]

            let number = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

            return `${responses[1]}`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}
