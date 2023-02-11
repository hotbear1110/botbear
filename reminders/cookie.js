const { got } = require('./../got');
const sql = require('../sql/index.js');
const { commandDisabled, humanizeDuration } = require('./../tools/tools.js');
const CONSTANTS = require('./constants.js');

const RANKUP_MESSAGES = [
    'ranked up', // !rankup success 
    'reset your rank', // !prestige success
    'rankup', // !rankup fail
    'ranked high enough', // !prestige fail
    'you are currently rank', // !rank
];

/**
 * @typedef { Object } CooldownRes
 * @property { String | void } error - indicates an 4xx, 5xx error
 * @property { String } interval_formatted - time between cdr formatted as a string
 * @property { number } interval_unformatted - time between cdr unformatted as a number
 * @property { number | String } time_left_formatted - 0 if there is no cooldown. Otherwise, the time left formatted as a string
 * @property { number | String } time_left_unformatted - 0 if there is no cooldown. Otherwise, the time formatted as HH:MM:SS
 * @property { number } seconds_left - 0 if there is no cooldown. Otherwise, float of seconds left
 * @property { boolean } can_claim - wether or not the user can claim a cookie
 */

/**
 * @typedef { 'Confirmed' | 'Confirmed2' | 'CD' | '' } CookieStatus
 */

/**
 * 
 * @param { import("tmi.js").ChatUserstate } user 
 * @param { String[] } input 
 * @returns { boolean }
 */
 exports.validateIsPositiveBot = (user, input) => {
    if (user['user-id'] !== CONSTANTS.POSITIVE_BOT) {
        return false;
    }

    const joined = input.join(' ').replace(/user.username/g, '');

    return !(input[0] !== '[Cookies]' || RANKUP_MESSAGES.some(msg => joined.includes(msg)));
};

/**
 * @param { String } channel 
 * @param { import("tmi.js").ChatUserstate } user 
 * @param { String[] } input 
 * @returns { Promise<{ Status: CookieStatus, User: String, hasCdr: boolean, time?: string }> }
 */
exports.allowedCookie = async (channel, input) => {
    if (input[3] === 'Leaderboard') return { Status: '', User: '', hasCdr: false };

    if (await commandDisabled('cookie', channel)) return { Status: '', User: '', hasCdr: false };


    // TODO Melon would prefer if this was the ID of the user
    // as it would prevent name change conflicts.
    // The api allows for uids, by passing it ?id=true
    
    /** @type { SQL.Cdr[] } */
    const [users] = 
        await sql.Query(`SELECT RemindTime, Status, User
                        FROM Cookies 
                        WHERE User = ? 
                            OR User = ?
                            OR User = ?`, 
        [input[3], input[2], input[1].replace(',', '')]);
    if (!users) return { Status: '', User: '', hasCdr: false };

    const realuser = users.User;
    const remindtime = Date.now() + 7200000;
    let cdr = false;

    const [cdr_user] = await sql.Query('SELECT RemindTime FROM Cdr WHERE User = ?', [realuser]);

    if (cdr_user && cdr_user.RemindTime === null) {
        cdr = true;
    } else {
        try {
            /** @type { CooldownRes } */
            let res = await got(CONSTANTS.API(`cooldown/${realuser}`)).json();
            cdr = res.cdr_available;

        } catch (e) {
            console.log(`Error fetching cdr for ${realuser} : ${e}`);
            cdr = false;
        }
    }

    const msg = input
                .join(' ')
                .replace(',', ' ');

    let response = 'Confirmed';
                
    /* Fetch data from PositiveBot api */
    if (msg.includes(CONSTANTS.ALREADY_CLAIMED)) {
        let time_left = '';
        if (users.RemindTime === null) {
            try {
                /** @type { CooldownRes } */
                let res = await got(CONSTANTS.API(`cooldown/${realuser}`)).json();
                time_left = humanizeDuration(res.seconds_left * 1000);

            } catch (e) {
                console.log(`Error fetching cooldown for ${realuser} : ${e}`);
                return { Status: '', User: '', hasCdr: false };
            }
        } else {
            time_left = humanizeDuration(users.RemindTime - Date.now());
        }
            return { Status: 'CD', User: realuser, hasCdr: cdr, time: time_left };
    } else if (users.Status === 'Confirmed' || users.Status === 'Confirmed2')
        response = 'Confirmed2';

    await sql.Query(`
        UPDATE Cookies
        SET Status = ?,
            Channel = ?,
            RemindTime = ?
        WHERE User = ?
    `, [response, channel, remindtime, realuser]);

    return { Status: response, User: realuser, hasCdr: cdr };
};

/**
 * @param { CookieStatus } status 
 * @param { String } channel - Without # prefix 
 * @param { number } remindtime 
 * @param { String } user
 * @returns { Promise<{Channel: String, msg: String}> }
 */
exports.setCookie = async (status, user, channel, remindtime, cdr) => {
    /** @type { SQL.Cookies[] } */
    let [checkmode] = await sql.Query('SELECT Mode FROM Cookies WHERE User=?', [user]);
    if (checkmode === null) return { Channel: '', msg: '' };

    const CorrectChannel = channelFromMode(checkmode.Mode, channel, user);

    const sendMessage = (user, msg) => `${user} ${msg}`;
    const cdrSendMessage = (user, msg) => `${user} ${msg} (You have a cdr ready!)`;
    const disabledSendMessage = (user, msg) => `${user} ${msg} - (The channel you ate your cookie in has reminders turned off)`;

    if (await commandDisabled('cookie', channel)) {

        if (checkmode.Mode !== CONSTANTS.MODES.whereAte) return;
        
        switch (status) {
            case 'Confirmed': {
                if (cdr) {
                    return { Channel: CorrectChannel, msg: disabledSendMessage(user, 'I will remind you to eat your cookie in 2 hours nymnOkey (You have a cdr ready!)') };
        
                } else {
                    return { Channel: CorrectChannel, msg: disabledSendMessage(user, 'I will remind you to eat your cookie in 2 hours nymnOkey') };
                }
            }
            case 'Confirmed2': {
                return { Channel: CorrectChannel, msg: disabledSendMessage(user, 'I updated your reminder and will remind you to eat your cookie in 2 hours nymnOkey') };
            }
            case 'CD': {
                return { Channel: CorrectChannel, msg: disabledSendMessage(user, `Your cookie is still on cooldown, it will be available in ${remindtime}`) };
            }
        }
    }
    switch (status) {
        case 'Confirmed': {
            if (cdr) {
                return { Channel: CorrectChannel, msg: cdrSendMessage(user, 'I will remind you to eat your cookie in 2 hours nymnOkey') };
    
            } else {
                return { Channel: CorrectChannel, msg: sendMessage(user, 'I will remind you to eat your cookie in 2 hours nymnOkey') };
            }
        }

        case 'Confirmed2': {
            return { Channel: CorrectChannel, msg: sendMessage(user, 'I updated your reminder and will remind you to eat your cookie in 2 hours nymnOkey') };
        }

        case 'CD': {
            return { Channel: CorrectChannel, msg: sendMessage(user, `Your cookie is still on cooldown, it will be available in ${remindtime}`) };
        }
    }
};

const channelFromMode = (mode, channel, user) => {
    switch (mode) {
        case CONSTANTS.MODES.whereAte: {
            return channel;
        }
        case CONSTANTS.MODES.ownChannel: {
            return `${user}`;
        }
        case CONSTANTS.MODES.botChannel: {
            return 'botbear1110'; // TODO change this to a configurable channel ?
        }
    }
};
