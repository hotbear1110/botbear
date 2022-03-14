const got = require('got');

module.exports = {
    name: "quran",
    ping: true,
    description: 'This command will give a random quran quote',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let number = Math.floor(Math.random() * (6237 - 0 + 6237)) + 0;

            const url = `https://api.alquran.cloud/ayah/${number}/en.asad`;

            const response = await got(url).json();
            console.log(response)
            return `[${response.data.surah.englishName}(${response.data.surah.englishNameTranslation}) ${response.data.surah.number}:${response.data.numberInSurah}]: ${response.data.text} Prayge`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan lost my bible`;
        }
    }
}
