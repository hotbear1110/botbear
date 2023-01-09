const { got } = require('./../../got');
const tools = require('./../../tools/tools.js');
require('dotenv').config();

module.exports = {
	name: 'upvoted',
	ping: true,
	description: 'Shows who upvoted the specific emote',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'channelSpecific command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: true,
	channelSpecific: true,
	activeChannel: ['nymn', 'tolatos'],
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            const emotes = await got('https://bot-api.gempir.com/api/nominations?channel=nymn').json();

            if (!input[2]) {
                return 'Please provide an emote-id to look up';
            }

            const emoteid =  /\b[a-z\d]{24}\b/i.exec(input[2])?.toString();

            let emotename = emotes.filter(x => x.EmoteID === emoteid)[0]?.EmoteCode;
            
            if (!emotename) {
                return 'No emote with that emote-id is curently nominated';
            }

            let response = emotes.filter(x => x.EmoteID === emoteid)[0].Votes.map(x => x.VoteBy);

            if (!response.length) {
                return `No user has upvoted ${emotename} yet`;
            }

            let usernames = [];

            for (const userID of response) {
                try {
                    let userData = await got(`https://api.twitch.tv/helix/users?id=${userID}`, {
                        headers: {
                            'client-id': process.env.TWITCH_CLIENTID,
                            'Authorization': process.env.TWITCH_AUTH
                        }
                    }).json();

                    usernames.push(userData.data[0].login);
                } catch (err) {
                    console.log(err);
                }
            }

            let hastebinlist = await tools.makehastebin(usernames.join('\n'));

			return `${emotename} is currently upvoted by: ${hastebinlist}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};