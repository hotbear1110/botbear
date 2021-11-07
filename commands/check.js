const tools = require("../tools/tools.js");

module.exports = {
    name: "check",
    ping: true,
    description: 'This command will check info about other users. Available check commands: "bb check permission NymN"(gives you the permission lvl)',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let username = user.username;
            switch (input[2]) {
                case "permission":
                    if (input[3]) {
                        if (input[3].startsWith("@")) {
                            input[3] = input[3].substring(1);
                        }
                        username = input[3];
                    }
                    const User_permission = await tools.query(`SELECT permission FROM Users WHERE username=?`, [username]);

                    return `${username}'s permission is: ${User_permission[0].permission}`;
                    break;

                case "points":
                    if (input[3]) {
                        if (input[3].startsWith("@")) {
                            input[3] = input[3].substring(1);
                        }
                        username = input[3];
                    }
                    const User_trivia = await tools.query(`SELECT trivia_score FROM Users WHERE username=?`, [username]);

                    return `${username} has ${User_trivia[0].trivia_score} trivia points`;

                default: 
                    return `Stuff available to check: permission, points`;
            }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;        
        }
    }
}