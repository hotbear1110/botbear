const { got } = require('./../got');
const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'emotecheck',
	ping: true,
	description: 'This command will give you information about Twitch and 3rd party emotes. Example: "bb emotecheck TriHard"',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			if (!input[2]) {
				return 'No emote specified. Example: "bb emotecheck TriHard "';
			}
			let emoteId = input[2];
			if (user.emotes) {
				emoteId = Object.keys(user.emotes)[0] + '?id=true';
			} else {
				const v1 = /\b\d{1,9}(?!\/emotes)\b/.exec(emoteId);
				let v2 = /(?<=\b|_)[a-f0-9]{32}(?!\/emotes)\b/i.exec(emoteId);

				v2 &&= `emotesv2_${v2}`;

				let id = v2 ?? v1;

				emoteId = id ? id + '?id=true' : emoteId;
			}

			const emotecheck = await got(`https://api.ivr.fi/v2/twitch/emotes/${emoteId}`).json();

			if (!emotecheck['error']) {
				let emotechannel = emotecheck['channelName'];
				let tier = emotecheck['emoteTier'];
				let url = `https://static-cdn.jtvnw.net/emoticons/v2/${emotecheck['emoteID']}/default/dark/3.0`;
				let emoteType = emotecheck['emoteType'].toLowerCase();
				let realid = emotecheck['emoteID'];
				let emoteStatus = 'null';
				if (emotecheck['emoteAssetType']) {
					emoteStatus = emotecheck['emoteAssetType'].toLowerCase();
				}
				let realemote = emotecheck['emoteCode'];

				if (emotecheck['channelName']) {
					if (emotecheck['channelName'].toLowerCase() !== emotecheck['channelLogin']) {
						emotechannel = `${emotecheck['channelLogin']}(${emotecheck['channelName']})`;
					}
				}

				let ecount = false;

				try {
					const { body, statusCode } = await got(`https://api.streamelements.com/kappa/v2/chatstats/${channel}/stats`, {
                        throwHttpErrors: false
                    });

                    if (statusCode !== 200) {
                        throw body;
                    }

                    const emotecount = JSON.parse(body);
                    
					let count = emotecount['twitchEmotes'];
					for (const emote of count) {
						if (emote['emote'] === realemote) {
							ecount = emote['amount'];
							break;
						}
					}
				} catch (err) {
					console.log(err);
				}

				const emoteCost = await got(`https://api.ivr.fi/v2/twitch/emotes/channel/${emotechannel}`).json();
				let bitEmotes = emoteCost['bitEmotes'];
				let realemoteCost = undefined;
				for (const emote of bitEmotes) {
					if (emote['code'] === realemote) {
						realemoteCost = emote['bitCost'];
						break;
					}
				}

				let emoteData = [
					(emoteType === 'BITS_BADGE_TIERS') ? 'Type: Bits Emote' : `Type: ${emoteType[0]?.toUpperCase() + emoteType.slice(1)}`,
					tier && `Tier: ${tier}`,
					realemoteCost && `Bit Cost: ${realemoteCost}`,
					`Name: ${realemote}`,
					`ID: ${realid}`,
					(!emotechannel && emoteType === 'SUBSCRIPTIONS')  ? 'Channel: banned/deleted' : emotechannel && `Channel: @${emotechannel}`,
					`assetType: ${emoteStatus}`,
					ecount && `Ecount: ${ecount}`,
					`Image Link: ${url}`
				].filter(Boolean).join(' | ');

				return emoteData;
			}

		} catch (err) {
			console.log(err);
		}
		try {
			const streamer = await sql.Query(`SELECT * FROM Streamers WHERE username="${channel}"`);
			let emotes = JSON.parse(streamer[0].emote_list);


			const now = new Date().getTime();

			let found = 0;

			let response = '';
			let ecount = 0;
			let foundemote = 0;

            // TODO Uhh some cleanup in aisle 3
            
			try {
				const { body, statusCode } = await got(`https://api.streamelements.com/kappa/v2/chatstats/${channel}/stats`, {
                    throwHttpErrors: false
                });

                if (statusCode !== 200) {
                    throw body;
                }
                
                const emotecount = JSON.parse(body);
                
				let bttv = emotecount['bttvEmotes'];
				let ffz = emotecount['ffzEmotes'];

				for (const emote of bttv) {
					if (emote['emote'] === input[2]) {
						ecount = emote['amount'];
						foundemote = 1;
						break;
					}
				}
				if (foundemote === 0) {
					for (const emote of ffz) {
						if (emote['emote'] === input[2]) {
							ecount = emote['amount'];
							foundemote = 1;
							break;
						}
					}
				}
			} catch (err) {
				console.log(err);
			}
			for (const emote of emotes) {
				if (emote[0] === input[2]) {

					emote[2] = `(${tools.humanizeDuration(now - emote[2])})`;

					found = 1;
					if (emote[5] === '7tv_ZERO_WIDTH') {
						emote[5] = '7tv (zero width)';
					}
					if (ecount !== 0) {
						response = `${input[2]} is a ${emote[5]} emote, the emote was added to the channel ${emote[2]} ago, and has been used ${ecount} times in this chat. The emote was uploaded by the user "${emote[3]}" - ${emote[4]}`;
					}
					else {
						response = `${input[2]} is a ${emote[5]} emote, the emote was added to the channel ${emote[2]} ago. The emote was uploaded by the user "${emote[3]}" - ${emote[4]}`;

					}
					break;
				}

			}

			if (found === 1) {
				return response;
			}
			if (found === 0) {
				const ffzglobal = await got('https://api.frankerfacez.com/v1/set/global').json();
				const bttvglobal = await got('https://api.betterttv.net/3/cached/emotes/global').json();
				const stvglobal = await got('https://api.7tv.app/v2/emotes/global').json();

				let ffzemotes = ffzglobal['sets'];
				ffzemotes = ffzemotes['3'];
				ffzemotes = ffzemotes['emoticons'];

				for (const emote of ffzemotes) {
					if (emote['name'] === input[2]) {
						found = 1;
						let url = emote['urls'];
						let owner = emote['owner'];
						if (ecount !== 0) {
							response = `${input[2]} is a global ffz emote by ${owner['name']}, the emote has been used ${ecount} times in this chat. - ${url['1']}`;
						}
						else {
							response = `${input[2]} is a global ffz emote by ${owner['name']}  - https:${url['1']}`;

						}
						break;
					}
				}
				if (found === 1) {
					return response;
				}

				let bttvemotes = bttvglobal;

				for (const emote of bttvemotes) {
					if (emote['code'] === input[2]) {
						found = 1;
						if (ecount !== 0) {
							response = `${input[2]} is a global bttv emote, the emote has been used ${ecount} times in this chat.`;
						}
						else {
							response = `${input[2]} is a global bttv emote.`;

						}
						break;
					}
				}

				if (found === 1) {
					return response;
				}

				let svtemotes = stvglobal;

				for (const emote of svtemotes) {
					if (emote['name'] === input[2]) {
						found = 1;
						let url = emote['urls'];
						url = url[3];

						if (ecount !== 0) {
							response = `${input[2]} is a global 7tv emote, the emote has been used ${ecount} times in this chat - ${url[1]}`;
						}
						else {
							response = `${input[2]} is a global 7tv emote - ${url[1]}`;

						}
						break;
					}
				}

			}

			if (found === 1) {
				return response;
			} else {
				return 'FeelsDankMan Error: Emote was not found';
			}


		} catch (err) {
			console.log(err);
			if (err.name) {
				if (err.name === 'TimeoutError') {
					return `FeelsDankMan api error: ${err.name}`;
				}
			}
			return `FeelsDankMan Error: ${err.response.data.error}`;
		}
	}
};