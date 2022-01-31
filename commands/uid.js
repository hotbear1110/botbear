const got = require("got");
require('dotenv').config();

module.exports = {
    name: "uid",
    ping: true,
    description: 'This command will give you the user-id of a specified user. Example: "bb uid NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        let response = "";
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let uiduser = user.username;

            let userID = "";

            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                try {
                    const userData = await got(`https://api.twitch.tv/helix/users?id=${input[2]}`, {
                        headers: {
                            'client-id': process.env.TWITCH_CLIENTID,
                            'Authorization': process.env.TWITCH_AUTH
                        },
                        timeout: 10000
                    }).json();
                    console.log(userData)
                    if (userData.length) {
                        uiduser = userData.data[0];
                        uiduser = uiduser["login"];
                        const uidBanned = await got(`https://api.ivr.fi/twitch/resolve/${uiduser}`, { timeout: 10000 }).json();
                        if (uidBanned.banned === true) {
                            response = `Username found: ${uiduser} - cmonBruh [BANNED USER]`;
                        } else {
                            response = `Username found: ${uiduser}`;
                        }
                    }

                } catch (err) {
                    console.log(err.response.statusCode);
                    if (err.response.statusCode !== 400) {
                        return `FeelsDankMan Error: ${err.response.error}`;
                    }
                    uiduser = input[2];

                }
                userID = await got(`https://api.ivr.fi/twitch/resolve/${input[2]}`, { timeout: 10000 }).json();
            } else {
                userID = await got(`https://api.ivr.fi/twitch/resolve/${uiduser}`, { timeout: 10000 }).json();
            }

            if (response.length) {
                if (userID.status === 404) {
                    return response;
                }
                if (userID.banned === true) {
                    response = `Multiple users found. ${response} | User-ID found: ${userID["id"]} - cmonBruh [BANNED USER]`
                } else {
                    console.log(userID)
                    response = `Multiple users found. ${response} | User-ID found: ${userID["id"]}`
                }
            } else {
                if (userID.status === 404) {
                    return "No users found";
                }
                if (userID.banned === true) {
                    response = `User-ID found: ${userID.id} - cmonBruh [BANNED USER]`
                } else {
                    response = `User-ID found: ${userID.id}`
                }
            }

            return response;

        } catch (err) {
            console.log(err);
            if (response.length) {
                return response;
            }
            if (err.name === "TimeoutError") {
                return `FeelsDankMan api error: ${err.name}`;
            }
            return `FeelsDankMan Error: ${err.response.error}`;
        }
    }
}