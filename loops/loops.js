require('dotenv').config();
const _ = require('underscore');
const { got } = require('./../got');
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
	const isSubbed = await got('https://api.7tv.app/v2/badges?user_identifier=twitch_id').json();

	for (let i = 0; i < streamers.length; i++) {
		setTimeout(async() => {
			const streamer = streamers[i];
			let Emote_list = JSON.parse(streamer.emote_list);
			let Emote_removed = JSON.parse(streamer.emote_removed);
			let noFFZ = 0;
			let noBTTV = 0;
			let noSTV = 0;

			let FFZ_list = '';
			let BTTV_list = '';
			let STV_list = '';


			try {
				const FFZ = await got(`https://api.frankerfacez.com/v1/room/id/${streamer.uid}`).json();

				if (!FFZ.room || (typeof FFZ.error != 'undefined') || !FFZ) {
					noFFZ = 1;
				} else {
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
				}

			} catch (err) {
				noFFZ = 1;

			}
			try {
				const BTTV = await got(`https://api.betterttv.net/3/cached/users/twitch/${streamer.uid}`).json();

				if ((typeof BTTV.message != 'undefined') || !BTTV) {
					noBTTV = 1;
				} else {
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
				}

			} catch (err) {
				noBTTV = 1;

			}
			try {
				const STV = await got(`https://api.7tv.app/v2/users/${streamer.uid}/emotes`).json();


				if ((typeof STV.message != 'undefined') || !STV) {
					noSTV = 1;
				} else {
					STV_list = STV;

					for (const emote of STV_list) {
						let inlist = 0;
	
						for (const emotecheck of Emote_list) {
							if (emotecheck.includes(emote['name']) && emotecheck.includes(emote['id'])) {
								inlist = 1;
								break;
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

			}, 1000*i);

	}
}, 600000);

/** TODO Refactor */
setInterval(async function () {
    const Time = new Date().getTime();
    
    const sendMessage = (dst, user, suffix = '') => new messageHandler(dst, `${user} Reminder to eat your cookie nymnOkey ${suffix}`).newMessage();
    
    /** @type { SQL.Cookies[] } */
	(await sql.Query('SELECT * FROM Cookies'))
        .map(async (user) => {
            if (user.RemindTime === null || user.RemindTime > Time) return;
            if (user.Status !== 'Confirmed' && user.Status !== 'Confirmed2') return;

            /** @type { SQL.Streamers[] } */
            const [stream] = await sql.Query('SELECT islive, username FROM Streamers WHERE username=?', [user.Channel]);
            await sql.Query('UPDATE Cookies SET Status=?, Channel=?, RemindTime=? WHERE User=?', [null, null, null, user.User]);

			//If the bot has been down for 5 or more min, then reminders that went off meanwhile wont trigger. This is to prevent spam.
			if (user.RemindTime + 300000 < Time) { return; }
			
            const channel = channelFromMode(user);

            let isDisabled  = false;
            if (stream !== null) {
                isDisabled = await commandDisabled('cookie', stream.username);
            }
            if (isDisabled) {
                sendMessage(channel, user.User, `- This reminder is from a channel that has disabled cookie reminders[${user.Channel}]`);
            } else if (stream?.islive) {
                sendMessage(channel, user.User, `- This reminder is from a channel that is live[${user.Channel}]`);
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
	const Time = new Date().getTime();

    const sendMessage = (dst, user, suffix = '') => new messageHandler(dst, `${user} Your cookie cdr is ready ${suffix}`).newMessage();
    
    /** @type { SQL.Cookies[] } */
    (await sql.Query('SELECT * FROM Cdr'))
    .map(async(user) => {
        if (user.RemindTime === null || user.RemindTime > Time) return;
        if (user.Status !== 'Confirmed') return;

        /** @type { SQL.Streamers[] } */
        const [stream] = await sql.Query('SELECT islive, username FROM Streamers WHERE username=?', [user.Channel]);

        await sql.Query('UPDATE Cdr SET Status=?, Channel=?, RemindTime=? WHERE User=?', [null, null, null, user.User]);

		//If the bot has been down for 5 or more min, then reminders that went off meanwhile wont trigger. This is to prevent spam.
		if (user.RemindTime + 300000 < Time) { return; }

        const channel = channelFromMode(user);
        let isDisabled = false;
        if (stream !== null) {
            isDisabled = await commandDisabled('cookie', stream.username);
        }
        if (isDisabled) {
            sendMessage(channel, user.User, `- This reminder is from a channel that has disabled cookie reminders[${user.Channel}]`);
        } else if (stream.islive) {
            sendMessage(channel, user.User, `- This reminder is from a channel that is live[${user.Channel}]`);
        } else {
            if (user.Mode === positive_bot.CONSTANTS.MODES.whereAte) {
                sendMessage(user.Channel, user.User);
            } else {
                sendMessage(channel, user.User);
            }
        }
        
    });

}, 10000);

if (process.env.SUPI_AUTH) {
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
}

/**
 * @param { SQL.Cookies } user 
 */
 const channelFromMode = (user) => {
    switch (user.Mode) {
        case positive_bot.CONSTANTS.MODES.whereAte:
        case positive_bot.CONSTANTS.MODES.ownChannel: {
            return `${user.User}`;
        }
        case positive_bot.CONSTANTS.MODES.botChannel: {
            return 'botbear1110'; // TODO change this to a configurable channel ?
        }
    }
};