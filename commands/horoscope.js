require('dotenv').config();
const got = require('got');

module.exports = {
	name: 'horoscope',
	ping: true,
	description: 'This command will tell the horoscope',
	permission: 100,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
			if (!input[2] || !signs.includes(input[2].toLowerCase())) {
				return `usage: bb horoscope [${signs.toString().replaceAll(',', ', ')}]`;
			}

			const url = `https://sameer-kumar-aztro-v1.p.rapidapi.com/?sign=${input[2]}&day=today`;
			const params = {
				'sign': input[2],
				'day': 'today'
			};
			const headers = {
				'x-rapidapi-host': 'sameer-kumar-aztro-v1.p.rapidapi.com',
				'x-rapidapi-key': `${process.env.AZTRO_API_KEY}`
			};

			const response = await got.post(url, { json: params, headers: headers }).json();
			console.log(response);
			return response.description;

		} catch (err) {
			console.log(err);
			return 'FeelsDankMan you spelled something wrong';
		}
	}
};
