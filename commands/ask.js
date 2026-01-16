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

			const demo2 = input.includes('demo2:true');

			let bannedPhrases = /\brac(?:ist[sm]?|e)\b/gi;

			const stringmessage = input.join(' ');

			if (stringmessage.match(bannedPhrases)) {
				return 'Because chat is a bunch of 12 year olds, I am unable to answer that prompt WeirdChamp ';
			}

			input = input.splice(2);
			let msg = input.join(' ');

			let params;

			let url = 'https://api.mistral.ai/v1/chat/completions';

			if (demo) {
				msg = msg.replaceAll('demo:true', '');

				this.ping = false;

				const stream = (await sql.Query('SELECT game, title, islive FROM Streamers WHERE username=?', [channel]))[0];

				params = {
					'model': 'pixtral-large-latest',
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
							'role': 'system',
							'content': `The current date and time in central europe is: ${(new Date()).toLocaleString('en-US', { timeZone: 'Europe/Berlin' })}`
						},
						{
							'role': 'system',
							'content': (channel === 'nymn') ? `
							nymn is currently ${(!stream.islive) ? 'not ' : ''} live.
							nymn's title is: "${stream.title}"
							nymn's category is: "${stream.game}"
							`
								:
								``
						},
						{
							'role': 'system',
							'content': (channel === 'nymn') ? `some notible users in the chatroom are: 
							Yabbe - A moderator who is nymns girlfriend, she is very very good at math.
							Fawcan - A moderator that does a lot of work, likes the streamer Moonmoon and is an ex-coomer (really into koreans).
							Gempir - A moderator that likes Taylor Swift a lot and he calls out nymn on his bullshit, a fun fact about gempir: he has spend $1000's on mechanical keyboards, he has like 100 keyboards.
							Cheezeburgerstick - A moderator from Australia that doesn't do anything but bully nymn.
							Mr0lle (olle) - A moderator who likes to use weeb emotes, but isn't actually a weeb, he is just a femboy.
							Xanabilek - A moderator who does a lot of stream overlay stuff to improve the stream quality, he is Fr*nch tho.
							0ut3 - A moderator who is kinda cosmetic, he is from israel and a war veteran.
							ayyybubu - A moderator from Poland, he is an admin over at 7tv.
							agenttud - A moderator from Romania, he love breaking bad and better call saul, he also likes trackmania.
							Kronvall - A very rare moderator, one might say the rarest mod, he is also nymns friend and a very nice guy. 
							Tolatos - A chatter that likes Poros from league of legends way too much,  he has still not paid his child support.
							Joshlad - A VIP who is also a weeb.
							FabulousPotato69 (fabby) - A VIP, but secretly just a mod with a wrong badge, he works for nymn.
							JerryTheDoctor - "not actually a doctor".
							JanZ11 - A VIP that is very nice and wholesome, he likes to spam dance emotes to good music.
							h_h410 - Maybe a bot, prob not, no one knows for sure.
							Backous - A VIP, he is kinda weird but a good guy, he is american tho and always drunk.
							Sotiris_Ael (sotiris) - A VIP, he is maybe kinda racist, but only jokingly he says. (All vips are racists)
							Djoka - the only one with the Dj*ka pass. (Sotiris thinks he also has the pass ofc)
							Nammerino - Turkish
							Supibot - An amazing twitch bot that has giga many features.
							botnextdoor - Moderation bot that bans a lot of people.
							chetbotwow - A trivia bot made by chetwow.
							Froglin_ (froglin) - Has the biggest poglin you have ever seen.
							karl_mn (karim) - Greenlandic chatter, literally lives in an igloo.
							Smuuuuuuuuurf (smurf) - Brazilian chatter, works in it, but hates his job, does movienight streams sometimes.
							Lucas__Kn - A chatter from norway, he is really in to music, he is gonna be the next miles davis.
							HamNoMC - A kurdish chatter that sucks at overwatch 2.
							Dany411 - A chatter in love with 2b from nier.
							Roppie - A VIP from holland. He like getting drunk and watching footie.
							JozefBrzeczyszczykiewicz (Jozef) - A VIP from poland, he is VERY VERY Polish.
							QuisL - Bald.
							DaGaugl - A VIP that loves progressive rock a bit too much, its basically his whole personallity.
							Mahark_ - A chatter who is maybe turkish, maybe dutch, he is currently banned from twitch, his alt is mohork_.
							ImDaxify - A VIP, he is indeed Daxify, he is from norway.
							`
								:
								``
						},
						{
							'role': 'system',
							'content': `You are chatting with a twitch user in a chat from a streamer called ${channel}, the chatters username is ${user.username}`
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
			} else if (demo2) {
				params = {
							"agent_id": "ag_019bc8824029723b85ab43c400ed6d6e",
							"inputs": [
								{
									"role": "user",
									"content": msg
								}
							]
						};
				url = 'https://api.mistral.ai/v1/conversations';

			} else {
				params = {
					'model': 'pixtral-large-latest',
					"max_tokens": 100,
					'messages': [
						{
							'role': 'system',
							'content': `short answer with no more than 300 characters, symbols and spaces in total`
						},
						{
							'role': 'system',
							'content': `use plain text with no formatting or newlines`
						},
						{
							'role': 'user',
							'content': msg
						}
					]
				};
			}

			const headers = {
				'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
			};

			try {
				const response = await got.post(url, { json: params, headers: headers, timeout: { request: 60000 } }).json();
				let response_content = '';

				if (demo2) {
					for (const output of response.outputs) {
						if (output.type === 'message.output') {
							if (output.content instanceof String) {
								response_content += output.content;
							} else {
								for (const message of output.content) {
									if (message.type === 'text') {
										response_content += message.text;
									}
								}
							}
						}
					}
				} else {
					response_content = response.choices[0].message.content;
				}


				const output = `${msg}${response_content}`
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
