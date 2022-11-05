require('dotenv').config();
const { got } = require('./../got');
const { activetrivia, triviaanswer } = require('../bot.js');
const { URL } = require('./../tools/regex.js');

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
			if (channel !== 'nymn' && channel !== 'hotbear1110' && channel !== 'elina' && channel !== 'pajlada' && !(perm >= 1500)) {
				return 'This command is currently disabled :)';
			}

			let bannedPhrases = /(\W|^)(racists|racist|racism|race)(\W|$)/gi;

			const stringmessage = input.join(' ');

			if (stringmessage.match(bannedPhrases)) {
				return 'Because chat is a bunch of 12 year olds, I am unable to answer that prompt WeirdChamp ';
			}

			input = input.splice(2);
			let msg = input.toString().replaceAll(',', ' ');
			const prompt = `Q: ${msg}\nA:`;

			const url = 'https://api.openai.com/v1/engines/text-davinci-002/completions';
			const params = {
				'prompt': prompt,
				'max_tokens': 160,
				'temperature': 0,
				'frequency_penalty': 0.0,
				'top_p': 1,
				'presence_penalty': 0.0
			};
			const headers = {
				'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
			};

			try {
				const response = await got.post(url, { json: params, headers: headers }).json();
				const output = `${prompt}${response.choices[0].text}`
                                    .substring(prompt.length)
                                    .replace(URL, '$1[DOMAIN]$3$4$5');


				if (activetrivia[`${channel}`]) {
					let triviaRegex = new RegExp(triviaanswer[`${channel}`], 'gi');

					if (triviaRegex.exec(output)) {
						return 'forsenCD this reply contains the answer to the current trivia';
					}
				}
				console.log(output);
				return output;
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
