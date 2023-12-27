const { got } = require('./../got');
const tools = require('../tools/tools.js');


module.exports = {
	name: 'fl',
	ping: true,
	description: 'This command will give you the first logged line from a specific user in the chat (Only works if logs are available in the channel, logs used: "https://logs.ivr.fi/"). Example: "bb fl NymN"',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let uid = user['user-id'];
			let realname = user.username;
			if (realuser.match(/@?titleChange_bot,?/gi)) {
				return;
			}
			if (input[2]) {
				if (input[2].startsWith('@')) {
					input[2] = input[2].substring(1);
				}
				[uid] = await got(`https://api.ivr.fi/v2/twitch/user?login=${input[2]}`).json();
				realname = uid.login;
				uid = uid.id;
			}
			let realchannel = channel;
			if (input[3]) {
				realchannel = input[3];
			}

			let logDate = await got(`https://logs.ivr.fi/list?channel=${realchannel}&userid=${uid}`).json();

			logDate = logDate.availableLogs;

			let messageFound = false;
			let i = 1;
			let realmessages = '';
            let fl = null;
			while (!messageFound) {
				let year = logDate[logDate.length - i].year;
				let month = logDate[logDate.length - i].month;

				fl = await got(`https://logs.ivr.fi/channel/${realchannel}/userid/${uid}/${year}/${month}?json`).json();

				realmessages = fl.messages.filter((message) =>  {
                    if (message.type !== 1) {
						return false;
					}
					return true;
                });

				i++;
				if (realmessages[0]) {
					messageFound = true;
					realmessages = realmessages[0];
				} else if (i > logDate.length) {
					return `FeelsDankMan @${realname}, has never said anything in #${realchannel}`;
				}
			}

			let message = tools.splitLine(realmessages.text, 350);

			const timeago = new Date().getTime() - Date.parse(realmessages.timestamp);
			if (fl?.status !== 404) {
				if (message[1]) {
					return `#${realchannel} ${realmessages.displayName}: ${message[0]}... - (${tools.humanizeDuration(timeago)} ago)`;
				}
				return `nymnDank ${realmessages.displayName}'s first message in #${realchannel[0]}\u{E0000}${realchannel.slice(1)} was: ${message} - (${tools.humanizeDuration(timeago)} ago)`;
			}

		} catch (err) {
			console.log(err);

			if (err.toString().startsWith('HTTPError: Response code 403 (Forbidden)')) {
				return 'User or channel has opted out';
			}
			if (err.toString().startsWith('HTTPError: Response code 500 (Internal Server Error)')) {
				return 'Could not load logs. Most likely the user either doesn\'t exist or doesn\'t have any logs here.';
			}
			if (err.name) {
				if (err.name === 'HTTPError') {
					return 'No logs available for the user/channel';
				}
				return `FeelsDankMan api error: ${err.name}`;
			}
			return 'FeelsDankMan Error';
		}
	}
};