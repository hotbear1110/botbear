module.exports = {
    name: "commands",
    execute: async (channel, user, input) => {
        try {
            return `List of commands: https://botbear.github.io/`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}