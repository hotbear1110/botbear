module.exports = {
    name: "github",
    ping: true,
    description: "Responds with a link to my github",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return `https://github.com/hotbear1110/botbear`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}