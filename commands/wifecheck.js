module.exports = {
    name: "wifecheck",
    ping: true,
    description: 'This command will make the bot respond with "doctorWTF"',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return "doctorWTF";
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}