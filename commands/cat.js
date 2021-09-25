const got = require("got");

module.exports = {
    name: "cat",
    ping: true,
    description: "Responds with a random picture of a cat",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const image = await got(`https://api.thecatapi.com/v1/images/search`, {timeout: 10000}).json();
            console.log(image)

            return `nymnAww ${image[0].url}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}