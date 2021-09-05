const got = require("got");

module.exports = {
    name: "shibu",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            const image = await got(`https://api.thecatapi.com/v1/images/search`).json();
            console.log(image)

            return `nymnAww ${image[0].url}`;

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}