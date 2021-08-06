const { ChatClient } = require("dank-twitch-irc");
const login = require('../connect/connect.js');
const tools = require("../tools/tools.js")
const _ = require("underscore")
const axios = require('axios');

const cc = new ChatClient(login.client);



cc.on("ready", async () => {
    console.log("Loop works yes!")
    cc.joinAll(await login.channels())

});




cc.connect();

setInterval(async function () {
    const getUsers = await tools.query('SELECT * FROM Streamers')

    _.each(getUsers, async function (stream) {
        await axios.get(`https://api.twitch.tv/helix/streams?user_login=${stream.username}`, {
            headers: {
                'client-id': 'nl7sh1z6rgj76gikoqgyaco9q2fmzy',
                'Authorization': 'Bearer wq14j6cgoh0i0skxqrhob35p7vhfzh'
            }
        })
            .then(async function (response) {
                // handle success
                const twitchdata = response.data;
                let users = JSON.parse(stream.ping_users)
                users = users.toString().replaceAll(',', ' ')


                let userlist = tools.splitLine(users, 350)

                if (twitchdata['data'].length !== 0 && stream.islive == 0) {
                    console.log(stream.username + " IS NOW LIVE");
                    await tools.query(`UPDATE Streamers SET islive = 1 WHERE username = "${stream.username}"`)
                    _.each(userlist, function (msg, i) {
                        setTimeout(function () {
                            cc.me(`${stream.username}`, `${stream.liveemote} ${stream.username} IS NOW LIVE ${stream.liveemote} ${userlist[i]}`);
                        }, 2000 * i);
                    });
                };
                if (twitchdata['data'].length === 0 && stream.islive == 1) {
                    console.log(stream.username + " IS NOW OFFLINE");
                    await tools.query(`UPDATE Streamers SET islive = 0 WHERE username ="${stream.username}"`)
                    _.each(userlist, function (msg, i) {
                        setTimeout(function () {
                            cc.me(`${stream.username}`, `${stream.offlineemote} ${stream.username} IS NOW OFFLINE ${stream.offlineemote} ${userlist[i].toString().replaceAll(',', ' ')}`);
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