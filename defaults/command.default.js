module.exports = {
    name: "NAME",
    ping: true,
    description: 'DESCRIPTION',
    permission: 100,
    category: "CATEGORY [ ./command.category.default.js ]",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return "THIS";
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}