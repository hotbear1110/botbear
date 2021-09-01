module.exports = {
    name: "commands",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            return `List of commands: https://botbear.github.io/`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}