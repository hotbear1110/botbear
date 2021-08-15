require('dotenv').config()
const tools = require("../tools/tools.js")
const _ = require("underscore")
const axios = require('axios');
const cc = require("../bot.js").cc;

cc.connect()

setInterval(async function () {
    const streamers = await tools.query('SELECT * FROM Streamers')
    const myping = await tools.query(`SELECT * FROM MyPing`)

    _.each(streamers, async function (stream) {
        setTimeout(function () { }, 100)
        await axios.get(`https://api.twitch.tv/helix/streams?user_login=${stream.username}`, {
            headers: {
                'client-id': process.env.TWITCH_CLIENTID,
                'Authorization': process.env.TWITCH_AUTH
            }
        })
            .then(async function (response) {
                // handle success
                const twitchdata = response.data;
                let users = JSON.parse(stream.live_ping)
                users = users.toString().replaceAll(',', ' ')


                let userlist = tools.splitLine(users, 350)
                let proxychannel = stream.username
                if (stream.username === "forsen") {
                    proxychannel = "botbear1110";
                }

                if (twitchdata['data'].length !== 0 && stream.islive == 0) {
                    console.log(stream.username + " IS NOW LIVE");
                    await tools.query(`UPDATE Streamers SET islive = 1 WHERE username = "${stream.username}"`)
                    _.each(userlist, function (msg, i) {
                        setTimeout(function () {
                            cc.action(`#${proxychannel}`, `${stream.liveemote} ${stream.username} IS NOW LIVE ${stream.liveemote} ${userlist[i]}`);
                        }, 2000 * i);
                    });
                };
                if (twitchdata['data'].length === 0 && stream.islive == 1) {
                    console.log(stream.username + " IS NOW OFFLINE");
                    await tools.query(`UPDATE Streamers SET islive = 0 WHERE username ="${stream.username}"`)
                    _.each(userlist, function (msg, i) {
                        setTimeout(function () {
                            cc.action(`#${proxychannel}`, `${stream.offlineemote} ${stream.username} IS NOW OFFLINE ${stream.offlineemote} ${userlist[i].toString().replaceAll(',', ' ')}`);
                        }, 2000 * i);
                    });
                };
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    })
    _.each(streamers, async function (stream) {
        setTimeout(function () { }, 100)
        await axios.get(`https://api.twitch.tv/helix/channels?broadcaster_id=${stream.uid}`, {
            headers: {
                'client-id': process.env.TWITCH_CLIENTID,
                'Authorization': process.env.TWITCH_AUTH
            }
        })
            .then(async function (response) {
                // handle success
                const twitchdata = response.data;
                let newTitle = twitchdata.data[0].title
                let titleusers = JSON.parse(stream.title_ping)
                titleusers = titleusers.toString().replaceAll(',', ' ')

                let newGame = twitchdata.data[0].game_name
                let gameusers = JSON.parse(stream.game_ping)
                _.each(myping, async function (userchanel) {
                    let pingname = JSON.parse(userchanel.username)
                    let gamename = userchanel.game_pings
                    if (pingname.includes(stream.username) && gamename.includes(newGame)) {
                        gameusers.push(pingname[0])
                    }
                })
                gameusers = gameusers.toString().replaceAll(',', ' ')


                let titleuserlist = tools.splitLine(titleusers, 350)
                let gameuserlist = tools.splitLine(gameusers, 350)

                let proxychannel2 = stream.username
                if (stream.username === "forsen") {
                    proxychannel2 = "botbear1110";
                }

                if (newTitle != stream.title) {
                    console.log(stream.username + " NEW TITLE: " + newTitle);
                    await tools.query(`UPDATE Streamers SET title=? WHERE username=?`, [newTitle, stream.username])
                    _.each(titleuserlist, function (msg, i) {
                        setTimeout(function () {
                            cc.action(`#${proxychannel2}`, `${stream.liveemote} NEW TITLE ! ${stream.liveemote} 👉 ${newTitle} 👉 ${titleuserlist[i]}`);
                        }, 2000 * i);
                    });
                };
                if (newGame != stream.game) {

                    await tools.query(`UPDATE Streamers SET game=? WHERE username=?`, [newGame, stream.username])

                    if (newTitle != stream.title) {
                        function sleep(milliseconds) {
                            var start = new Date().getTime();
                            for (var i = 0; i < 1e7; i++) {
                                if ((new Date().getTime() - start) > milliseconds) {
                                    break;
                                }
                            }
                        }
                        sleep(1500)
                    }
                    console.log(stream.username + " NEW GAME: " + newGame);
                    _.each(gameuserlist, function (msg, i) {
                        setTimeout(function () {
                            cc.action(`#${proxychannel2}`, `${stream.liveemote} NEW GAME ! ${stream.liveemote} 👉 ${newGame} 👉 ${gameuserlist[i]}`);
                        }, 2000 * i);
                    });

                };
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    })
}, 10000)
