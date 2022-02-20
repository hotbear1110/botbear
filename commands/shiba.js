const got = require("got");

module.exports = {
    name: "shiba",
    ping: true,
    description: 'This command will give you a link to a picture of a random shiba inu',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const image = await got(`http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`, { timeout: 10000 }).json();

            return `nymnAww ${image}`;

        } catch (err) {
            console.log(err);
            if (err.name === "TimeoutError") {
                return `FeelsDankMan api error: ${err.name}`;
            }
            return `FeelsDankMan Error`;
        }
    }
}