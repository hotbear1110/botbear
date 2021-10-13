module.exports = {
    name: "borpa",
    ping: true,
    description: 'This command will responde with "borpaSpin"',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return "borpaSpin";

            } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}