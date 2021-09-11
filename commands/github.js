module.exports = {
    name: "github",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            return `https://github.com/hotbear1110/botbear`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}