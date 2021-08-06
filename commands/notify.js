
module.exports = {
    name: "notify",
    execute: async (data, input) => {
    switch(input[1]) {
        case "live":
            connection.query(`SELECT * FROM Streamers WHERE username="${data.channelName}"`,
            function(err, results, fields){
              let users = JSON.parse(results[0].ping_users)
          
              if (users.includes(data.senderName)) {
                return `You already have a subscription for the event "live". If you want to unsubscribe, type "!removeme live". `
              }
              else {
                users.push(data.senderName)
                users = JSON.stringify(users)
          
                connection.query(`UPDATE Streamers SET ping_users=? WHERE username=?`,[users, data.channelName])
          
                return `You are now subscribed to the event "live"`
              }
          
            }
            )
          break;
        case "title":
          // add user to title notify list
          break;
        case "game":
          // add user to gamenotify list
        default:
        client.say(target, `${context.username}, Please specify an event to subscribe to. The following events are available: live (might add more stuff later) `)
      }
    }
}