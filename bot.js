require('dotenv').config();
const tmi = require('tmi.js');
const login = require('./connect/connect.js');
const tools = require('./tools/tools.js');
const regex = require('./tools/regex.js');
const requireDir = require('require-dir');
const sql = require('./sql/index.js');
const positive_bot = require('./reminders/index.js');
let messageHandler = require('./tools/messageHandler.js').messageHandler;
const redis = require('./tools/redis.js');
const whisperHandler = require('./tools/whisperHandler.js').whisperHandler;

const cc = new tmi.client(login.TMISettings);

cc.on('message', onMessageHandler);
cc.on('connected', onConnectedHandler);
cc.on('pong', async (latency) => {
	console.log(latency);
	await sql.Query('INSERT INTO Latency (Latency) values (?)', [latency]);

});

cc.connect();


cc.on('notice', (channel, msgid, message) => {
	// Do your stuff.
	console.log(channel, msgid, message);
});

cc.on('automod', (channel, userstate, message) => {
	console.log({ channel, userstate, message });
	if (userstate === 'msg_rejected_mandatory' && channel !== '#kattah') {
		// eslint-disable-next-line
		new messageHandler(channel.replace('#', ''), `Could not reply due to the channel's moderation settings`).newMessage();
		return;
	}
});

onStart();

const prefix = process.env.TWITCH_PREFIX;

let uptime = new Date().getTime();

let activetrivia = {};
let triviaanswer = {};
let triviaHints = {};
let triviaHints2 = {};
let gothint = {};
let gothint2 = {};
let triviaTime = {};

let oldmessage = '';

// eslint-disable-next-line no-unused-vars
let userList = [];

/**
 * @param { String } channel - channel 
 * @param { import('tmi.js').ChatUserstate } user 
 * @param { String } msg 
 * @param { boolean } self 
 * @returns 
 */
async function onMessageHandler(channel, user, msg, self) {
	if (user['message-type'] === 'whisper') {
		return;
	}

	channel = channel.replace('#', '');
	let start = new Date().getTime();
	msg = msg.replaceAll(regex.invisChar, '').replaceAll('  ', '');

	/* if (!userList.includes(user.username) && user.username != null) {
         await tools.query('INSERT INTO Users (username, uid, permission) values (?, ?, ?)', [user.username, user["user-id"], 100]);
         userList.push(user.username);
         console.log(user.username);
     }*/
    //Temp exception for xqc's chat, since I want to test perfomance without the bot being able to respond there

	if (channel === 'pajlada' && user['user-id'] == 82008718 && msg === 'pajaS 🚨 ALERT') {
		cc.say(channel, '/me pajaLada 🚨 WHAT HAPPENED');
		return;
	}

    if (self || (user['user-id'] !== '425363834' && !activetrivia[channel] && !msg.toLowerCase().startsWith(prefix + ' '))) {
        return;
    }

	const offlineonly = await sql.Query('SELECT * FROM Streamers WHERE username=?', [channel]);

	if (offlineonly[0].offlineonly === 1 && offlineonly[0].islive === 1 && !await tools.isMod(user, channel)) {
		return;
	}

	if (activetrivia[channel]) {
		if (triviaHints2[channel] !== undefined) {
			let filteranswer = tools.transformNumbers(triviaanswer[channel].toLowerCase());
			let filtermsg = tools.transformNumbers(msg.toLowerCase());
			let similarity = await tools.similarity(filtermsg.toLowerCase(), filteranswer.toLowerCase());
			if (await similarity >= 0.8) {

				similarity = similarity * 100;
				similarity = similarity.toString().substring(0, 5);

				const ms = new Date().getTime() - triviaTime[channel];
				let time = parseInt(tools.humanizeDuration(ms));
				time = 60 - time;
				time = 1 + (time / 100);
				time = time.toString().substring(0, 4);
				time = parseFloat(time);

				let triviaScore = 1000;
				triviaScore = triviaScore * (Math.floor(similarity) / 100);
				triviaScore = triviaScore * time;
				if (gothint[channel] === false) {
					triviaScore = triviaScore * 2;
				}

				triviaScore = Math.round(triviaScore);

				new messageHandler(channel, `(Trivia) ${user.username}, Correct! You won the trivia! The correct answer was "${triviaanswer[channel]}"! (${similarity}% similarity) BroBalt You get +${triviaScore} points`).newMessage();
				let userchannel = [];
				userchannel.push(`"${user.username}"`);
				userchannel.push(`"${channel}"`);



				const alreadyJoined = await sql.Query(`
                    SELECT *
                    FROM MyPoints
                    WHERE username=?`,
				[`[${userchannel}]`]);

				if (!alreadyJoined.length) {
					await sql.Query('INSERT INTO MyPoints (username, points) values (?, ?)', [`[${userchannel}]`, triviaScore]);
				} else {
					triviaScore = triviaScore + alreadyJoined[0].points;
					await sql.Query('UPDATE MyPoints SET points=? WHERE username=?', [triviaScore, `[${userchannel}]`]);
				}

				delete activetrivia[channel];
				delete triviaanswer[channel];
				delete triviaHints2[channel];
				delete gothint[channel];
				delete triviaTime[channel];
				return;
			}

		} else {
			let similarity = await tools.similarity(msg.toLowerCase(), triviaanswer[channel].toLowerCase());
			if (await similarity >= 0.8) {

				similarity = similarity * 100;
				similarity = similarity.toString().substring(0, 5);

				const ms = new Date().getTime() - triviaTime[channel];
				let time = parseInt(tools.humanizeDuration(ms));
				time = 60 - time;
				time = 1 + (time / 100);
				time = time.toString().substring(0, 4);
				time = parseFloat(time);

				let triviaScore = 1000;
				triviaScore = triviaScore * (Math.floor(similarity) / 100);
				triviaScore = triviaScore * time;
				if (gothint[channel] === false && triviaHints[channel] !== 'FeelsDankMan you already got the hint.') {
					triviaScore = triviaScore * 2;
				}

				triviaScore = Math.round(triviaScore);

				new messageHandler(channel, `(Trivia) ${user.username}, Correct! You won the trivia! The correct answer was "${triviaanswer[channel]}"! (${similarity}% similarity) BroBalt You get +${triviaScore} points`).newMessage();
				let userchannel = [];
				userchannel.push(`"${user.username}"`);
				userchannel.push(`"${channel}"`);



				const alreadyJoined = await sql.Query(`
                SELECT *
                FROM MyPoints
                WHERE username=?`,
				[`[${userchannel}]`]);

				if (!alreadyJoined.length) {
					await sql.Query('INSERT INTO MyPoints (username, points) values (?, ?)', [`[${userchannel}]`, triviaScore]);
				} else {
					triviaScore = triviaScore + alreadyJoined[0].points;
					await sql.Query('UPDATE MyPoints SET points=? WHERE username=?', [triviaScore, `[${userchannel}]`]);
				}

				delete activetrivia[channel];
				delete triviaanswer[channel];
				delete triviaHints[channel];
				delete gothint[channel];
				delete triviaTime[channel];
				return;
			}
		}
	}

	let input = msg.split(' ');


    /*for (let i = 0; i < input.length; i++) {
        if (new RegExp(/[\uDB40-\uDC00]/).test(input[i])) {
            input[i] = input[i].replace(new RegExp(regex.HIDDEN_CHARACTERS, "");
            input[i] = input[i].replace(/\s\s+/g, ' ').trim();
            input[i] = input[i].replace("  ", "");
            input.splice(i)
        }
    }*/
    /* Positivebot cookies & cdr */
    {
        const mode = positive_bot.CONSTANTS.MODES;

        if (positive_bot.cookie.validateIsPositiveBot(user, input)) {
            const cookie = await positive_bot.cookie.allowedCookie(channel, input);
            if (cookie.Status === '') return; 

            const res = await positive_bot.cookie.setCookie(cookie.Status, cookie.User, channel, cookie.time, cookie.hasCdr);
            if (res.msg === '') return;

            new messageHandler(res.Channel, res.msg).newMessage();
			return;
        }
        else if (positive_bot.cdr.validateIsPositiveBot(user, input)) {
            const status = await positive_bot.cdr.setCdr(input, channel);
            const message = (dst, prefix = '', suffix = '') => new messageHandler(dst, `${prefix} I will remind you to use your cdr in 3 hours nymnOkey ${suffix}`).newMessage();
        
            /** @type { SQL.Cookies[] } */
            let [checkmode] = await sql.Query('SELECT Mode FROM Cookies WHERE User=?', [status.User]);
            if (!checkmode) return;
        
            if (await tools.commandDisabled('cdr', channel)) {
                if (status.Status === 'Confirmed' && checkmode.Mode === mode.whereAte) {
                    message(channel, status.User, '- (The channel you used your cdr in has reminders disabled)');
                    return;
                }
            } else if (status.Status === 'Confirmed') {
                switch (checkmode.Mode) {
                    case mode.whereAte: {
                        message(channel, status.User);
                        return;
                    }
                    case mode.ownChannel: {
                        message(status.User, status.User);
                        return;
                    }
                    case mode.botChannel: {
                        message('botbear1110', status.User);
                        return;
                    }
                    default: {
                        return;
                    }
                }
            }
        }
    }

	if (!msg.toLowerCase().startsWith(prefix + ' ') || input[1] === undefined) {
		return;
	}

	if (user.username === 'supibot') {
		new messageHandler(channel, ':tf: no').newMessage();
		return;
	}

	let aliascommand = input[1];
	input = await tools.Alias(msg);
	let realcommand = input[1].toLowerCase();
	if (realcommand === 'say' && realcommand === 'channel' && realcommand === 'emotecheck' && realcommand === 'cum' && realcommand === 'suggest' && realcommand === 'shit' && realcommand === 'code' && realcommand === 'test2') {
		input = input.join(' ');
	}

	
    const userList = await sql.Query('SELECT * FROM Users WHERE uid=?', [user['user-id']]);

    if (!userList.length && user.username != null) {
        await sql.Query('INSERT INTO Users (username, uid, permission) values (?, ?, ?)', [user.username, user['user-id'], 100]);
    } else if (user.username !== userList[0].username && user.username != null) {
        await sql.Query('UPDATE Users SET username=? WHERE uid=?', [user.username, user['user-id']]);
    }

	let disabledCheck = await sql.Query(`
    SELECT disabled_commands
    FROM Streamers
    WHERE username=?`,
	[channel]);

	disabledCheck = JSON.parse(disabledCheck[0].disabled_commands);

	if (disabledCheck.includes(realcommand)) {
		new messageHandler(channel, `${realcommand} is disabled in this chat :)`).newMessage();
		return;
	}

	let commands = requireDir('./commands');
	let customCommands = requireDir('./commands/customCommands');

	if ((typeof commands[realcommand] === 'undefined' && typeof customCommands[realcommand] === 'undefined') || (customCommands[realcommand]?.channelSpecific && customCommands[realcommand]?.activeChannel !== channel)) {
		console.log(channel, ': undefined - \'', input, '\'');
		return;
	}

	if(customCommands[realcommand]?.channelSpecific) {
		commands = customCommands;
	}

	const perm = await tools.getPerm(user.username);

	let commandCD = await sql.Query('SELECT Cooldown FROM Commands WHERE Name=?', [input[1]]);

	if (!commandCD[0].Cooldown) {
		commandCD = 3000;
	} else {
		commandCD = commandCD[0].Cooldown * 1000;					
	}

	const userCD = new tools.Cooldown(user, realcommand, commandCD);

	if ((await userCD.setCooldown(perm)).length) { return; }

	if (realcommand === 'hint' && activetrivia[channel] && gothint[channel] === false) {
		if (triviaHints2[channel] !== undefined && gothint2[channel] !== 1) {
			const ms = new Date().getTime() - triviaTime[channel];
			let timePassed = tools.humanizeDuration(ms);
			if (parseInt(timePassed) < 10) {
				new messageHandler(channel, 'You need to wait 10 seconds to get a hint.').newMessage();
				return;
			}
			let hintcount = 0;

			if (triviaHints2[channel][0] !== undefined && triviaHints2[channel][0]) {
				hintcount = 1;
			}
			if (triviaHints2[channel][1] !== undefined && triviaHints2[channel][1]) {
				if (hintcount === 0) {
					hintcount = 2;
				} else if (hintcount === 1) {
					hintcount = 3;
				}
			}

			if (gothint2[channel] === 0 && (hintcount !== 0 || hintcount !== 1)) {
				gothint2[channel] = 1;
			} else {
				gothint2[channel] = 0;
			}

			let hint = triviaHints2[channel][gothint2[channel]];
			if (hint === undefined || !hint) {
				if (gothint2[channel] === 0 && hintcount !== 2) {
					hint = 'There are no hints';
				} else if (hintcount === 1) {
					hint = 'No more hints';
				}
			}
			if (gothint2[channel] === 0 && hintcount === 3) {
				hint = hint + ' - (There is one more hint)';
			}

			if (hintcount === 2 && gothint2[channel] === 0) {
				hint = triviaHints2[channel][1];
				gothint2[channel] = 1;
			}

			if (hint === oldmessage) {
				hint = hint + ' 󠀀 ';
			}

			new messageHandler(channel, `(Trivia) ${user.username}, Hint: ${hint}`).newMessage();
			oldmessage = `(Trivia) ${user.username}, Hint: ${hint}`;
			return;
		} else if (!gothint2[channel]) {
			const ms = new Date().getTime() - triviaTime[channel];
			let timePassed = tools.humanizeDuration(ms);
			if (parseInt(timePassed) < 10) {
				new messageHandler(channel, 'You need to wait 10 seconds to get a hint.').newMessage();
				return;
			}
			gothint[channel] = true;

			let hint = triviaHints[channel];

			if (hint === oldmessage) {
				hint = hint + ' 󠀀 ';
			}

			new messageHandler(channel, `(Trivia) ${user.username}, Hint: ${hint}`).newMessage();
			oldmessage = `(Trivia) ${user.username}, Hint: ${hint}`;
			return;
		}
	}

	if (realcommand === 'trivia') {
		if (activetrivia[channel]) {
			new messageHandler(channel, 'There is already an active trivia').newMessage();
			return;
		}
		const isLive = await sql.Query('SELECT islive FROM Streamers WHERE username=?', [channel]);
		if (isLive[0].islive === 1) {
			return;
		}

		// Get cooldown from database.
		let cd = await sql.Query('SELECT `trivia_cooldowns` FROM `Streamers` WHERE `username` = ?', [channel]);

		// Set trivia cooldown if not set.
		if (cd[0].trivia_cooldowns === null) {
			cd[0].trivia_cooldowns === 30000;
			sql.Query('UPDATE `Streamers` SET `trivia_cooldowns` = 30000 WHERE `username` = ?', [channel]);
		}

		const triviaCD = new tools.Cooldown(channel, realcommand, cd[0].trivia_cooldowns);

		if ((await triviaCD.setCooldown(perm)).length && !await tools.isMod(user, channel)) {
			new messageHandler(channel, `Trivia is still on cooldown. Available in ${triviaCD.formattedTime()}`).newMessage();
			return;
		}
		let result = await commands[realcommand].execute(channel, user, input, perm);
		if (result[0] === 'F') {
			result = ['(Trivia) [ FeelsDankMan ] Question: nymnDank Something went wrong!?!', 'LULE WHO MADE THIS', 'This bot is so bad LuL', 'MegaLUL @hotbear1110'];
		}
		if (!result) {
			return;
		}

		triviaanswer[channel] = result[2];


		activetrivia[channel] = channel;

		triviaHints[channel] = result[1];

		let triviaTimeID = new Date().getTime();

		triviaTime[channel] = triviaTimeID;

		gothint[channel] = false;
		triviaTimeout(channel, triviaTimeID, result[2]);

		let response = result[0];

		if (response === oldmessage) {
			response = response + ' 󠀀 ';
		}

		new messageHandler(channel, response).newMessage();
		return;

	}

	if (realcommand === 'trivia2') {
		if (activetrivia[channel]) {
			new messageHandler(channel, 'There is already an active trivia').newMessage();
			return;
		}
		const isLive = await sql.Query('SELECT islive FROM Streamers WHERE username=?', [channel]);
		if (isLive[0].islive === 1) {
			return;
		}

		// Get cooldown from database.
		let cd = await sql.Query('SELECT `trivia_cooldowns` FROM `Streamers` WHERE `username` = ?', [channel]);

		// Set trivia cooldown if not set.
		if (cd[0].trivia_cooldowns === null) {
			cd[0].trivia_cooldowns === 30000;
			sql.Query('UPDATE `Streamers` SET `trivia_cooldowns` = 30000 WHERE `username` = ?', [channel]);
		}

		const triviaCD = new tools.Cooldown(channel, realcommand, cd[0].trivia_cooldowns);

		if ((await triviaCD.setCooldown(perm)).length && !await tools.isMod(user, channel)) {
			new messageHandler(channel, `Trivia is still on cooldown. Available in ${triviaCD.formattedTime()}`).newMessage();
			return;
		}

		let result = await commands[realcommand].execute(channel, user, input, perm);
		if (result[0] === 'F') {
			result = ['(Trivia) [ FeelsDankMan ] Question: nymnDank Something went wrong!?!', 'LULE WHO MADE THIS', 'This bot is so bad LuL', 'MegaLUL @hotbear1110'];
		}



		if (!result) {
			return;
		}

		triviaanswer[channel] = result[1];

		activetrivia[channel] = channel;

		triviaHints2[channel] = [result[2], result[3]];

		let triviaTimeID = new Date().getTime();

		triviaTime[channel] = triviaTimeID;

		gothint[channel] = false;
		gothint2[channel] = false;
		triviaTimeout(channel, triviaTimeID, result[1]);


		let response = result[0];

		if (response === oldmessage) {
			response = response + ' 󠀀 ';
		}

		new messageHandler(channel, response).newMessage();
		return;

	}

	let result = await commands[realcommand].execute(channel, user, input, perm, aliascommand);


	if (!result) {
		return;
	}

	result = tools.splitLine(result, 396);

	new messageHandler(channel, result[0], commands[realcommand].noBanphrase, commands[realcommand].showDelay, start, commands[realcommand].ping, user).newMessage();
	return;
}

async function onConnectedHandler(addr, port) {
	console.log(`* Connected to ${addr}:${port}`);
}

/**
 * Updates received from EventSub which should be sent in chat are handled here.
 * @param { import('./tools/redis.js').EventSubChatUpdate } Data
 */
const onChatUpdateHandler = async (Data) => {
    if (Data.Message) {
        Data.Message.every((msg, i) => 
		setTimeout(() => {
			new messageHandler(`${Data.Channel}`, msg, true, false, 0, false, null, Data.spamAllowed).newMessage();
			}, 10*i));
    }
};

// Karim/Backous module

cc.on('whisper', async function (from, user, msg, self) {
	from = from.replace('#', '');
	console.log(`User: ${from} - Msg: ${msg}`);
	// Don't listen to my own messages..
	if (self) return;

	let input = msg.split(' ');

	let channel = input[0].replace('#', '');

	input.shift();

	msg = input.join(' ');

	if (input[0] !== prefix || input[1] === undefined) {
		return;
	}

	let aliascommand = input[1];
	input = await tools.Alias(msg);
	let realcommand = input[1].toLowerCase();

	let commands = requireDir('./commands');
	let customCommands = requireDir('./commands/customCommands');

	if ((typeof commands[realcommand] === 'undefined' && typeof customCommands[realcommand] === 'undefined') || (customCommands[realcommand]?.channelSpecific && customCommands[realcommand]?.activeChannel !== channel)) {
		console.log(channel, ': undefined - \'', input, '\'');
		return;
	}

	if(customCommands[realcommand]?.channelSpecific) {
		commands = customCommands;
	}

	const perm = await tools.getPerm(from);

	if (!perm || perm < 500) {
		return;
	}

	let result = await commands[realcommand].execute(channel, user, input, perm, aliascommand);

	if (!result) {
		return;
	}

	result = tools.splitLine(result, 396);

	new whisperHandler(from, result).newWhisper();
	return;
});

cc.on('ban', (channel, username, reason, userstate) => {
	if (channel === 'nymn' || channel === '#nymn') {
		console.log('BANNED USER ' + channel, username, reason, userstate);
	}
});

async function triviaTimeout(channel, triviaTimeID, answer) {
    setTimeout(() => {
        if (activetrivia[channel]) {
            if (triviaTime[channel] === triviaTimeID) {
                delete activetrivia[channel];
                delete triviaanswer[channel];
                delete triviaHints[channel];

                new messageHandler(channel, `The trivia timed out after 60 seconds. The answer was: "${answer}"`).newMessage();
            }
        }
    }, 60000);
}

redis.Get().on('ChatUpdate', onChatUpdateHandler);

async function onStart() {
	userList = (await sql.Query('SELECT username FROM Users')).map(x => x.username);

		/*
            //TODO hotbear: This should be remade, so that it doesn't delete the streamer from db.
            //              The connect funtion would have to me remade aswell
                await tools.bannedStreamers()
            .then((res) => {
                res.map(async ([user]) => {
                    await cc.part(user)
                        .catch((err) => {
                            console.log(err);
                        });

                    new messageHandler("#botbear1110", `Left channel ${user}. Reason: Banned/deleted channel`).newMessage();
                })
            })
            .catch((err) => {
                console.log(err);
            });
        */


		if (process.env.TWITCH_USER !== 'devbear1110') {
			await tools.nameChanges()
				.then((res) => {
					res.map(async ([newName, oldName]) => {
						await cc.join(newName)
							.catch((err) => {
								console.log(err);
							});
						cc.part(oldName).catch((err) => {
							console.log(err);
						});

						cc.say(`#${newName}`, `Name change detected, ${oldName} -> ${newName}`);
						new messageHandler(process.env.TWITCH_USER, `Left channel ${oldName}. Reason: Name change detected, ${oldName} -> ${newName}`).newMessage();
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
		await tools.checkLiveStatus();
		await tools.checkTitleandGame();
}

module.exports = { cc, uptime, triviaanswer, activetrivia };