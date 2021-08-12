const tools = require("../tools/tools.js");

module.exports = {
    name: "suggest",
    execute: async (channel, user, input) => {
        try {
            const IDs = await tools.query(`SELECT * FROM Suggestions`)
            let newID = IDs[IDs.length - 1].ID + 1;
            input = input.splice(2)

            let msg = input.toString().replaceAll(',', ' ')
            await tools.query('INSERT INTO Suggestions (ID, User, Suggestion) values (?, ?, ?)', [newID, user.username, msg]);
            return `Your suggestion was saved as 'ID ${newID}' nymnDank 👍 `
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}