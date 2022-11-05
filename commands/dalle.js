require('dotenv').config();
const { got } = require('./../got');
let messageHandler = require('../tools/messageHandler.js').messageHandler;
const sql = require('./../sql/index.js');

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
			if (channel !== 'nymn' && channel !== 'hotbear1110' && channel !== 'pajlada' && channel !== 'brian6932' && !(perm >= 1500)) {
				return 'This command is currently disabled :)';
			}

			if (!input[2]) {
				return 'FeelsDankMan No input text';
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

				await new messageHandler(channel, user.username + ' ppCircle generating dalle2 image...', true).newMessage();

				
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

				await sql.Query(`INSERT INTO Dalle 
        			(User, Channel, Prompt, Image) 
            			values 
        			(?, ?, ?, ?)`,
				[user.username, channel, msg, imageURL.body]
				);

				return `"${msg}": ${imageURL.body}`;
			} catch (err) {
				console.log(err);
				if (err.response.statusCode === 429) {
					return 'nymnIme I\'m currently rate limited. Try again in 5 min';
				}
				if (err.response.statusCode === 400) {
					return 'nymnIme Bad request..... Maybe read up on the rules: https://labs.openai.com/policies/content-policy';
				}
			}
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
