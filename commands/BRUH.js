module.exports = {
    name: "BRUH",
    ping: false,
    description: 'This command will check if the person passes the BRUH test(50/50)',
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

            let responses = ["did not pass the BRUH test... Bruhge TeaTime", "passed the BRUH test, BRUH 👍"]

            let number = Math.floor(Math.random() * (1 - 0 + 1)) + 0;

            return `/me ${username} ${responses[number]}`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}
