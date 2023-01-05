const { got } = require('./../../got');
const tools = require('./../../tools/tools.js');
require('dotenv').config();

module.exports = {
	name: 'downvoted',
	ping: true,
	description: 'Shows who downvoted the specific emote',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'channelSpecific command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: false,
	channelSpecific: true,
	activeChannel: 'nymn',
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

            let emoteid = input[2];

            let emotename = emotes.filter(x => x.EmoteID === emoteid)[0]?.EmoteCode;
            
            if (!emotename) {
                return 'No emote with that emote-id is curently nominated';
            }

            let response = emotes.filter(x => x.EmoteID === emoteid)[0].Downvotes.map(x => x.VoteBy);

            if (!response) {
                return `No user has downvoted ${emotename} yet`;
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

			return `${emotename} is currently downvoted by: ${hastebinlist}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};