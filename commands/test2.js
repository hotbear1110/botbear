require('dotenv').config();
const sql = require('./../sql/index.js');
const got = require('got');

module.exports = {
	name: 'test2',
	ping: true,
	description: 'test',
	permission: 2000,
	category: 'Dev command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let allsubs = [];
			let haspagnation = true;
			let pagnation = '';
			console.log('yes');
			while (haspagnation) {
				console.log('no');
				let subs = await got(`https://api.twitch.tv/helix/eventsub/subscriptions?after=${pagnation}`, {
					headers: {
						'client-id': process.env.TWITCH_CLIENTID,
						'Authorization': process.env.TWITCH_AUTH
					}
				});
				console.log(subs);

				subs = JSON.parse(subs.body);
				if (subs.pagination.cursor) {
					pagnation = subs.pagination.cursor;
				} else {
					haspagnation = false;
				}
				subs = subs.data.id;
				allsubs = allsubs.concat(subs);
			}

			const streamers = await sql.Query(`
            SELECT uid
            FROM Streamers`);
			console.log(allsubs);
			for (let i = 0; i < streamers.length; i++) {
				if (!allsubs.includes(streamers[i].uid))
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
			return 'Okayge done';
		} catch (err) {
			console.log(err);
			return `FeelsDankMan Sql error: ${err.sqlMessage}`;
		}
	}
};