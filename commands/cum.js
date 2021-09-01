module.exports = {
    name: "cum",
    ping: false,
    execute: async (channel, user, input, perm) => {
        try {
            return `I came`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}