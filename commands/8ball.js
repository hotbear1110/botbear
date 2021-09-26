module.exports = {
    name: "8ball",
    ping: true,
    description: "",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }

            
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}