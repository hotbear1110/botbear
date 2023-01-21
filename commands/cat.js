const https = require('https');

module.exports = {
    name: 'cat',
    ping: true,
    description: 'This command will give you a link to a picture of a random cat',
    permission: 100,
    category: 'Random command',
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            https.get('https://api.thecatapi.com/v1/images/search', (res) => {
                if (res.statusCode !== 200) {
                    return 'Error: Failed to fetch cat image';
                }
                res.on('data', (d) => {
                    const image = JSON.parse(d);
                    const { url } = image[0];
                    return `Here's a random cat image: ${url}`;
                });
            }).on('error', (err) => {
                console.log(err);
                return 'Error: Failed to fetch cat image';
            });
        } catch (err) {
            console.log(err);
            return 'Error: Failed to fetch cat image';
        }
    }
};