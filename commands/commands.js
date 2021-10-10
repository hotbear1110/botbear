module.exports = {
    name: "commands",
    ping: true,
    description: 'This command will give you a link to the bot´s commands',
    permission: 100,
    category: "Bot command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return `List of commands: http://hotbear.xyz:5000/`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}