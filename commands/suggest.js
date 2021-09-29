const tools = require("../tools/tools.js");

module.exports = {
    name: "suggest",
    ping: true,
    description: 'This command will add a suggestion to my database, so I can read them and maybe add them. Example: "bb suggest Please add this command :) "',
    permission: 100,
    category: "Bot command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            input = input.splice(2);

            const msg = input.toString().replaceAll(',', ' ');

            await tools.query('INSERT INTO Suggestions (User, Suggestion) values (?, ?)', [user.username, msg]);
            
            const IDs = await tools.query(`SELECT MAX(ID) FROM Suggestions WHERE User=?`, [user.username]);
            console.log(IDs[0]['MAX(ID)']);
            
            return `Your suggestion was saved as 'ID ${IDs[0]['MAX(ID)']}' nymnDank 👍 `;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}