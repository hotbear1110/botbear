const { got } = require('./../got');

module.exports = {
	name: 'thumbnail',
	ping: true,
	description: 'Will return the latest thumbnail image of a given streamer',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: true,
	channelSpecific: false,
	activeChannel: '',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			
 			if (!process.env.THREELETTERAPI_CLIENTID) {
				return 'FeelsDankMan Error: THREELETTERAPI_CLIENTID isn`t set';
			}

			const realchannel = input[2] ?? channel;

			let thumbnail = (await got(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${realchannel}-0x0.jpg`)).url;
			
			if (thumbnail === "https://static-cdn.jtvnw.net/ttv-static/404_preview-0x0.jpg") {
				const query = `
				query {
	   					user(login:"${realchannel}") {
							videoShelves {
		  						edges {
			 						node {
			 							items {
			  								...on Video {
												previewThumbnailURL(width:0 height:0)
			   									}
				 							}
			  							}
			  						}
			 					}
		   					}
						}`;
	
				const ThreeLetterApiCall = await got.post('https://gql.twitch.tv/gql', {
					headers: {
						'Client-ID': process.env.THREELETTERAPI_CLIENTID,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						query: query
					}),
				}).json();
	
	            
				if (!ThreeLetterApiCall.data.user.videoShelves) {
					return `FeelsDankMan Unable to find any thumbnails for ${realchannel}`;
				}
	
	            thumbnail = ThreeLetterApiCall["data"]["user"]["videoShelves"]["edges"][1]["node"]["items"][0]["previewThumbnailURL"];
			}
						
			return '[OFFLINE] | VOD Thumbnail: ' + thumbnail;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};
