require('dotenv').config();
const { got } = require('./../got');


module.exports = {
	name: 'dalle',
	ping: true,
	description: 'Make any image you can think of using the power of dalle2 ai! - The cooldown on this is 2 min.',
	permission: 100,
	cooldown: 120,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			const {FormData, Blob} = (await import('formdata-node'));

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
				'size': '1024x1024',
				'user': user.username
			};
			const headers = {
				'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type' : 'application/json'
			};

			


			try {
				
				const response = await got.post(url, { json: params, headers: headers }).json();

				const dalleImageToBlob = async (url) =>
				new Blob([await got(url).buffer()], { type: 'image/png' });

				const imgurl = response.data[0].url;
				const img = await dalleImageToBlob(imgurl);
    
				const formData = new FormData();
				formData.append('file', img, 'file.png');
				

                const imageURL =  await got.post('http://localhost:9005', {
					headers: {
						'Authorization': process.env.hotbearIMG,
					},
					body: formData,
					throwHttpErrors: false
				});

				console.log(imageURL);
				return `"${msg}": ${imageURL.body}`;
			} catch (err) {
				console.log(err);
				if (err.response.statusCode === 429) {
					return 'Nime I\'m currently rate limited';
				}
			}
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
