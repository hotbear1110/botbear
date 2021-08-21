const tools = require("../tools/tools.js");

module.exports = {
    name: "permission",
    ping: false,
    execute: async (channel, user, input) => {
        try {
            let userPermission = await tools.query(`SELECT * FROM Users WHERE username=?`, [user.username])
            userPermission = JSON.parse(userPermission[0].permission)

            if (userPermission < 2000) {
                return;
            }

            await tools.query(`UPDATE Users SET permission=? WHERE username=?`, [input[3], input[2]])
            return `${input[2]} now has permission ${input[3]}`

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}