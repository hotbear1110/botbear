const got = require("got");

module.exports = {
    name: "cat",
    ping: true,
    description: 'This command will give you a link to a picture of a random cat',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const image = await got(`https://dog.ceo/api/breeds/image/random`, { timeout: 10000 }).json();

            return `nymnAww ${image[0].url}`;

        } catch (err) {
            console.log(err);
            if (err.name) {
                if (err.name === "TimeoutError") {
                    return `FeelsDankMan api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error`;
        }
    }
}