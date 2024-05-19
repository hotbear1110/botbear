require('dotenv').config();
const { got } = require('./../got');
const { activetrivia, triviaanswer } = require('../bot.js');
const { URL } = require('./../tools/regex.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'ask',
	ping: true,
	description: 'Ask botbear any question and it will tell you the answer! - The cooldown on this is 2 min.',
	permission: 100,
	cooldown: 60,
	category: 'Random command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			/*
			if (![62300805, 135186096, 174141858, 11148817, 84180052, 17497365, 184066698].includes(+user[`room-id`]) && !(perm >= 1500)) {
				return 'This command is currently disabled :)';
			}*/

			const demo = input.includes('demo:true');

			let bannedPhrases = /\brac(?:ist[sm]?|e)\b/gi;

			const stringmessage = input.join(' ');

			if (stringmessage.match(bannedPhrases)) {
				return 'Because chat is a bunch of 12 year olds, I am unable to answer that prompt WeirdChamp ';
			}

			input = input.splice(2);
			let msg = input.join(',');

			let params;

			let url = 'https://api.openai.com/v1/chat/completions';

			let headers = {
				'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
			};

			if (demo && channel === 'nymn') {
				msg = msg.replaceAll('demo:true', '');

				this.ping = false;

				url = 'https://api.openai.com/v1/threads/thread_I6vs7tJS9sLPAYe6PyQx6Dt4/messages';

				headers = {
					'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
					'OpenAI-Beta': 'assistants=v2'
				};
				params = {
					"role": "user",
					"content": `${user.username}: ${msg}`
				};
			} else if (demo) {
				msg = msg.replaceAll('demo:true', '');

				this.ping = false;

				params = {
					'model': 'gpt-4o',
					"max_tokens": 100,
					'messages': [
						{
							'role': 'system',
							'content': `you were created by hotbear1110, you are made in node.js and is a general purpose bot with a bunch of fun commands`
						},
						{
							'role': 'system',
							'content': `you are in a twitch chat from the streamer ${channel}. ${channel}'s chat likes to joke around, be silly, be sarcastic and talk about another streamer called forsen, the chat dislikes weebs a lot. All mods are unpaid`
						},
						{
							'role': 'user',
							'content': `I am a user in the twitch chat from a streamer called ${channel}, my username is ${user.username}`
						},
						{
							'role': 'system',
							'content': 'Your username is botbear1110, respond like you are chatting in the chat with me, just respond with the message, not your own username'
						},
						{
							'role': 'user',
							'content': msg
						}
					]
				};
			} else {
				params = {
					'model': 'gpt-4o',
					"max_tokens": 100,
					'messages': [
						{
							'role': 'user',
							'content': msg
						}
					]
				};
			}

			try {
				const response = await got.post(url, { json: params, headers: headers }).json();
				let output
				if (demo && channel === 'nymn') {
					await got.post('https://api.openai.com/v1/threads/thread_I6vs7tJS9sLPAYe6PyQx6Dt4/runs',
						{
							json: {
								"assistant_id": "asst_H64aptwJkofPvJGsfYDahko4",
							}, headers: headers
						}).json();

					const runs = await got.get('https://api.openai.com/v1/threads/thread_I6vs7tJS9sLPAYe6PyQx6Dt4/runs',
						{
							json: {
								"order": "desc",
							}, headers: headers
						}).json();

					output = `${msg}${response.content[0].text.value}`
						.substring(msg.length)
						.replace(URL, '$1[DOMAIN]$3$4$5');

					console.log(runs)
				} else {
					output = `${msg}${response.choices[0].message.content}`
						.substring(msg.length)
						.replace(URL, '$1[DOMAIN]$3$4$5');
				}

				if (activetrivia[`${channel}`]) {
					let triviaRegex = new RegExp(triviaanswer[`${channel}`], 'gi');

					if (triviaRegex.exec(output)) {
						return 'forsenCD this reply contains the answer to the current trivia';
					}
				}
				console.log(output);

				await sql.Query(`INSERT INTO Ask
        			(User, Channel, Prompt, Response)
            			values
        			(?, ?, ?, ?)`,
					[user.username, channel, msg, output]
				);

				return output;
			} catch (err) {
				console.log(err);
				if (err.response.statusCode === 429) {
					return 'nymnIme you have used all of this months bb ask';
				}
			}

		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
