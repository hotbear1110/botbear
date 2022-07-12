const got = require('got');
const _ = require('underscore');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'subage',
	ping: false,
	description: 'This command will give you the time a given user has subbed to a given channel, along with a bunch of info about the sub. Example: "bb subage HotBear1110 NymN"',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let username = user.username;
			if (input[2]) {
				if (input[2].startsWith('@')) {
					input[2] = input[2].substring(1);
				}
				username = input[2];
			}
			let realchannel = channel;
			if (input[3]) {
				realchannel = input[3];
			}

			let naniresponse = '';
			if (realchannel === 'nani') {
				naniresponse = ' Copege This channel is real';
			}

			let subcheck = await got(`https://api.ivr.fi/twitch/subage/${username}/${realchannel}`, { timeout: 10000 }).json();
			if (subcheck['hidden']) {
				return 'That user/channel has their sub status hidden';
			}
			if (subcheck['subscribed'] == false) {
				let oldsub = subcheck['cumulative'];
				const subend = new Date().getTime() - Date.parse(oldsub['end']);


				if (oldsub['months'] === 0) {
					return `${username} is not subbed to #${realchannel} and never has been.`;
				}
				else {
					return `${username} is not subbed to #${realchannel} but has been previously for a total of ${oldsub['months']} months! Sub ended ${tools.humanizeDuration(subend)} ago`;
				}
			}
			else {
				let subdata = subcheck['meta'];
				let sublength = subcheck['cumulative'];
				let substreak = subcheck['streak'];

				const ms = new Date().getTime() - Date.parse(subdata['endsAt']);

				if (subdata['tier'] === 'Custom') {
					return `${username} is subbed to #${realchannel} with a permanent sub and has been subbed for a total of ${sublength['months']} months! They are currently on a ${substreak['months']} months streak.` + naniresponse;

				}
				if (subdata['endsAt'] === null) {
					return `${username} is currently subbed to #${realchannel} with a tier ${subdata['tier']} sub and has been subbed for a total of ${sublength['months']} months! They are currently on a ${substreak['months']} months streak. This is a permanent sub.` + naniresponse;
				}
				if (subdata['type'] === 'prime') {
					return `${username} is currently subbed to #${realchannel} with a tier 1 prime sub and has been subbed for a total of ${sublength['months']} months! They are currently on a ${substreak['months']} months streak. The sub ends/renews in ${tools.humanizeDuration(ms)}` + naniresponse;
				}
				if (subdata['type'] === 'paid') {
					return `${username} is currently subbed to #${realchannel} with a tier ${subdata['tier']} sub and has been subbed for a total of ${sublength['months']} months! They are currently on a ${substreak['months']} months streak. The sub ends/renews in ${tools.humanizeDuration(ms)}` + naniresponse;
				}
				if (subdata['type'] === 'gift') {
					let gifta = subdata['gift']['name'];
					return `${username} is currently subbed to #${realchannel} with a tier ${subdata['tier']} sub, gifted by ${gifta} and has been subbed for a total of ${sublength['months']} months! They are currently on a ${substreak['months']} months streak. The sub ends/renews in ${tools.humanizeDuration(ms)}` + naniresponse;
				}
			}
		} catch (err) {
			if (err.response.data.error) {
				return `${err.response.data.error} (${err.response.data.username})`;
			}
			console.log(err);
			if (err.name === 'TimeoutError') {
				return `FeelsDankMan api error: ${err.name}`;
			}
			return 'FeelsDankMan Error';
		}
	}
};