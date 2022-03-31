require('dotenv').config();
const crypto = require('crypto')
const express = require('express');
const app = express();
const port = 8080;
let messageHandler = require("../tools/messageHandler.js").messageHandler;
const tools = require("../tools/tools.js");
const _ = require("underscore");

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';

app.use(express.raw({          // Need raw message body for signature verification
    type: 'application/json'
}))


app.post('/eventsub', async function (req, res) {
    let secret = getSecret();
    let message = getHmacMessage(req);
    let hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare

    if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
        console.log("signatures match");

        // Get JSON object from body, so you can process the message.
        let notification = JSON.parse(req.body);

        if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
            // TODO: Do something with the event's data.

            console.log(`Event type: ${notification.subscription.type}`);
            console.log(JSON.stringify(notification.event, null, 4));
            console.log(notification.event.broadcaster_user_id)
            res.sendStatus(204);

            if (notification.subscription.type === "channel.update") {
                const streamers = await tools.query('SELECT * FROM Streamers WHERE uid=?', notification.event.broadcaster_user_id);
                const myping = await tools.query(`SELECT * FROM MyPing`);

                let disabledCommands = JSON.parse(streamers[0].disabled_commands)

                let newTitle = notification.event.title;
                let titleusers = JSON.parse(streamers[0].title_ping);
                titleusers = titleusers.toString().replaceAll(',', ' ');

                let newGame = notification.event.category_name;
                let gameusers = JSON.parse(streamers[0].game_ping);

                _.each(myping, async function (userchanel) {
                    let pingname = JSON.parse(userchanel.username);
                    let gamename = userchanel.game_pings;
                    if (pingname.includes(streamers[0].username) && gamename.includes(newGame) && newGame !== "") {
                        gameusers.push(pingname[0]);
                    }
                })

                gameusers = gameusers.toString().replaceAll(',', ' ');

                let proxychannel = streamers[0].username;
                if (streamers[0].username === "forsen") {
                    proxychannel = "botbear1110";
                }

                if (newTitle !== streamers[0].title) {
                    let titleuserlist = tools.splitLine(titleusers, 400 - newTitle.length);
                    let titleTime = new Date().getTime();
                    console.log(streamers[0].username + " NEW TITLE: " + newTitle);
                    await tools.query(`UPDATE Streamers SET title=?, title_time=? WHERE username=?`, [newTitle, titleTime, streamers[0].username]);
                    if (!disabledCommands.includes("notify") || proxychannel === "botbear1110") {
                        if (titleusers.length) {
                            _.each(titleuserlist, function (msg, i) {
                                new messageHandler(`#${proxychannel}`, `/me ${streamers[0].titleemote} NEW GAME! ${streamers[0].titleemote} 👉 ${newTitle} 👉 ${titleuserlist[i]}`, true).newMessage();
                            });
                        }
                    }
                };

                if (newGame !== streamers[0].game) {
                    let gameuserlist = tools.splitLine(gameusers, 400 - newGame.length);
                    let gameTime = new Date().getTime();

                    await tools.query(`UPDATE Streamers SET game=?, game_time=? WHERE username=?`, [newGame, gameTime, streamers[0].username]);

                    console.log(streamers[0].username + " NEW GAME: " + newGame);
                    if (!disabledCommands.includes("notify") || proxychannel2 === "botbear1110") {
                        if (gameusers.length) {
                            _.each(gameuserlist, function (msg, i) {
                                new messageHandler(`#${proxychannel}`, `/me ${streamers[0].gameemote} NEW TITLE! ${streamers[0].gameemote} 👉 ${newGame} 👉 ${gameuserlist[i]}`, true).newMessage();
                            });
                        }
                    }
                };
            }

            if (notification.subscription.type === "stream.online") {
                const streamers = await tools.query('SELECT * FROM Streamers WHERE uid=?', notification.event.broadcaster_user_id);

                let disabledCommands = JSON.parse(streamers[0].disabled_commands)

                let users = JSON.parse(streamers[0].live_ping);
                users = users.toString().replaceAll(',', ' ');

                let proxychannel = streamers[0].username;
                if (streamers[0].username === "forsen") {
                    proxychannel = "botbear1110";
                }
                let userlist = tools.splitLine(users, 350);
                console.log(streamers[0].username + " IS NOW LIVE");
                await tools.query(`UPDATE Streamers SET islive = 1 WHERE username = "${streamers[0].username}"`);
                if (!disabledCommands.includes("notify") || proxychannel === "botbear1110") {
                    if (users.length) {
                        _.each(userlist, function (msg, i) {
                            new messageHandler(`#${proxychannel}`, `/me ${streamers[0].liveemote} ${streamers[0].username[0].toUpperCase()}\u{E0000}${streamers[0].username.toUpperCase().slice(1)} IS NOW OFFLINE ${streamers[0].liveemote} ${userlist[i]}`, true).newMessage();
                        });
                    }
                }
            }

            if (notification.subscription.type === "stream.offline") {
                const streamers = await tools.query('SELECT * FROM Streamers WHERE uid=?', notification.event.broadcaster_user_id);

                let disabledCommands = JSON.parse(streamers[0].disabled_commands)

                let users = JSON.parse(streamers[0].live_ping);
                users = users.toString().replaceAll(',', ' ');

                let proxychannel = streamers[0].username;
                if (streamers[0].username === "forsen") {
                    proxychannel = "botbear1110";
                }
                let userlist = tools.splitLine(users, 350);
                console.log(streamers[0].username + " IS NOW OFFLINE");
                await tools.query(`UPDATE Streamers SET islive = 0 WHERE username ="${streamers[0].username}"`);
                if (!disabledCommands.includes("notify") || proxychannel === "botbear1110") {
                    if (users.length) {
                        _.each(userlist, function (msg, i) {
                            new messageHandler(`#${proxychannel}`, `/me ${streamers[0].offlineemote} ${streamers[0].username[0].toUpperCase()}\u{E0000}${streamers[0].username.toUpperCase().slice(1)} IS NOW LIVE ${streamers[0].offlineemote} ${userlist[i].toString().replaceAll(',', ' ')}`, true).newMessage();
                        });
                    }
                }

            }


        }
        else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
            res.status(200).send(notification.challenge);
        }
        else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
            res.sendStatus(204);

            console.log(`${notification.subscription.type} notifications revoked!`);
            console.log(`reason: ${notification.subscription.status}`);
            console.log(`condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
        }
        else {
            res.sendStatus(204);
            console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
        }
    }
    else {
        console.log('403');    // Signatures didn't match.
        res.sendStatus(403);
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})


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