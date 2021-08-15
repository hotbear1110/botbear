const tools = require("../tools/tools.js");

module.exports = {
    name: "suggest",
    ping: true,
    execute: async (channel, user, input) => {
        try {
            input = input.splice(2)

            let msg = input.toString().replaceAll(',', ' ')
            await tools.query('INSERT INTO Suggestions (User, Suggestion) values (?, ?)', [user.username, msg]);
            const IDs = await tools.query(`SELECT ID FROM Suggestions WHERE ID = LAST_INSERT_ID()`)
            return `Your suggestion was saved as 'ID ${IDs[0].ID}' nymnDank 👍 `
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}