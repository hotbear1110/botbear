module.exports = {
    name: "cum",
    ping: false,
    description: "Responds 'I came'",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            return `I came`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}