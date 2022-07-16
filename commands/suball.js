const got = require('got');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'suball',
	ping: false,
	description: 'This command is for subbing to channel.update, stream.online and stream.offline for all streamers in db',
	permission: 2000,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			const streamers = await sql.Query(`
            SELECT uid
            FROM Streamers`);


			for (let i = 0; i < streamers.length; i++) {
				setTimeout(async function () {
					let uid = streamers[i].uid;

					let data = JSON.stringify({
						'type': 'channel.update',
						'version': '1',
						'condition': { 'broadcaster_user_id': uid.toString() },
						'transport': { 'method': 'webhook', 'callback': 'https://hotbear.org/eventsub', 'secret': process.env.TWITCH_SECRET }
					});
					console.log(uid);
					await got.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
						headers: {
							'client-id': process.env.TWITCH_CLIENTID,
							'Authorization': process.env.TWITCH_AUTH,
							'Content-Type': 'application/json'
						},
						body: data
					});
				}, 100 * i);

				setTimeout(async function () {
					let uid = streamers[i].uid;

					let data = JSON.stringify({
						'type': 'stream.online',
						'version': '1',
						'condition': { 'broadcaster_user_id': uid.toString() },
						'transport': { 'method': 'webhook', 'callback': 'https://hotbear.org/eventsub', 'secret': process.env.TWITCH_SECRET }
					});
					console.log(uid);
					await got.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
						headers: {
							'client-id': process.env.TWITCH_CLIENTID,
							'Authorization': process.env.TWITCH_AUTH,
							'Content-Type': 'application/json'
						},
						body: data
					});
				}, 100 * i);

				setTimeout(async function () {
					let uid = streamers[i].uid;

					let data = JSON.stringify({
						'type': 'stream.offline',
						'version': '1',
						'condition': { 'broadcaster_user_id': uid.toString() },
						'transport': { 'method': 'webhook', 'callback': 'https://hotbear.org/eventsub', 'secret': process.env.TWITCH_SECRET }
					});
					console.log(uid);
					await got.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
						headers: {
							'client-id': process.env.TWITCH_CLIENTID,
							'Authorization': process.env.TWITCH_AUTH,
							'Content-Type': 'application/json'
						},
						body: data
					});
				}, 100 * i);
			}
			return 'Okayge done!!';
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};