module.exports = {
    name: "cum",
    ping: false,
    description: "Responds 'I came'",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (this.permission > perm) {
                return;
            }

            let msg = input.tostring();
            msg = msg.replaceAll("me", "you")
            msg = msg.replaceAll("my", "your")

            return `I came ${msg}`;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}