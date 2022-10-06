const { got } = require('./../got');
const tools = require('../tools/tools.js');

module.exports = {
	name: 'lm',
	ping: true,
	description: 'This command will give you the last logged line from a specific user in the chat (Only works if logs are available in the channel, logs used: "https://logs.ivr.fi/"). Example: "bb fl NymN"',
	permission: 100,
	category: 'Info command',
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
			let uid = user['user-id'];
			let realuser = user.username;
			if (input[2]) {
				if (input[2].startsWith('@')) {
					input[2] = input[2].substring(1);
				}
				uid = await got(`https://api.ivr.fi/twitch/resolve/${input[2]}`).json();
				uid = uid.id;
				realuser = input[2];
			}
			let realchannel = channel;
			if (input[3]) {
				realchannel = input[3];
			}

			if (channel === realchannel && user['user-id'] === uid) {
				return 'nymnDank But you are right here ❓❗';
			}
			let logDate = await got(`https://logs.ivr.fi/list?channel=${realchannel}&userid=${uid}`).json();

			logDate = logDate.availableLogs;

			let messageFound = false;
			let i = 0;
			let realmessages = '';
			let lm = '';
			while (!messageFound) {
				let year = logDate[i].year;
				let month = logDate[i].month;

				lm = await got(`https://logs.ivr.fi/channel/${realchannel}/userid/${uid}/${year}/${month}?json&reverse`).json();


				realmessages = lm.messages.filter(filterByID);

				i++;
				if (realmessages[0]) {
					messageFound = true;
					realmessages = realmessages[0];
				} else if (i > logDate.length - 1) {
					return `FeelsDankMan @${realuser}, has never said anything in #${realchannel}`;
				}
			}

			let message = tools.splitLine(realmessages.text, 350);

			const timeago = new Date().getTime() - Date.parse(realmessages.timestamp);

			if (lm.status !== 404) {
				if (message[1]) {
					return `#${realchannel} ${realmessages[0].displayName}: ${message[0]}... - (${tools.humanizeDuration(timeago)} ago)`;
				}
				return `nymnDank ${realmessages.displayName}'s last message in #${realchannel[0]}\u{E0000}${realchannel.slice(1)} was: ${message} - (${tools.humanizeDuration(timeago)} ago)`;
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


function filterByID(message) {
    if (message.type !== 1) {
        return false;
    }
    return true;
}