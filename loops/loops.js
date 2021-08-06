const { ChatClient } = require("dank-twitch-irc");
const login = require('../connect/connect.js');
const tools = require("../tools/tools.js")

const cc = new ChatClient(login.client);



cc.on("ready", async () => {
    console.log("Successfully connected to chat")
    cc.joinAll(await login.channels())

});

cc.on("JOIN", (msg) => {
    console.log(`* Joined ${msg.channelName}`)
});



cc.connect();

setInterval(function(){
tools.query('SELECT * FROM Streamers',
      function(err, results, fields){
          const streamList = results;
    
          _.each(streamList, async function(stream) {
            await axios.get(`https://api.twitch.tv/helix/streams?user_login=${stream.username}`, {
              headers: {
                'client-id': 'nl7sh1z6rgj76gikoqgyaco9q2fmzy',
                'Authorization': 'Bearer wq14j6cgoh0i0skxqrhob35p7vhfzh'
              }})
              .then(function (response) {
                // handle success
                const twitchdata = response.data;
                let users = JSON.parse(stream.ping_users)
                if (twitchdata['data'].length !== 0 && stream.islive == 0) {
                  cc.me(`${stream.username}`, `${stream.liveemote} ${stream.username} IS NOW LIVE ${stream.liveemote} ${users.toString().replaceAll(',', ' ') }`);
                  console.log(stream.username + " IS NOW LIVE");
                  connection.query(`UPDATE Streamers SET islive = 1 WHERE username = "${stream.username}"`)
                };
                if (twitchdata['data'].length === 0 && stream.islive == 1) {
                  cc.me(`${stream.username}`, `${stream.offlineemote} ${stream.username} IS NOW OFFLINE ${stream.offlineemote} ${users.toString().replaceAll(',', ' ') }`);
                  console.log(stream.username + " IS NOW OFFLINE");
                  connection.query(`UPDATE Streamers SET islive = 0 WHERE username ="${stream.username}"`)
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
      })
    }, 10000)