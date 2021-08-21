const tools = require("../tools/tools.js");

module.exports = {
    name: "suggest",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            input = input.splice(2)

            const msg = input.toString().replaceAll(',', ' ');

            await tools.query('INSERT INTO Suggestions (User, Suggestion) values (?, ?)', [user.username, msg]);
            
            const IDs = await tools.query(`SELECT MAX(ID) FROM Suggestions WHERE User=?`, [user.username])
            console.log(IDs[0]['MAX(ID)'])
            
            return `Your suggestion was saved as 'ID ${IDs[0]['MAX(ID)']}' nymnDank 👍 `
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}