module.exports = {
    name: "commands",
    ping: true,
    description: 'This command will give you a link to the bot´s commands',
    permission: 100,
    category: "Core command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return `List of commands: https://hotbear.xyz:2053/`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}