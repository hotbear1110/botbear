require('dotenv').config();
const tools = require("../tools/tools.js");
const _ = require("underscore");
const cc = require("../bot.js").cc;
const got = require("got");
const { isDnsLookupIpVersion } = require('got/dist/source/core/utils/dns-ip-version');
let messageHandler = require("../tools/messageHandler.js").messageHandler;
const { con } = require('../connect/connect.js');

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
    const streamers = await tools.query('SELECT * FROM Streamers');
    const myping = await tools.query(`SELECT * FROM MyPing`);

    _.each(streamers, async function (stream) {
        let disabledCommands = JSON.parse(stream.disabled_commands)
        setTimeout(async function () {
            await got(`https://api.twitch.tv/helix/streams?user_login=${stream.username}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
            }).json()
                .then(async function (response) {
                    // handle success
                    const twitchdata = response;
                    let users = JSON.parse(stream.live_ping);
                    users = users.toString().replaceAll(',', ' ');


                    let proxychannel = stream.username;
                    if (stream.username === "forsen") {
                        proxychannel = "botbear1110";
                    }
                    if (twitchdata['data'].length !== 0 && stream.islive == 0) {
                        let userlist = tools.splitLine(users, 350);
                        console.log(stream.username + " IS NOW LIVE");
                        await tools.query(`UPDATE Streamers SET islive = 1 WHERE username = "${stream.username}"`);
                        if (!disabledCommands.includes("notify") || proxychannel === "botbear1110") {
                            if (users.length) {
                                _.each(userlist, function (msg, i) {
                                    new messageHandler(`#${proxychannel}`, `/me ${stream.liveemote} ${stream.username[0].toUpperCase()}\u{E0000}${stream.username.toUpperCase().slice(1)} IS NOW LIVE ${stream.liveemote} ${userlist[i]}`, true).newMessage();
                                });
                            }
                        }
                    };
                    if (twitchdata['data'].length === 0 && stream.islive == 1) {
                        let userlist = tools.splitLine(users, 350);
                        console.log(stream.username + " IS NOW OFFLINE");
                        await tools.query(`UPDATE Streamers SET islive = 0 WHERE username ="${stream.username}"`);
                        if (!disabledCommands.includes("notify") || proxychannel === "botbear1110") {
                            if (users.length) {
                                _.each(userlist, function (msg, i) {
                                    new messageHandler(`#${proxychannel}`, `/me ${stream.offlineemote} ${stream.username[0].toUpperCase()}\u{E0000}${stream.username.toUpperCase().slice(1)} IS NOW OFFLINE ${stream.offlineemote} ${userlist[i].toString().replaceAll(',', ' ')}`, true).newMessage();
                                });
                            }
                        }
                    };
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }, 500);
    }
    )
    _.each(streamers, async function (stream) {
        let disabledCommands = JSON.parse(stream.disabled_commands)
        setTimeout(async function () {
            await got(`https://api.twitch.tv/helix/channels?broadcaster_id=${stream.uid}`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
            }).json()
                .then(async function (response) {
                    // handle success
                    const twitchdata = response;
                    let newTitle = twitchdata.data[0].title;
                    let titleusers = JSON.parse(stream.title_ping);
                    titleusers = titleusers.toString().replaceAll(',', ' ');

                    let newGame = twitchdata.data[0].game_name;
                    let gameusers = JSON.parse(stream.game_ping);
                    _.each(myping, async function (userchanel) {
                        let pingname = JSON.parse(userchanel.username);
                        let gamename = userchanel.game_pings;
                        if (pingname.includes(stream.username) && gamename.includes(newGame) && newGame !== "") {
                            gameusers.push(pingname[0]);
                        }
                    })
                    gameusers = gameusers.toString().replaceAll(',', ' ');

                    let proxychannel2 = stream.username;
                    if (stream.username === "forsen") {
                        proxychannel2 = "botbear1110";
                    }

                    if (newTitle !== stream.title) {
                        let titleuserlist = tools.splitLine(titleusers, 400 - newTitle.length);
                        let titleTime = new Date().getTime();
                        console.log(stream.username + " NEW TITLE: " + newTitle);
                        await tools.query(`UPDATE Streamers SET title=?, title_time=? WHERE username=?`, [newTitle, titleTime, stream.username]);
                        if (!disabledCommands.includes("notify") || proxychannel2 === "botbear1110") {
                            if (titleusers.length) {
                                _.each(titleuserlist, function (msg, i) {
                                    new messageHandler(`#${proxychannel2}`, `/me ${stream.titleemote} NEW TITLE ! ${stream.titleemote} 👉 ${newTitle} 👉 ${titleuserlist[i]}`, true).newMessage();
                                });
                            }
                        }
                    };
                    if (newGame !== stream.game) {
                        let gameuserlist = tools.splitLine(gameusers, 400 - newGame.length);
                        let gameTime = new Date().getTime();

                        await tools.query(`UPDATE Streamers SET game=?, game_time=? WHERE username=?`, [newGame, gameTime, stream.username]);

                        if (newTitle !== stream.title) {
                            sleep(1500)
                        }
                        console.log(stream.username + " NEW GAME: " + newGame);
                        if (!disabledCommands.includes("notify") || proxychannel2 === "botbear1110") {
                            if (gameusers.length) {
                                _.each(gameuserlist, function (msg, i) {
                                    new messageHandler(`#${proxychannel2}`, `/me ${stream.gameemote} NEW GAME ! ${stream.gameemote} 👉 ${newGame} 👉 ${gameuserlist[i]}`, true).newMessage();
                                });
                            }
                        }
                    };
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
                .then(function () {
                    // always executed
                });
        }, 500);
    }
    )
}, 20000);

setInterval(async function () {
    const streamers = await tools.query('SELECT * FROM Streamers');

    _.each(streamers, async function (streamer) {
        setTimeout(async function () {

            let Emote_list = JSON.parse(streamer.emote_list);
            let Emote_removed = JSON.parse(streamer.emote_removed);
            let noFFZ = 0;
            let noBTTV = 0;
            let noSTV = 0;

            let FFZ_list = "";
            let BTTV_list = "";
            let STV_list = "";


            try {
                const FFZ = await got(`https://api.frankerfacez.com/v1/room/id/${streamer.uid}`, { timeout: 10000 }).json();

                if (!FFZ.room || (typeof FFZ.error != "undefined") || !FFZ) {
                    noFFZ = 1;
                    return;
                }

                let set = FFZ.room.set;
                FFZ_list = FFZ.sets[`${set}`].emoticons;

                _.each(FFZ_list, async function (emote) {
                    let inlist = 0;
                    _.each(Emote_list, async function (emotecheck) {
                        if (emotecheck.includes(emote["name"]) && emotecheck.includes(emote["id"])) {
                            inlist = 1;
                        }
                    })
                    if (inlist === 0) {
                        let time = new Date().getTime();
                        let owner = emote["owner"]

                        Emote_list.push([emote["name"], emote["id"], time, owner["name"], `https://www.frankerfacez.com/emoticon/${emote["id"]}`, "ffz"]);
                    }

                });

            } catch (err) {
                noFFZ = 1;

            }
            try {
                const BTTV = await got(`https://api.betterttv.net/3/cached/users/twitch/${streamer.uid}`, { timeout: 10000 }).json();

                if ((typeof BTTV.message != "undefined") || !BTTV) {
                    noBTTV = 1;
                    return;
                }

                BTTV_list = BTTV["channelEmotes"]
                _.each(BTTV["sharedEmotes"], async function (emote) {
                    BTTV_list.push(emote)
                });


                _.each(BTTV_list, async function (emote) {
                    let inlist = 0;
                    _.each(Emote_list, async function (emotecheck) {
                        if (emotecheck.includes(emote["code"]) && emotecheck.includes(emote["id"])) {
                            inlist = 1;
                        }
                    })
                    if (inlist === 0) {
                        let time = new Date().getTime();
                        let owner = streamer.username;
                        if (emote["user"]) {
                            owner = emote["user"];
                            owner = owner["name"];
                        }

                        Emote_list.push([emote["code"], emote["id"], time, owner, `https://betterttv.com/emotes/${emote["id"]}`, "bttv"]);
                    }

                });
            } catch (err) {
                noBTTV = 1;

            }
            try {
                const STV = await got(`https://api.7tv.app/v2/users/${streamer.uid}/emotes`, { timeout: 10000 }).json();


                if ((typeof STV.message != "undefined") || !STV) {
                    noSTV = 1
                    return;
                }

                STV_list = STV

                _.each(STV_list, async function (emote) {
                    let inlist = 0;

                    _.each(Emote_list, async function (emotecheck) {
                        if (emotecheck.includes(emote["name"]) && emotecheck.includes(emote["id"])) {
                            inlist = 1;
                            return;
                        }
                    })
                    if (inlist === 0) {
                        let time = new Date().getTime();
                        let owner = emote["owner"]
                        let zero_Width = "7tv"
                        if (emote["visibility_simple"][0] === "ZERO_WIDTH") {
                            zero_Width = "7tv_ZERO_WIDTH"
                        }

                        Emote_list.push([emote["name"], emote["id"], time, owner["login"], `https://7tv.app/emotes/${emote["id"]}`, zero_Width]);
                    }

                });
            } catch (err) {
                noSTV = 1;

            }

            _.each(Emote_list, async function (emote) {
                let inlist = 0;
                let test1 = 0;
                let test2 = 0;
                let test3 = 0;

                if (noFFZ === 0) {
                    _.each(FFZ_list, async function (emotecheck) {
                        if (emotecheck["id"] == emote[1] && emotecheck["name"] === emote[0]) {
                            inlist = 1;
                            test1 = 1;
                            return;
                        }
                    })
                }

                if (noBTTV === 0 && inlist === 0) {
                    _.each(BTTV_list, async function (emotecheck) {
                        if (emotecheck["id"] == emote[1] && emotecheck["code"] === emote[0]) {
                            inlist = 1;
                            test2 = 1;
                            return;
                        }
                    })
                }

                if (noSTV === 0 && inlist === 0) {
                    _.each(STV_list, async function (emotecheck) {
                        if (emotecheck["id"] == emote[1] && emotecheck["name"] === emote[0]) {
                            inlist = 1;
                            test3 = 1
                            return;
                        }
                    })
                }
                if (inlist === 0 && noFFZ === 0 && noBTTV === 0 && noSTV === 0) {
                    let time = new Date().getTime();

                    Emote_removed.push([emote[0], emote[1], time, [emote[5]]]);

                    Emote_list = _.without(Emote_list, emote)
                }

            });

            Emote_list = JSON.stringify(Emote_list)
            Emote_removed = JSON.stringify(Emote_removed)
            await tools.query(`UPDATE Streamers SET emote_list=? WHERE username=?`, [Emote_list, streamer.username]);
            await tools.query(`UPDATE Streamers SET emote_removed=? WHERE username=?`, [Emote_removed, streamer.username]);

            const isSubbed = await got(`https://api.7tv.app/v2/badges?user_identifier=twitch_id`, { timeout: 10000 }).json();

            let foundName = false;
            _.each(isSubbed["badges"], async function (badge) {
                if (badge["name"].split(" ").includes("Subscriber")) {
                    let users = badge["users"]
                    if (users.includes(streamer.uid.toString())) {
                        foundName = true;
                        await tools.query(`UPDATE Streamers SET seventv_sub=? WHERE username=?`, [1, streamer.username]);
                    }
                }
            });

            if (foundName === false) {
                await tools.query(`UPDATE Streamers SET seventv_sub=? WHERE username=?`, [0, streamer.username]);
            }
        }, 200);
    });
}, 120000);

setInterval(async function () {
    const users = await tools.query(`SELECT * FROM Cookies`);
    let Time = new Date().getTime();

    _.each(await users, async function (User) {
        if (User.RemindTime !== null && User.RemindTime < Time) {
            if (User.Status === "Confirmed" || User.Status === "Confirmed2") {
                const stream = await tools.query('SELECT * FROM Streamers WHERE username=?', [User.Channel.substring(1)]);
                let disabledCommands = JSON.parse(stream[0].disabled_commands)

                await tools.query(`UPDATE Cookies SET Status=?, Channel=?, RemindTime=? WHERE User=?`, [null, null, null, User.User]);
                if (User.Mode === 0) {
                    if (disabledCommands.includes("cookie")) {
                        new messageHandler(`#${User.User}`, `${User.User} Reminder to eat your cookie nymnOkay - This reminder is from a channel that has disabled cookie reminders[${User.Channel}]`).newMessage();

                    } else if (stream[0].islive === 1) {
                        new messageHandler(`#${User.User}`, `${User.User} Reminder to eat your cookie nymnOkay - This reminder is from a channel that is live[${User.Channel}]`).newMessage();

                    } else {
                        new messageHandler(User.Channel, `${User.User} Reminder to eat your cookie nymnOkay`).newMessage();
                    }

                } else if (User.Mode === 1) {
                    if (disabledCommands.includes("cookie")) {
                        new messageHandler(`#${User.User}`, `${User.User} Reminder to eat your cookie nymnOkay - This reminder is from a channel that has disabled cookie reminders[${User.Channel}]`).newMessage();

                    } else if (stream[0].islive === 1) {
                        new messageHandler(`#${User.User}`, `${User.User} Reminder to eat your cookie nymnOkay - This reminder is from a channel that is live[${User.Channel}]`).newMessage();

                    } else {
                        new messageHandler(`#${User.User}`, `${User.User} Reminder to eat your cookie nymnOkay`).newMessage();

                    }
                } else if (User.Mode === 2) {
                    if (disabledCommands.includes("cookie")) {
                        new messageHandler(`#botbear1110`, `${User.User} Reminder to eat your cookie nymnOkay - This reminder is from a channel that has disabled cookie reminders[${User.Channel}]`).newMessage();

                    } else if (stream[0].islive === 1) {
                        new messageHandler(`#botbear1110`, `${User.User} Reminder to eat your cookie nymnOkay - This reminder is from a channel that is live[${User.Channel}]`).newMessage();

                    } else {
                        new messageHandler(`#botbear1110`, `${User.User} Reminder to eat your cookie nymnOkay`).newMessage();
                    }
                }
            }
        }
    })

}, 10000);

setInterval(async function () {
    const users = await tools.query(`SELECT * FROM Cdr`);
    let Time = new Date().getTime();

    _.each(await users, async function (User) {
        if (User.RemindTime !== null && User.RemindTime < Time && User.Status === "Confirmed") {
            const stream = await tools.query('SELECT * FROM Streamers WHERE username=?', [User.Channel.substring(1)]);
            let disabledCommands = JSON.parse(stream[0].disabled_commands)

            await tools.query(`UPDATE Cdr SET Status=?, Channel=?, RemindTime=? WHERE User=?`, [null, null, null, User.User]);

            if (User.Mode === 0) {
                if (disabledCommands.includes("cdr")) {
                    new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that has disabled cookie reminders[${User.Channel}]`).newMessage();

                } else if (stream[0].islive === 1) {
                    new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that is live[${User.Channel}]`).newMessage();

                } else {
                    new messageHandler(User.Channel, `${User.User} Your cookie cdr is ready`).newMessage();
                }

            } else if (User.Mode === 1) {
                if (disabledCommands.includes("cookie")) {
                    new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that has disabled cdr reminders[${User.Channel}]`).newMessage();

                } else if (stream[0].islive === 1) {
                    new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that is live[${User.Channel}]`).newMessage();

                } else {
                    new messageHandler(`#${User.User}`, `${User.User} Your cookie cdr is ready`).newMessage();

                }
            } else if (User.Mode === 2) {
                if (disabledCommands.includes("cdr")) {
                    new messageHandler(`#botbear1110`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that has disabled cookie reminders[${User.Channel}]`).newMessage();

                } else if (stream[0].islive === 1) {
                    new messageHandler(`#botbear1110`, `${User.User} Your cookie cdr is ready - This reminder is from a channel that is live[${User.Channel}]`).newMessage();

                } else {
                    new messageHandler(`#botbear1110`, `${User.User} Your cookie cdr is ready`).newMessage();
                }
            }
        }

    })

}, 10000);

setInterval(async function () {
    try {
        await got(`https://supinic.com/api/bot-program/bot/active`, {
            headers: { Authorization: `Basic ${process.env.SUPI_USERID}:${process.env.SUPI_AUTH}` },
            method: 'PUT'
        }).json();
    } catch (err) {
        console.log(err)
    }
}, 600000)