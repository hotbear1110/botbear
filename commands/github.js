module.exports = {
    name: "github",
    ping: true,
    description: "This command will give you a link to my github",
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return `https://github.com/hotbear1110/botbear`;
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}