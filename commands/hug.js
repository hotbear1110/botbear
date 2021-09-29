module.exports = {
    name: "hug",
    ping: false,
    description: 'This command will hug a given user. Example: "bb hug NymN"',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            if (input[2]) {
                return `${input[2]} dankHug`;
            }
            return `${user.username} dankHug`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}