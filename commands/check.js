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
                    if (input[4]) {
                        if (input[4].startsWith("@")) {
                            input[4] = input[4].substring(1);
                        }
                        channel = input[4];
                    }

                    let userchannel = [];
                    userchannel.push(`"${username}"`);
                    userchannel.push(`"#${channel}"`);
                    const User_trivia = await tools.query(`SELECT points FROM MyPoints WHERE username=?`, [`[${userchannel}]`]);

                    if (!User_trivia.length) {
                        return "That user has no points yet :)"
                    }

                    return `${username} has ${User_trivia[0].points} trivia points in #${channel}`;

                default: 
                    return `Stuff available to check: permission, points`;
            }
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Sql error: ${err.sqlMessage}`;        
        }
    }
}