const axios = require('axios');
const _ = require("underscore");
const tools = require("../tools/tools.js");


module.exports = {
    name: "modcount",
    ping: true,
    description: 'This command will give you the number of channels a given user is a mod in. Example: "bb modcount NymN"',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let username = user.username;
            if (input[2]) {
                if (input[2].startsWith("@")) {
                    input[2] = input[2].substring(1);
                }
                username = input[2];
            }
            let modcount = await axios.get(`https://modlookup.3v.fi/api/user-totals/${username}`, {timeout: 10000});
            ismod = modcount.data["total"];
            if (ismod === 0) {
                return `That user is not a mod in any channel :)`;
            }
            return `That user is a m OMEGALUL d in ${ismod} channel('s)`;
        } catch (err) {
            console.log(err);
            if (err.name) {
                if (err.name === "TimeoutError") {
                    return `FeelsDankMan Banphrase api error: ${err.name}`;
                }
            }
            return `FeelsDankMan Error`;    
        }
    }
}