const got = require("got");

module.exports = {
    name: "shibu",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            const image = await got(`http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`).json();

            return `nymnAww ${image}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}