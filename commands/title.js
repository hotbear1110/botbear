const tools = require('../tools/tools.js');
const { got } = require('./../got');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'title',
	ping: true,
	description: 'This command will give you the title of a given streamer',
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let realchannel = channel;

			if (input[2]) {
				if (input[2].startsWith('@')) {
					input[2] = input[2].substring(1);
				}
				realchannel = input[2];
			}
			let title = '';
			const streamTitle = await sql.Query('SELECT title, title_time FROM Streamers WHERE username=?', [realchannel]);
			if (!streamTitle[0]) {
				let userID = await got(`https://api.ivr.fi/v2/twitch/user?login=${input[2]}`).json();

				userID = userID.id;

				title = await got(`https://api.twitch.tv/helix/channels?broadcaster_id=${userID}`, {
					headers: {
						'client-id': process.env.TWITCH_CLIENTID,
						'Authorization': process.env.TWITCH_AUTH
					}
				}).json();
				title = title.data[0].title;
			} else {
				let oldtitleTime = JSON.parse(streamTitle[0].title_time);
				title = streamTitle[0].title;

				if (oldtitleTime !== null) {
					const ms = new Date().getTime() - oldtitleTime;

					return `@${realchannel[0]}\u{E0000}${realchannel.slice(1)}'s current title is: "${title}". Title changed ${tools.humanizeDuration(ms)} ago.`;
				}
			}


			return `@${realchannel}'s current title is: "${title}"`;
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};