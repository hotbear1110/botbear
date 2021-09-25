const got = require("got");

module.exports = {
    name: "shiba",
    ping: true,
    description: "Responds with a random picture of a shiba inu",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const image = await got(`http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`, {timeout: 10000}).json();

            return `nymnAww ${image}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}