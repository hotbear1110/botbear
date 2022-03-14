const got = require('got');

module.exports = {
    name: "pray",
    ping: true,
    description: 'This command will give a random bible quote',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }

            const url = 'https://labs.bible.org/api/?passage=random&type=json';
            
            const response = await got.get(url).json();
            return `[${response.bookname} ${response.chapter}:${response.verse}]: ${response.text} Prayge`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan lost my bible`;
        }
    }
}
