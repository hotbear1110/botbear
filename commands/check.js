const tools = require("../tools/tools.js");

module.exports = {
    name: "check",
    ping: true,
    description: "Check for information about other users",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            switch (input[2]) {
                case "permission":
                    let username = user.username;
                    if (input[3]) {
                        if (input[3].startsWith("@")) {
                            input[3] = input[3].substring(1);
                        }
                        username = input[3];
                    }
                    const User = await tools.query(`SELECT permission FROM Users WHERE username=?`, [username]);

                    console.log(User)
                    return `${username}'s permission is: ${User[0].permission}`;

                default: `Stuff available to check: permission`;
            }
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}