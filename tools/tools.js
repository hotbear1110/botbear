require('dotenv').config();
const { got } = require('./../got');
const tools = require('./tools.js');
const bannedPhrases = require('./bannedPhrases.js');
const hastebin = require('hastebin');
const humanize = require('humanize-duration');
const regex = require('./regex.js');
const sql = require('../sql/index.js');

exports.banphrasePass = (message, channel) => new Promise(async (resolve) => {
	this.channel = channel;
	this.message = message.replace(/^\/me /, '');
	this.data = await sql.Query(`
          SELECT banphraseapi
          FROM Streamers
          WHERE username=?`,
	[this.channel]);
	if (!this.data.length) {
		this.banphraseapi = null;
	} else {
		this.banphraseapi = this.data[0].banphraseapi;
	}
	try {
		if (this.banphraseapi == null || this.banphraseapi == 'NULL' || !this.banphraseapi) {
			this.banphraseapi = 'https://pajlada.pajbot.com';
		}
	} catch (err) {
		console.log(err);
		resolve(0);
	}
	try {
		this.message = encodeURIComponent(this.message);
		this.checkBanphrase = await got(`${this.banphraseapi}/api/v1/banphrases/test`, {
			method: 'POST',
			body: 'message=' + this.message,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}).json();
		resolve(this.checkBanphrase);
	} catch (err) {
		console.log(err);
		try {
			this.message = encodeURIComponent(this.message);
			this.checkBanphrase = await got('https://pajlada.pajbot.com/api/v1/banphrases/test', {
				method: 'POST',
				body: 'message=' + this.message,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).json();
			resolve(this.checkBanphrase);
		} catch (err) {
			console.log(err);
			resolve(0);
		}
	}

});

exports.banphrasePassV2 = (message, channel) => new Promise(async (resolve) => {
	this.channel = channel;
	this.message = encodeURIComponent(message).replaceAll('%0A', '%20').replace(/^\/me /, '');
	this.data = await sql.Query('SELECT * FROM Streamers WHERE username=?', [this.channel]);

	if (this.data[0]) {
		this.userid = this.data[0].uid;
		this.banphraseapi2 = this.data[0].banphraseapi2;
	} else {
		this.banphraseapi2 = null;
	}
	if (this.banphraseapi2 !== null) {
		try {
			this.checkBanphrase = await got(`${this.banphraseapi2}/api/channel/${this.userid}/moderation/check_message?message=botbear1110%3A%20${this.message}`).json();
			if (this.checkBanphrase['banned'] == true) {
				resolve(true);
			}
			resolve(false);
		} catch (err) {
			console.log(err);
			try {
				this.checkBanphrase = await got(`https://paj.pajbot.com/api/channel/62300805/moderation/check_message?message=botbear1110%3A%20${this.message}`).json();
				if (this.checkBanphrase['banned'] == true) {
					resolve(true);
				}
				resolve(false);
			} catch (err) {
				console.log(err);
				resolve(0);
			}
		}
	} else {
		try {
			this.checkBanphrase = await got(`https://paj.pajbot.com/api/channel/62300805/moderation/check_message?message=botbear1110%3A%20${this.message}`).json();
			if (this.checkBanphrase['banned'] == true) {
				resolve(true);
			}
			resolve(false);
		} catch (err) {
			console.log(err);
			resolve(0);
		}
	}

});


const hasCooldown = new Set();

let cooldownTime = {};

exports.Cooldown = class Cooldown {
	constructor(user, command, CD) {
		this.cooldown = CD;
		if (!user['user-id']) {
			this.userId = user;
		} else {
			this.userId = user['user-id'];
		}
		this.command = command;
		this.key = `${this.userId}_${this.command}`;
	}

	async cooldownReduction() {
		const cooldown = this.cooldown;

		return cooldown;
	}

	// command cooldown
	async setCooldown() {
		if (this.userId === process.env.TWITCH_OWNERUID) { return []; } // Your user ID

		if (hasCooldown.has(this.key)) { return [this.key]; }

		hasCooldown.add(this.key);

		cooldownTime[this.key] = new Date().getTime();


		setTimeout(() => {
			hasCooldown.delete(this.key);
			delete cooldownTime[this.key];

		}, await this.cooldownReduction());
		return [];
	}

	/**
     * @returns {String}: String formatted time left.
     */
	formattedTime() {
		return exports.humanizeDuration(this.cooldown - (new Date().getTime() - cooldownTime[this.key]));
	}
};

exports.splitLine = (message, chars) => {
	let fixedMessage = [[]];
	let messageArray = message.split(' ');
	let index = 0;
	for (const [, word] of messageArray.entries()) {
		fixedMessage[index].push(word);
		if (fixedMessage[index].join(' ').length > chars) {
			fixedMessage[index].pop();
			index++;
			fixedMessage.push([]);
			fixedMessage[index].push(word);
		}
	}

	if(fixedMessage[0].join(' ').length === 0) {
		return ['Message is too long :('];
	}
	return fixedMessage.map(x => x.join(' '));
};

let hasteoptions = {
	raw: false,
	contentType: 'text/plain',
	server: 'https://haste.zneix.eu/'
};

exports.makehastebin = (message) =>
hastebin.createPaste(message, hasteoptions)
	.then(function (url) {return url;});

/**
 * @param { number } ms 
 * @returns { String }
 */
exports.humanizeDuration = (ms) => {
	const options = {
		language: 'shortEn',
		languages: {
			shortEn: {
				y: () => 'y',
				mo: () => 'mo',
				w: () => 'w',
				d: () => 'd',
				h: () => 'h',
				m: () => 'm',
				s: () => 's',
				ms: () => 'ms',
			},
		},
		units: ['y', 'd', 'h', 'm', 's'],
		largest: 3,
		round: true,
		conjunction: ' and ',
		spacer: '',

	};
	return humanize(ms, options);
};

exports.notbannedPhrases = (message) => {

	let banPhraseList = bannedPhrases.bannedPhrases;
	let isbanned = 'null';
	try {
		for (const phrase of banPhraseList) {
			if (message.includes(phrase)) {
				isbanned = '[Bad word detected] cmonBruh';
				break;
			}
		}
		return isbanned;
	} catch (err) {
		console.log(err);
		return;
	}
};

exports.massping = (message, channel) => new Promise(async (resolve) => {
	message = message.replace(/(^|[@#.,:;\s]+)|([?!.,:;\s]|$)/gm, ' ');

	let dblist = ('filler ' + message.slice())
		.split(' ')
		.filter(String);

	const dbpings = await sql.Query('SELECT username FROM Users WHERE ' + Array(dblist.length).fill('username = ?').join(' OR '), dblist);

	let dbnames = dbpings.map(a => a.username);
    const users = await module.exports.getChatters(channel);

	let userlist = [];
	for (const [_, values] of Object.entries(users)) {
		userlist = userlist.concat(values);
	}

	userlist = userlist.concat(dbnames.filter(x => !userlist.includes(x)));

	let pings = 0;
	for (const user of userlist) {
		if (message.includes(user)) {
			pings++;
		}
		if (pings > 7) {
			break;
		}
	}
	if (pings > 7) {
		resolve('[MASS PING]');
	}
	resolve('null');
});

exports.asciiLength = (message) => {
	const msgarray = message.split(' ');
	let emojicount = 0;

	for (const word of msgarray) {
		if (/\p{Emoji}/u.test(word)) {
			emojicount++;
		}
	}
	return emojicount;

};


exports.Alias = (message) => new Promise(async (resolve) => {		
		/** @type { Array<SQL.Aliases> } */
		this.aliasList = await sql.Query('SELECT Aliases FROM Aliases');

		if (!this.aliasList.length) {
			await sql.Query('INSERT INTO Aliases VALUES ("[]")');
			this.aliasList = '[]';
		}

		this.aliasList = JSON.parse(this.aliasList[0].Aliases);

		this.command = message
			.split(' ')
			.splice(1)
			.filter(Boolean)[0];
		this.alias = this.aliasList.filter(i => i[this.command]);
		if (this.alias.length) {
			this.newMessage = message.replace(this.command, this.alias[0][this.command]).split(' ');
		resolve(this.newMessage);
		}
		this.newMessage = message.split(' ');
		resolve(this.newMessage);
});

exports.getPerm = (user) => new Promise(async (resolve) => {
	try {
		let userPermission = await sql.Query('SELECT * FROM Users WHERE username=?', [user]);
		userPermission = JSON.parse(userPermission[0].permission);

		resolve(userPermission);
	} catch (err) {
		console.log(err);
		resolve(0);
	}
});

/**
 * @returns {Promise<[String, String][]>}
 */
exports.nameChanges = async () => {
    const changed = [];
    const promises = [];

    const channels = await sql.Query('SELECT * FROM Streamers');

    promises.push(channels.map(async(streamer) => {
        const { statusCode, body } = await got(`https://api.twitch.tv/helix/users?id=${streamer.uid}`, {
            headers: {
                'client-id': process.env.TWITCH_CLIENTID,
                'Authorization': process.env.TWITCH_AUTH
            },
            timeout: 10000,
            throwOnHttpError: false,
        });
    
        if (statusCode >= 400) {
            console.error('Error while fetching name changes', { u: streamer.uid, s: statusCode, b: body });
        } else {
            const userData = JSON.parse(body);
            
            if (userData.data.length) {
                const realUser = userData.data[0]['login'];
                
                if (realUser !== streamer.username) {
                    sql.Query('UPDATE Streamers SET username=? WHERE uid=?', [realUser, streamer.uid]);
                
                    changed.push([realUser, streamer.username]);
                }
            }
        }   
    }));

    await Promise.all(promises);

    return changed;
};

exports.bannedStreamers = async () => {
	return new Promise(async (Resolve, Reject) => {
		let streamers = await sql.Query('SELECT * FROM Streamers');
		let bannedUsers = [];

		for (const streamer of streamers) {
			try {
				const isBanned = await got(`https://api.ivr.fi/twitch/resolve/${streamer.username}`).json();

				if (isBanned.banned === true) {
					await sql.Query('DELETE FROM Streamers WHERE uid=?', [streamer.uid]);

					bannedUsers.push(streamer.username);
				}
			} catch (err) {
				Reject(err);
			}
		}

		Resolve(bannedUsers);
	});
};


exports.similarity = async function (s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
};

function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0)
				costs[j] = j;
			else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1))
						newValue = Math.min(Math.min(newValue, lastValue),
							costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0)
			costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}

/**
 * @author JoachimFlottorp
 * @param {ChatUserstate} username User variable tmi.js creates. 
 * @param {string} channel Channel to check for moderator status
 * @returns {boolean} true | false | If is mod
 */
exports.isMod = async function (user, channel) {
	const isMod = user.mod || user['user-type'] === 'mod';
	const isBroadcaster = channel === user.username;
	let modCheck = false;
	try {
		modCheck = await got(`https://api.ivr.fi/v2/twitch/modvip/${channel}`).json()
							.mods
							.map(x => x = (x.login === user.username) ? true : false)
							.includes(true);
	} catch (err) {
		console.log(err);
	}
	const isModUp = isMod || isBroadcaster  || modCheck;
	return isModUp;
};

exports.checkAllBanphrases = async function (message, channel) {
	const banPhrase = await tools.banphrasePass(message, channel);

	if (banPhrase.banned) {
		return '[Banphrased] nymnS';
	}

	if (banPhrase === 0) {
		return 'FeelsDankMan banphrase error!!';
	}

	const banPhraseV2 = await tools.banphrasePassV2(message, channel);

	if (banPhraseV2 == true) {
		return '[Banphrased] nymnS';
	}

	const notabanPhrase = await tools.notbannedPhrases(message.toLowerCase());

	if (notabanPhrase != 'null') {
		return notabanPhrase;
	}

	const badWord = message.match(regex.racism);
	if (badWord != null) {
		return '[Bad word detected] nymnS';
	}

	const reallength = await tools.asciiLength(message);
	if (reallength > 30) {
		return '[Too many emojis]';
	}

	const massping = await tools.massping(message, channel);
	if (massping === '[MASS PING]') {
		return '[MASS PING]';
	}

	return message;
};

exports.joinEventSub = async function (uid) {
	if (process.env.TWITCH_SECRET === undefined) return;

	let data = JSON.stringify({
		'type': 'channel.update',
		'version': '1',
		'condition': { 'broadcaster_user_id': uid.toString() },
		'transport': { 'method': 'webhook', 'callback': 'https://hotbear.org/eventsub', 'secret': process.env.TWITCH_SECRET }
	});
	await got.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
		headers: {
			'client-id': process.env.TWITCH_CLIENTID,
			'Authorization': process.env.TWITCH_AUTH,
			'Content-Type': 'application/json'
		},
		body: data
	});

	data = JSON.stringify({
		'type': 'stream.online',
		'version': '1',
		'condition': { 'broadcaster_user_id': uid.toString() },
		'transport': { 'method': 'webhook', 'callback': 'https://hotbear.org/eventsub', 'secret': process.env.TWITCH_SECRET }
	});
	await got.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
		headers: {
			'client-id': process.env.TWITCH_CLIENTID,
			'Authorization': process.env.TWITCH_AUTH,
			'Content-Type': 'application/json'
		},
		body: data
	});

	data = JSON.stringify({
		'type': 'stream.offline',
		'version': '1',
		'condition': { 'broadcaster_user_id': uid.toString() },
		'transport': { 'method': 'webhook', 'callback': 'https://hotbear.org/eventsub', 'secret': process.env.TWITCH_SECRET }
	});
	await got.post('https://api.twitch.tv/helix/eventsub/subscriptions', {
		headers: {
			'client-id': process.env.TWITCH_CLIENTID,
			'Authorization': process.env.TWITCH_AUTH,
			'Content-Type': 'application/json'
		},
		body: data
	});

	return true;
};

exports.deleteEventSub = async function (uid) {
	if (process.env.TWITCH_SECRET === undefined) return;

	let allsubs = [];
	let haspagnation = true;
	let pagnation = '';
	while (haspagnation) {
		let subs = await got(`https://api.twitch.tv/helix/eventsub/subscriptions?after=${pagnation}`, {
			headers: {
				'client-id': process.env.TWITCH_CLIENTID,
				'Authorization': process.env.TWITCH_AUTH
			}
		});
		subs = JSON.parse(subs.body);
		if (subs.pagination.cursor) {
			pagnation = subs.pagination.cursor;
		} else {
			haspagnation = false;
		}
		subs = subs.data;
		allsubs = allsubs.concat(subs);
	}

	let realsubs = allsubs.filter(x => x.condition.broadcaster_user_id === uid);

	if (realsubs.length) {
		for (let i = 0; i < realsubs.length; i++) {
			setTimeout(async function () {

				let sub = realsubs[i];
				await got.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`, {
					headers: {
						'client-id': process.env.TWITCH_CLIENTID,
						'Authorization': process.env.TWITCH_AUTH
					},
				});
			}, 100 * i);
		}
	}
	return;
};

exports.removeTrailingStuff = function (message) {
	while ([' ', '.', ','].includes(message[message.length - 1])) {
		message = message.slice(0, -1);
	}
	return message;
};

/*
    TODO Melon:
        Would prefer if this sent 100 users at a time, but your method of checking live streamers is not reliable.
        Should fix this some day.
*/
exports.checkLiveStatus = async function () {
	await sql.Query('SELECT * FROM Streamers')
		.then((streamers) => {
			streamers.map(async (stream) => {
				setTimeout(async () => {
					await got(`https://api.twitch.tv/helix/streams?user_login=${stream.username}`, {
						headers: {
							'client-id': process.env.TWITCH_CLIENTID,
							'Authorization': process.env.TWITCH_AUTH
						},
					}).json()
						.then(async ({ data }) => {
							if (data.length !== 0 && stream.islive == 0) {
								console.log(stream.username + ' IS NOW LIVE');
								await sql.Query(`UPDATE Streamers SET islive = 1 WHERE username = "${stream.username}"`);

							}
							if (data.length === 0 && stream.islive == 1) {
								console.log(stream.username + ' IS NOW OFFLINE');
								await sql.Query(`UPDATE Streamers SET islive = 0 WHERE username ="${stream.username}"`);

							}
						})
						.catch((error) => {
							console.log(error);
						});

				}, 500);
			});
		});
};

exports.checkTitleandGame = async function () {
	const streamers = await sql.Query('SELECT * FROM Streamers');

	for (const stream of streamers) {
		await got(`https://api.twitch.tv/helix/channels?broadcaster_id=${stream.uid}`, {
			headers: {
				'client-id': process.env.TWITCH_CLIENTID,
				'Authorization': process.env.TWITCH_AUTH
			},
		}).json()
			.then(async function (twitchdata) {
				// TODO why is this here.
				const newTitle = twitchdata.data[0].title;
				const newGame = twitchdata.data[0].game_name;

				if (newTitle !== stream.title) {
					let titleTime = new Date().getTime();
					console.log(stream.username + ' NEW TITLE: ' + newTitle);
					await sql.Query('UPDATE Streamers SET title=?, title_time=? WHERE username=?', [newTitle, titleTime, stream.username]);

				}
				if (newGame !== stream.game) {
					let gameTime = new Date().getTime();

					await sql.Query('UPDATE Streamers SET game=?, game_time=? WHERE username=?', [newGame, gameTime, stream.username]);

					console.log(stream.username + ' NEW GAME: ' + newGame);

				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	return;
};

exports.transformNumbers = function (message) {
	if (['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'].includes(message.toLowerCase())) {
		let numberConversion = {
			'zero': '0',
			'one': '1',
			'two': '2',
			'three': '3',
			'four': '4',
			'five': '5',
			'six': '6',
			'seven': '7',
			'eight': '8',
			'nine': '9',
			'ten': '10',
			'eleven': '11',
			'twelve': '12',
			'thirteen': '13',
			'fourteen': '14',
			'fifteen': '15',
			'sixteen': '16',
			'seventeen': '17',
			'eighteen': '18',
			'nineteen': '19',
			'twenty': '20'
		};

		message = numberConversion[message];
		return message;
	}
	if ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].includes(message)) {
		let numberConversion = {
			0: 'zero',
			1: 'one',
			2: 'two',
			3: 'three',
			4: 'four',
			5: 'five',
			6: 'six',
			7: 'seven',
			8: 'eight',
			9: 'nine',
			10: 'ten',
			11: 'elven',
			12: 'twelve',
			13: 'thirteen',
			14: 'fourteen',
			15: 'fifteen',
			16: 'sixteen',
			17: 'seventeen',
			18: 'eighteen',
			19: 'nineteen',
			20: 'twenty'
		};

		message = numberConversion[message];
		return message;
	}
	return message;


};
/**
 * Creates a new user and subscribes them to eventsub.
 * @param {{ username: string, uid: string }} user 
 * @param { boolean } joinEventSub
 * @returns { Promise<void> }
 */
exports.joinChannel = async ({ username, uid }, joinEventsub = true) => {
	const islive = 0;
	const liveemote = 'FeelsOkayMan';
	const offlineemote = 'FeelsBadMan';
	const gameTime = new Date().getTime();

	await sql.Query(`INSERT INTO Streamers 
        (username, uid, islive, liveemote, titleemote, gameemote, offlineemote, live_ping, title_ping, game_ping, game_time, emote_list, emote_removed, disabled_commands) 
            values 
        (?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, ?, ?, ?)`,
	[username, uid, islive, liveemote, liveemote, liveemote, offlineemote, '[""]', '[""]', '[""]', gameTime, '[]', '[]', '[]']
	);

    if (joinEventsub) {
        await this.joinEventSub(uid);
    }
};

/**
 * @param { String } command 
 * @param { String } channel WITHOUT # at the start
 */
exports.commandDisabled = async (command, channel) => {
    return await sql.Query('SELECT disabled_commands FROM Streamers WHERE username = ?', [channel])
    .then((data) => {
        const disabled = JSON.parse(data[0].disabled_commands);

        if (disabled.includes(command)) {
            return true;
        }
        return false;
    })
    .catch((e) => {
        console.log(`Error in commandDisabled: ${e}`);
        return false;
    });
};

/**
 * Adds a hidden character to the username, to prevent it from pinging the user.
 * @param { string } user 
 * @returns { string }
 */
exports.unpingUser = (user) =>`${user[0]}\u{E0000}${user.slice(1)}`;

/**
 * Fetch a list of chatters in a given chat.
 * !! Soon to be deprecated !!
 * @param { string } channel 
 * @returns { Promise<string[]> }
 */
exports.getChatters = async (channel) => {
    const list = [];
    const response = await got(`https://tmi.twitch.tv/group/user/${channel}/chatters`).json();
    const chatters = response.chatters;

    for (const chatter of Object.values(chatters)) {
        list.push(...chatter);
    }

    return list;
};

exports.optOutList = async (list, command, isIvr) => {
	return await sql.Query('SELECT opt_out FROM Commands WHERE Name = ?', [command])
	.then((data) => {
		const opted_out = JSON.parse(data[0].opt_out);
		
		list = (isIvr) ? list.filter(x => !opted_out.includes(x.login)) : list.filter(x => !opted_out.includes(x));
		return list;
	});
};