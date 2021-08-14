const got = require("got");

module.exports = {
    name: "rl",
    execute: async (channel, user, input) => new Promise(async (resolve, reject) => {
        try {
            let username = user.username;
            if (input[3]) {
                username = input[3];
            }

            const rl = await got(`https://api.ivr.fi/logs/rq/${channel}/${username}`).json();
            
            resolve(`(#${channel}) ${rl.user}: ${rl.message} (${rl.time} ago)`)
            return `(#${channel}) ${rl.user}: ${rl.message} (${rl.time} ago)`
    
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    })
}