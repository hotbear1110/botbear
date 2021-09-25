module.exports = {
    name: "cock",
    ping: true,
    description: "Responds 'Okayge cock!'",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return `Okayge cock!`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}