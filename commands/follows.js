const got = require("got");

module.exports = {
    name: "follows",
    ping: true,
    description: 'This command will show you how many people you follow',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let realuid = user["user-id"];
            let realuser = user.username;

            if(input[2]) {
                try {
                const getuid = await got(`https://api.ivr.fi/v2/twitch/user/${input[2]}`, { timeout: 10000 }).json();
                console.log(getuid)
                realuid = getuid.data[0].id;
                realuser = input[2];
                }
                catch (err){
                    return `User "${input[2]}" was not found`
                    }
            }
            const follows = await got(`https://api.twitch.tv/helix/users/follows?from_id=${user["user-id"]}`, { 
                headers: {
                'client-id': process.env.TWITCH_CLIENTID,
                'Authorization': process.env.TWITCH_AUTH
            },timeout: 10000 
        }).json();

        console.log(follows.data[0])
            let followscount = follows.data[0].total;
            return `${realuser} is following ${followscount} users`;

        } catch (err) {
            console.log(err);
            if (err.name) {
                if (err.name === "TimeoutError") {
                    return `FeelsDankMan api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error`;
        }
    }
}