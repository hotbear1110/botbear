module.exports = {
    name: "hug",
    ping: false,
    execute: async (channel, user, input, perm) => {
        try {
            if (input[2]) {
                return `${input[2]} dankHug`
            }
            return `${user.username} dankHug`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}