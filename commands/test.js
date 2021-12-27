const shell = require("child_process")
const axios = require('axios');
const tools = require("../tools/tools.js");
const _ = require("underscore");
const { fchown } = require("fs");
const got = require("got");

module.exports = {
    name: "test",
    ping: true,
    description: 'This is a dev command for testing purposes',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            const isSubbed = await got(`https://api.7tv.app/v2/badges?user_identifier=twitch_id`, { timeout: 10000 }).json();

            let foundName = false;
            _.each(isSubbed["badges"], async function (badge) {
                if (badge["name"].split(" ").includes("Subscriber")) {
                    let users = badge["users"]
                    if (users.includes("62300805")) {
                        foundName = true;
                    }
                }
            });

            if (foundName === false) {
            }
            return;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Test Failed`;
        }
    }
}