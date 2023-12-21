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
	cooldown: 120,
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

			if (demo) {
				msg = msg.replaceAll('demo:true', '');

				this.ping = false;

				params = {
					'model': 'gpt-4-1106-preview',
					"max_tokens": 100,
					'messages': [
						{
							'role': 'system',
							'content': `you are in a twitch chat from the streamer ${channel}. ${channel}'s chat likes to joke around, be sarcastic and talk about another streamer called forsen, the chat dislikes weebs a lot`
						},
						{
							'role': 'user',
							'content': `I am a user in the twitch chat from a streamer called ${channel}, my username is ${user.username}`
						},
						 {
							'role': 'system',
							'content': 'respond like you are chatting in the chat with me'
						},
						{
							'role': 'user',
							'content': msg
						}
					]
				};
			} else {
				params = {
					'model': 'gpt-3.5-turbo',
					"max_tokens": 100,
					'messages': [
						{
							'role': 'user',
							'content': msg
						}
					]
				};
			}

			const url = 'https://api.openai.com/v1/chat/completions';

			const headers = {
				'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
			};

			try {
				const response = await got.post(url, { json: params, headers: headers }).json();
				const output = `${msg}${response.choices[0].message.content}`
					.substring(msg.length)
					.replace(URL, '$1[DOMAIN]$3$4$5');


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
