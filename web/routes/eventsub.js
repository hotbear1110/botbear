module.exports = (async function() {
    const crypto = require('crypto');
    const tools = require('./../../tools/tools.js');
    const sql = require('./../sql/index.js');
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

    // Need raw message body for signature verification
    router.use(express.raw({
        type: 'application/json'
    }));
    
    /* /eventsub */
    router.post('/', async function (req, res) {
        const secret = getSecret();
        const message = getHmacMessage(req);
        const hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare
    
        if (!verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
            return res.sendStatus(403).end();
        }

        res.sendStatus(204);
        
        /** @type { EventSubNotification } */
        const notification = JSON.parse(req.body);

        /// This is sent from twitch when you subscribe to an event
        /// We respond with the challenge to prove that we're the one who's subscribed
        if (notification.challenge) {
            res.setHeader('Content-Type', 'text/plain');
            res.send(notification.challenge);
            return;
        }
    
        switch (req.headers[MESSAGE_TYPE]) {
            case MESSAGE_TYPE_NOTIFICATION: {
                        
                console.debug(`Event type: ${notification.subscription.type}`);
                console.debug(JSON.stringify(notification.event, null, 4));

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

                return;
            }
            case MESSAGE_TYPE_REVOCATION: {
                console.warn(`${notification.subscription.type} notifications revoked!`);
                console.warn(`reason: ${notification.subscription.status}`);
                console.warn(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
                return;
            }
            default: {
                console.warn(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
                return;
                
            }
        }
    });

    /** @type { Object.<string, EventSubCallback> } */  
    const SUBSCRIPTION_TYPES = {
        'channel.update': async (notification) => {
            /** @type { SQL.Streamers[] } */
            const [streamer] = await sql.Query('SELECT * FROM Streamers WHERE uid=?', notification.event.broadcaster_user_id);
            if (!streamer) return;
            const myping = await sql.Query('SELECT * FROM MyPing');

            const notifyDisabled = await tools.commandDisabled('notify', streamer.username);
            
            const newTitle = notification.event.title;
            const titleusers = JSON.parse(streamer.title_ping).
                                toString().
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
                        toString().
                        filter(Boolean).
                        join(' ');

            let channel = streamer.username;
            if (streamer.username === 'forsen') {
                channel = 'botbear1110';
            }

            if (newTitle !== streamer.title) {
                let titleuserlist = '';
                //temp edit
                if (channel === 'yabbe') {
                    titleuserlist = tools.splitLine(titleusers, 290 - newTitle.length);
                } else {
                    titleuserlist = tools.splitLine(titleusers, 400);
                }
                let titleTime = new Date().getTime();
                console.log(streamer.username + ' NEW TITLE: ' + newTitle);
                await sql.Query('UPDATE Streamers SET title=?, title_time=? WHERE username=?', [newTitle, titleTime, streamer.username]);
                if (!notifyDisabled || channel === 'botbear1110') {
                    if (titleusers.length) {
                        return {
                            Type: 'channel.update',
                            Data: { 
                                Channel: channel,
                                Message: channelUpdateTemplate(streamer.titleemote, 'TITLE', newTitle, titleuserlist)
                            }
                        };
                    }
                }
            }

            if (newGame !== streamer[0].game) {
                //temp edit
                let gameuserlist = '';
                if (channel === 'yabbe') {
                    gameuserlist = tools.splitLine(gameusers, 290 - newGame.length);
                } else {
                    gameuserlist = tools.splitLine(gameusers, 400);
                }
                let gameTime = new Date().getTime();

                await sql.Query('UPDATE Streamers SET game=?, game_time=? WHERE username=?', [newGame, gameTime, streamer.username]);

                console.log(streamer.username + ' NEW GAME: ' + newGame);
                if (!notifyDisabled || channel === 'botbear1110') {
                    if (gameusers.length) {
                        return {
                            Type: 'channel.update',
                            Data: {
                                Channel: channel,
                                Message: channelUpdateTemplate(streamer.gameemote, 'GAME', newGame, gameuserlist)
                            }
                        };
                    }
                }
            }
        },
        'stream.online': async (notification) => {
            const streamers = await sql.Query('SELECT * FROM Streamers WHERE uid=?', notification.event.broadcaster_user_id);

            let disabledCommands = JSON.parse(streamers[0].disabled_commands);

            let users = JSON.parse(streamers[0].live_ping);
            users = users.toString().replaceAll(',', ' ');

            let proxychannel = streamers[0].username;
            if (streamers[0].username === 'forsen') {
                proxychannel = 'botbear1110';
            }
            //temp edit
            let userlist = '';
            if (proxychannel === 'yabbe') {
                userlist = tools.splitLine(users, 290);
            } else {
                userlist = tools.splitLine(users, 350);
            }
            console.log(streamers[0].username + ' IS NOW LIVE');
            await sql.Query(`UPDATE Streamers SET islive = 1 WHERE username = "${streamers[0].username}"`);
            if (!disabledCommands.includes('notify') || proxychannel === 'botbear1110') {
                if (users.length) {
                    userlist.forEach(function (msg, i) {
                        // new messageHandler(`${proxychannel}`, `/me ${streamers[0].liveemote} ${streamers[0].username[0].toUpperCase()}\u{E0000}${streamers[0].username.toUpperCase().slice(1)} IS NOW LIVE ${streamers[0].liveemote} ${userlist[i]}`, true).newMessage();
                    });
                }
            }
        },
        'stream.offline': async (notification) => {
            const streamers = await sql.Query('SELECT * FROM Streamers WHERE uid=?', notification.event.broadcaster_user_id);

            let disabledCommands = JSON.parse(streamers[0].disabled_commands);

            let users = JSON.parse(streamers[0].offline_ping);
            users = users.toString().replaceAll(',', ' ');

            let proxychannel = streamers[0].username;
            if (streamers[0].username === 'forsen') {
                proxychannel = 'botbear1110';
            }
            //temp edit
            let userlist = '';
            if (proxychannel === 'yabbe') {
                userlist = tools.splitLine(users, 290);
            } else {
                userlist = tools.splitLine(users, 350);
            }
            console.log(streamers[0].username + ' IS NOW OFFLINE');
            await sql.Query(`UPDATE Streamers SET islive = 0 WHERE username ="${streamers[0].username}"`);
            if (!disabledCommands.includes('notify') || proxychannel === 'botbear1110') {
                if (users.length) {
                    userlist.forEach(function (msg, i) {
                        // new messageHandler(`${proxychannel}`, `/me ${streamers[0].offlineemote} ${streamers[0].username[0].toUpperCase()}\u{E0000}${streamers[0].username.toUpperCase().slice(1)} IS NOW OFFLINE ${streamers[0].offlineemote} ${userlist[i].toString().replaceAll(',', ' ')}`, true).newMessage();
                    });
                }
            }
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

    function getSecret() {
        return process.env.TWITCH_SECRET;
    }

    // Build the message used to get the HMAC.
    function getHmacMessage(request) {
        return (request.headers[TWITCH_MESSAGE_ID] +
            request.headers[TWITCH_MESSAGE_TIMESTAMP] +
            request.body);
    }

    // Get the HMAC.
    function getHmac(secret, message) {
        return crypto.createHmac('sha256', secret)
            .update(message)
            .digest('hex');
    }

    // Verify whether our hash matches the hash that Twitch passed in the header.
    function verifyMessage(hmac, verifySignature) {
        return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
    }
    return router;
})();
