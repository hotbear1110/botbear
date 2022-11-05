require('dotenv').config();
const { got } = require('./../got');
const FormData = require('form-data');

module.exports = {
	name: 'dalle',
	ping: true,
	description: 'Make any image you can think of using the power of dalle2 ai! - The cooldown on this is 2 min.',
	permission: 100,
	cooldown: 120,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			if (channel !== 'nymn' && channel !== 'hottestbear' && channel !== 'elina' && channel !== 'pajlada' && !(perm >= 1500)) {
				return 'This command is currently disabled :)';
			}

            input = input.splice(2);
			let msg = input.join(' ');

			const url = 'https://api.openai.com/v1/images/generations';
			const params = {
				'prompt': msg,
				'n': 1,
				'size': '1024x1024'
			};
			const headers = {
				'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type' : 'application/json'
			};

			try {
				const response = await got.post(url, { json: params, headers: headers }).json();

                //const dalleImageToBlob = async (url) => Buffer.from(await got(url, { responseType: 'buffer' }).then((res) => res.body));

				//const image = dalleImageToBlob(response.data[0].url);
				const image = await got(response.data[0].url);
				const formData = new FormData();
				formData.append('file', image.body);

                const imageURL =  await got.post('https://i.hotbear.org/upload', {
					headers: {
						'Authorization': process.env.hotbearIMG,
						'Content-Type': 'multipart/form-data'
					},
					body: formData
				});

				console.log(imageURL);
				console.log(response);
				return `"${msg}": ` + await response.data[0].url;
			} catch (err) {
				console.log(err);
				if (err.response.statusCode === 429) {
					return 'Nime you have used all of this months bb ask';
				}
			}
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
