require('dotenv').config();
const _ = require('underscore');
const got = require('got');
let messageHandler = require('../tools/messageHandler.js').messageHandler;
const sql = require('./../sql/index.js');
const { commandDisabled } = require('../tools/tools.js');
const positive_bot = require('./../reminders/index.js');

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		}
	}
}

sleep(10000);

setInterval(async function () {
	const streamers = await sql.Query('SELECT * FROM Streamers');

	for (const streamer of streamers) {
		setTimeout(async function () {

			let Emote_list = JSON.parse(streamer.emote_list);
			let Emote_removed = JSON.parse(streamer.emote_removed);
			let noFFZ = 0;
			let noBTTV = 0;
			let noSTV = 0;

			let FFZ_list = '';
			let BTTV_list = '';
			let STV_list = '';


			try {
				const FFZ = await got(`https://api.frankerfacez.com/v1/room/id/${streamer.uid}`, { timeout: 10000 }).json();

				if (!FFZ.room || (typeof FFZ.error != 'undefined') || !FFZ) {
					noFFZ = 1;
					return;
				}

				let set = FFZ.room.set;
				FFZ_list = FFZ.sets[`${set}`].emoticons;

				for (const emote of FFZ_list) {
					let inlist = 0;
					for (const emotecheck of Emote_list) {
						if (emotecheck.includes(emote['name']) && emotecheck.includes(emote['id'])) {
							inlist = 1;
						}
					}
					if (inlist === 0) {
						let time = new Date().getTime();
						let owner = emote['owner'];

						Emote_list.push([emote['name'], emote['id'], time, owner['name'], `https://www.frankerfacez.com/emoticon/${emote['id']}`, 'ffz']);
					}

				}

			} catch (err) {
				noFFZ = 1;

			}
			try {
				const BTTV = await got(`https://api.betterttv.net/3/cached/users/twitch/${streamer.uid}`, { timeout: 10000 }).json();

				if ((typeof BTTV.message != 'undefined') || !BTTV) {
					noBTTV = 1;
					return;
				}

				BTTV_list = BTTV['channelEmotes'].concat(BTTV['sharedEmotes']);

				for (const emote of BTTV_list) {
					let inlist = 0;
					for (const emotecheck of Emote_list) {
						if (emotecheck.includes(emote['code']) && emotecheck.includes(emote['id'])) {
							inlist = 1;
						}
					}
					if (inlist === 0) {
						let time = new Date().getTime();
						let owner = streamer.username;
						if (emote['user']) {
							owner = emote['user'];
							owner = owner['name'];
						}

						Emote_list.push([emote['code'], emote['id'], time, owner, `https://betterttv.com/emotes/${emote['id']}`, 'bttv']);
					}

				}
			} catch (err) {
				noBTTV = 1;

			}
			try {
				const STV = await got(`https://api.7tv.app/v2/users/${streamer.uid}/emotes`, { timeout: 10000 }).json();


				if ((typeof STV.message != 'undefined') || !STV) {
					noSTV = 1;
					return;
				}

				STV_list = STV;

				for (const emote of STV_list) {
					let inlist = 0;

					for (const emotecheck of Emote_list) {
						if (emotecheck.includes(emote['name']) && emotecheck.includes(emote['id'])) {
							inlist = 1;
							return;
						}
					}
					if (inlist === 0) {
						let time = new Date().getTime();
						let owner = emote['owner'];
						let zero_Width = '7tv';
						if (emote['visibility_simple'][0] === 'ZERO_WIDTH') {
							zero_Width = '7tv_ZERO_WIDTH';
						}

						Emote_list.push([emote['name'], emote['id'], time, owner['login'], `https://7tv.app/emotes/${emote['id']}`, zero_Width]);
					}

				}
			} catch (err) {
				noSTV = 1;

			}

			for (const emote of Emote_list) {
				let inlist = 0;
				if (noFFZ === 0) {
					for (const emotecheck of FFZ_list) {
						if (emotecheck['id'] == emote[1] && emotecheck['name'] === emote[0]) {
							inlist = 1;
							break;
						}
					}
				}

				if (noBTTV === 0 && inlist === 0) {
					for (const emotecheck of BTTV_list) {
						if (emotecheck['id'] == emote[1] && emotecheck['code'] === emote[0]) {
							inlist = 1;
							break;
						}
					}
				}

				if (noSTV === 0 && inlist === 0) {
					for (const emotecheck of STV_list) {
						if (emotecheck['id'] == emote[1] && emotecheck['name'] === emote[0]) {
							inlist = 1;
							break;
						}
					}
				}
				if (inlist === 0 && noFFZ === 0 && noBTTV === 0 && noSTV === 0) {
					let time = new Date().getTime();

					Emote_removed.push([emote[0], emote[1], time, [emote[5]]]);

					// hotbear1110 - TODO: Look at a way to do this without the underscore package
					Emote_list = _.without(Emote_list, emote);
				}

			}

			Emote_list = JSON.stringify(Emote_list);
			Emote_removed = JSON.stringify(Emote_removed);
			await sql.Query('UPDATE Streamers SET emote_list=? WHERE username=?', [Emote_list, streamer.username]);
			await sql.Query('UPDATE Streamers SET emote_removed=? WHERE username=?', [Emote_removed, streamer.username]);

			const isSubbed = await got('https://api.7tv.app/v2/badges?user_identifier=twitch_id', { timeout: 10000 }).json();

			let foundName = false;
			for (const badge of isSubbed['badges']) {
				if (badge['name'].split(' ').includes('Subscriber')) {
					let users = badge['users'];
					if (users.includes(streamer.uid.toString())) {
						foundName = true;
						await sql.Query('UPDATE Streamers SET seventv_sub=? WHERE username=?', [1, streamer.username]);
					}
				}
			}

			if (foundName === false) {
				await sql.Query('UPDATE Streamers SET seventv_sub=? WHERE username=?', [0, streamer.username]);
			}
		}, 200);
	}
}, 300000);

/** TODO Refactor */
setInterval(async function () {
    const Time = new Date().getTime();
    
    const sendMessage = (dst, user, suffix = '') => new messageHandler(dst, `${user} Reminder to eat your cookie nymnOkay ${suffix}`).newMessage();
    
    /** @type { SQL.Cookies[] } */
	(await sql.Query('SELECT * FROM Cookies'))
        .map(async (user) => {
            if (user.RemindTime === null || user.RemindTime < Time) return;
            if (user.Status !== 'Confirmed' || user.Status !== 'Confirmed2') return;

            /** @type { SQL.Streamers[] } */
            const [stream] = await sql.Query('SELECT islive FROM Streamers WHERE username=?', [user.Channel.substring(1)]);
            if (stream === null) return;

            await sql.Query('UPDATE Cookies SET Status=?, Channel=?, RemindTime=? WHERE User=?', [null, null, null, user.User]);

            const channel = channelFromMode(user);
            
            const isDisabled = await commandDisabled('cookie', stream.username);
            if (isDisabled) {
                sendMessage(channel, user.User, `- This reminder is from a channel that has disabled cookie reminders[${user.Channel.replace('#', '')}]`);
            } else if (stream.islive) {
                sendMessage(channel, user.User, `- This reminder is from a channel that is live[${user.Channel.replace('#', '')}]`);
            } else {
                if (user.Mode === positive_bot.CONSTANTS.MODES.whereAte) {
                    sendMessage(user.Channel, user.User);
                } else {
                    sendMessage(channel, user.User);
                }
            }
    });
}, 10000);

setInterval(async function () {
	const users = await sql.Query('SELECT * FROM Cdr');
	let Time = new Date().getTime();

	for (const User of users) {
		if (User.RemindTime !== null && User.RemindTime < Time && User.Status === 'Confirmed') {
			const stream = await sql.Query('SELECT * FROM Streamers WHERE username=?', [User.Channel.substring(1)]);
			let disabledCommands = JSON.parse(stream[0].disabled_commands);

			await sql.Query('UPDATE Cdr SET Status=?, Channel=?, RemindTime=? WHERE User=?', [null, null, null, User.User]);
            
			if (User.Mode === 0) {
				if (disabledCommands.includes('cdr')) {
					new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that has disabled cookie reminders[${User.Channel}]`).newMessage();

				} else if (stream[0].islive === 1) {
					new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that is live[${User.Channel}]`).newMessage();

				} else {
					new messageHandler(User.Channel, `${User.User} Your cookie cdr is ready`).newMessage();
				}

			} else if (User.Mode === 1) {
				if (disabledCommands.includes('cookie')) {
					new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that has disabled cdr reminders[${User.Channel}]`).newMessage();

				} else if (stream[0].islive === 1) {
					new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that is live[${User.Channel}]`).newMessage();

				} else {
					new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready`).newMessage();

				}
			} else if (User.Mode === 2) {
				if (disabledCommands.includes('cdr')) {
					new messageHandler('#botbear1110', `${User.User} Your cookie cdr is ready - This reminder is from a channel that has disabled cookie reminders[${User.Channel}]`).newMessage();

				} else if (stream[0].islive === 1) {
					new messageHandler('#botbear1110', `${User.User} Your cookie cdr is ready - This reminder is from a channel that is live[${User.Channel}]`).newMessage();

				} else {
					new messageHandler('#botbear1110', `${User.User} Your cookie cdr is ready`).newMessage();
				}
			}
		}

	}

}, 10000);

setInterval(async function () {
	try {
		await got('https://supinic.com/api/bot-program/bot/active', {
			headers: { Authorization: `Basic ${process.env.SUPI_USERID}:${process.env.SUPI_AUTH}` },
			method: 'PUT'
		}).json();
	} catch (err) {
		console.log(err);
	}
}, 600000);

/**
 * @param { SQL.Cookies } user 
 */
 const channelFromMode = (user) => {
    switch (user.Mode) {
        case positive_bot.CONSTANTS.MODES.whereAte:
        case positive_bot.CONSTANTS.MODES.ownChannel: {
            return `#${user.User}`;
        }
        case positive_bot.CONSTANTS.MODES.botChannel: {
            return '#botbear1110'; // TODO change this to a configurable channel ?
        }
    }
};