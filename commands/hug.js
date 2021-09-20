module.exports = {
    name: "hug",
    ping: false,
    description: "Bot hugs the user",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (input[2]) {
                return `${input[2]} dankHug`;
            }
            return `${user.username} dankHug`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}