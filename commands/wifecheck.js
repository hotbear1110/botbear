module.exports = {
    name: "wifecheck",
    ping: true,
    description: "Responds with doctorWTF",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            return "doctorWTF";
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}