module.exports = {
    name: "coinflip",
    ping: false,
    description: 'This command will do a 50/50 coinflip',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let username = user.username;

            if (input[2]) {
                username = input[2];
            }

            let responses = ["HEADS", "TAILS"]

            let number = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

            return `/me ${username} ${responses[number]}`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}
