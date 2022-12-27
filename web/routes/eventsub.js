module.exports = (async function() {
    const crypto = require('crypto');
    const tools = require('./../../tools/tools.js');
    const sql = require('./../../sql/index.js');
    const Redis = require('./../../tools/redis.js');
        
    // Notification request headers
    const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
    const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
    const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
    const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

    // Notification message types
    const MESSAGE_TYPE_NOTIFICATION = 'notification';
    const MESSAGE_TYPE_REVOCATION = 'revocation';

    // Prepend this string to the HMAC that's created from the message
    const HMAC_PREFIX = 'sha256=';
    
    /**
     * @typedef { Object } EventSubSubcription
     * @property {string} id
     * @property {string} status
     * @property {string} type
     * @property {string} version
     * @property {number} cost
     * @property {object} condition
     * @property {string} condition.broadcaster_user_id
     * @property {object} transport
     * @property {string} transport.method
     * @property {string} transport.callback
     * @property {string} created_at
     */

    /**
     * @typedef { Object } EventSubNotification
     * @property { EventSubSubcription } subscription
     * @property { string= } challenge
     * @property { Object } event
     */

    /**
     * @callback EventSubCallback
     * @param { EventSubNotification } notification
     * @returns { Promise<import('./../../tools/redis.js').PubSubResponse | void> }
     */

    const express = require('express');
    const router = express.Router();

    router.use(express.raw({
        type: 'application/json'
    }));
    
    /* /eventsub */
    router.post('/', async (req, res) => {
        if (req.headers[TWITCH_MESSAGE_SIGNATURE] === undefined) {
            res.status(400).end();
            return;
        }

        const hmac = HMAC_PREFIX + getHmac(getSecret(), getHmacMessage(req));
    
        if (!verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
            return res.sendStatus(403);
        }

        res.setHeader('Content-Type', 'text/plain');

        /** @type { EventSubNotification } */
        const notification = JSON.parse(req.body);

        /// This is sent from twitch when you subscribe to an event
        /// We respond with the challenge to prove that we're the one who's subscribed
        if (notification.challenge) {
            res.send(Buffer.from(notification.challenge));
            return;
        }
        res.status(204);
        
        switch (req.headers[MESSAGE_TYPE]) {
            case MESSAGE_TYPE_NOTIFICATION: {
                        
                console.debug(`Event type: ${notification.subscription.type}`);
                console.debug(notification.event);

                const cb = SUBSCRIPTION_TYPES[notification.subscription.type];
                if (!cb) {
                    console.error(`Unknown subscription type: ${notification.subscription.type}`);
                    return;
                }

                cb(notification)
                    .then((result) => {
                        if (!result) {
                            return;
                        }

                        /// We have parsed the event, and can send the result to the Bot.
                        Redis.Get().Publish('EventSub', result);
                    })
                    .catch((error) => {
                        console.error(`Error processing event: ${error}`);
                    });

                break;
            }
            case MESSAGE_TYPE_REVOCATION: {
                console.warn(`${notification.subscription.type} notifications revoked!`);
                console.warn(`reason: ${notification.subscription.status}`);
                console.warn(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
                break;
            }
            default: {
                console.warn(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
                break;
            }
        }
        return res.end();
    });

    /** @type { Object.<string, EventSubCallback> } */  
    const SUBSCRIPTION_TYPES = {
        'channel.update': async (notification) => {
            /** @type { SQL.Streamers[] } */
            const [streamer] = await sql.Query('SELECT * FROM Streamers WHERE uid=?', notification.event.broadcaster_user_id);
            if (!streamer) return;
            const myping = await sql.Query('SELECT * FROM MyPing');

            const notifyDisabled = await tools.commandDisabled('notify', streamer.username);

            const spamAllowed = (streamer.spamAllowed === 1);
                        
            const newTitle = notification.event.title;
            const titleusers = JSON.parse(streamer.title_ping).
                                filter(Boolean).
                                join(' ');

            let newGame = notification.event.category_name;
            let gameusers = JSON.parse(streamer.game_ping);

            for (const userchanel of myping) {
                let pingname = JSON.parse(userchanel.username);
                let gamename = userchanel.game_pings;
                if (pingname.includes(streamer.username) && gamename.includes(newGame) && newGame !== '') {
                    gameusers.push(pingname[0]);
                }
            }

            gameusers = gameusers.
                        filter(Boolean).
                        join(' ');

            let channel = streamer.username;
            if (streamer.username === 'forsen') {
                channel = 'botbear1110';
            }

            const response = [];
            
            if (newTitle !== streamer.title) {
                let titleuserlist = '';
                //temp edit
                if (channel === 'yabbe') {
                    titleuserlist = tools.splitLine(titleusers, 290 - newTitle.length);
                } else {
                    titleuserlist = tools.splitLine(titleusers, 430 - newTitle.length);
                }
                console.log(titleuserlist);
                let titleTime = new Date().getTime();
                console.log(streamer.username + ' NEW TITLE: ' + newTitle);
                await sql.Query('UPDATE Streamers SET title=?, title_time=? WHERE username=?', [newTitle, titleTime, streamer.username]);
                if (!notifyDisabled || channel === 'botbear1110') {
                    if (titleusers.length) {
                        channelUpdateTemplate(streamer.titleemote, 'TITLE', newTitle, titleuserlist).map((r) => response.push(r));
                    }
                }
            }

            if (newGame !== streamer.game) {
                //temp edit
                let gameuserlist = '';
                if (channel === 'yabbe') {
                    gameuserlist = tools.splitLine(gameusers, 290 - newGame.length);
                } else {
                    gameuserlist = tools.splitLine(gameusers, 430 - newGame.length);
                }
                let gameTime = new Date().getTime();
                console.log(gameusers);
                await sql.Query('UPDATE StreamerSET game=?, game_time=? WHERE username=?', [newGame, gameTime, streamer.username]);

                console.log(streamer.username + ' NEW GAME: ' + newGame);
                if (!notifyDisabled || channel === 'botbear1110') {
                    if (gameusers.length) {
                        channelUpdateTemplate(streamer.gameemote, 'GAME', newGame, gameuserlist).map((r) => response.push(r));
                    }
                }
            }
            return {
                Type: 'ChatUpdate',
                Data: {
                    Channel: channel,
                    Message: response,
                    spamAllowed: spamAllowed,
                }
            };
        },
        'stream.online': async (notification) => {
            /** @type { SQL.Streamers[] } */
            const [streamer] = await sql.Query('SELECT * FROM Streamers WHERE uid=?', notification.event.broadcaster_user_id);
            if (!streamer) return;

            const notifyDisabled = await tools.commandDisabled('notify', streamer.username);
            
            const spamAllowed = (streamer.spamAllowed === 1);

            const users = JSON.parse(streamer.live_ping).
                            filter(Boolean).
                            join(' ');

            let channel = streamer.username;
            if (streamer.username === 'forsen') {
                channel = 'botbear1110';
            }
            //temp edit
            let userlist = '';
            if (channel === 'yabbe') {
                userlist = tools.splitLine(users, 290);
            } else {
                userlist = tools.splitLine(users, 350);
            }
            console.log(streamer.username + ' IS NOW LIVE');
            await sql.Query('UPDATE Streamers SET islive = 1 WHERE username = ?' , [streamer.username]);
            if (!notifyDisabled || channel === 'botbear1110') {
                if (users.length) {
                    return {
                        Type: 'ChatUpdate',
                        Data: {
                            Channel: channel,
                            Message: streamUpdateTemplate(streamer.liveemote, streamer.username, 'LIVE', userlist),
                            spamAllowed:  spamAllowed,
                        }
                    };
                }
            }
            return;
        },
        'stream.offline': async (notification) => {
            /** @type { SQL.Streamers[] } */
            const [streamer] = await sql.Query('SELECT * FROM Streamers WHERE uid=?', notification.event.broadcaster_user_id);
            if (!streamer) return;
            
            const notifyDisabled = await tools.commandDisabled('notify', streamer.username);

            const spamAllowed = (streamer.spamAllowed === 1);

            const users = JSON.parse(streamer.offline_ping).
                                filter(Boolean).
                                join(' ');

            let channel = streamer.username;
            if (streamer.username === 'forsen') {
                channel = 'botbear1110';
            }
            //temp edit
            let userlist = '';
            if (channel === 'yabbe') {
                userlist = tools.splitLine(users, 290);
            } else {
                userlist = tools.splitLine(users, 350);
            }
            console.log(streamer.username + ' IS NOW OFFLINE');
            await sql.Query('UPDATE Streamers SET islive = 0 WHERE username = ? ', [streamer.username]);
            if (!notifyDisabled || channel === 'botbear1110') {
                if (users.length) {
                    return {
                        Type: 'ChatUpdate',
                        Data: {
                            Channel: channel,
                            Message: streamUpdateTemplate(streamer.offlineemote, streamer.username, 'OFFLINE', userlist),
                            spamAllowed: spamAllowed,
                        }
                    };
                }
            }
            return;
        },
    };

    /**
     * @param { string } emote 
     * @param { 'GAME' | 'TITLE' } type 
     * @param { string } event 
     * @param { string[] } users 
     */
    const channelUpdateTemplate = (emote, type, event, users) => {
        return users.map((split) => `/me ${emote} NEW ${type} ! ${emote} 👉 ${event} 👉 ${split}`);
    };

    /**
     * @param { string } emote 
     * @param { string } streamer
     * @param { 'LIVE' | 'OFFLINE' } type 
     * @param { string[] } users 
     */
    const streamUpdateTemplate = (emote, streamer, type, users) => {
        return users.map((split) => `/me ${emote} ${tools.unpingUser(streamer.toUpperCase())} IS NOW ${type} ${emote} ${split}`);
    };

    const getSecret = () => process.env.TWITCH_SECRET;

    /** Build the message used to get the HMAC. */
    const getHmacMessage = (request) => (request.headers[TWITCH_MESSAGE_ID] +
                                        request.headers[TWITCH_MESSAGE_TIMESTAMP] +
                                        request.body);

    /** Get the HMAC. */
    const getHmac = (secret, message) => crypto.createHmac('sha256', secret)
                                                .update(message)
                                                .digest('hex');

    /** Verify whether our hash matches the hash that Twitch passed in the header. */
    const verifyMessage = (hmac, verifySignature) => crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));

    return router;
})();
