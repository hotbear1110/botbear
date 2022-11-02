const { got } = require('./../got');
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

			let subcheck = await got(`https://api.ivr.fi/v2/twitch/subage/${username}/${realchannel}`).json();
			if (subcheck['statusHidden']) {
				return 'That user/channel has their sub status hidden';
			}
			if (subcheck['meta'] == null) {
				let oldsub = subcheck['cumulative'];


				if (oldsub['months'] === 0 || !oldsub['months']) {
					return `${username} has never been subbed to @${realchannel}.`;
				}
				else {
					const subend = new Date().getTime() - Date.parse(oldsub['end']);
					return `${username} has previously been subbed to @${realchannel} for a total of ${oldsub['months']} months! Sub ended ${tools.humanizeDuration(subend)} ago`;
				}
			}
			else {
				let subdata = subcheck['meta'];
				let sublength = subcheck['cumulative'];
				let substreak = subcheck['streak'];

				const anniversaryMS = new Date().getTime() - Date.parse(sublength['end']);
				const ms = new Date().getTime() - Date.parse(subdata['endsAt']);

				if (subdata['tier'] === 'Custom') {
					return `User: ${username} | Channel: ${realchannel} | Type: Permanent Sub | Months: ${sublength['months']} | Streak: ${substreak['months']} ${naniresponse}`;
					

				}
				if (subdata['endsAt'] === null) {
					return `User: ${username} | Channel: ${realchannel} | Type: Permanent Sub | Tier: ${subdata['tier']} | Months: ${sublength['months']} | Streak: ${substreak['months']} ${naniresponse}`;
				}
				if (subdata['type'] === 'prime') {
					return `User: ${username} | Channel: ${realchannel} | Type: Prime Sub | Months: ${sublength['months']} | Streak: ${substreak['months']} | Ends/Renews: ${tools.humanizeDuration(ms)} | Anniversary: ${tools.humanizeDuration(anniversaryMS)} ${naniresponse}`;
				}
				if (subdata['type'] === 'paid') {
					return `User: ${username} | Channel: ${realchannel} | Type: Paid | Tier: ${subdata['tier']} | Months: ${sublength['months']} | Streak: ${substreak['months']} | Ends/Renews: ${tools.humanizeDuration(ms)} | Anniversary: ${tools.humanizeDuration(anniversaryMS)} ${naniresponse}`;
				}
				if (subdata['type'] === 'gift') {
					let gifta = (subdata['giftMeta']['gifter'] === null) ? 'Anonymous' : subdata['giftMeta']['gifter']['login'];
					return `User: ${username} | Channel: ${realchannel} | Type: Gift | Gifter: ${gifta} | Tier: ${subdata['tier']} | Months: ${sublength['months']} | Streak: ${substreak['months']} | Ends/Renews: ${tools.humanizeDuration(ms)} | Anniversary: ${tools.humanizeDuration(anniversaryMS)} ${naniresponse}`;
				}
			}
		} catch (err) {
			console.log(err);
			if (err.response.data.error) {
				return `${err.response.data.error} (${err.response.data.username})`;
			}
			if (err.name === 'TimeoutError') {
				return `FeelsDankMan api error: ${err.name}`;
			}
			return 'FeelsDankMan Error';
		}
	}
};
