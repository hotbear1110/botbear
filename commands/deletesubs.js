const got = require("got");
const _ = require("underscore");

module.exports = {
    name: "deletesubs",
    ping: false,
    description: 'This command is for deleting all eventsubs',
    permission: 2000,
    category: "Dev command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let subs = await got(`https://api.twitch.tv/helix/eventsub/subscriptions`, {
                headers: {
                    'client-id': process.env.TWITCH_CLIENTID,
                    'Authorization': process.env.TWITCH_AUTH
                },
            }).json();
            subs = subs.data;

            for (let i = 0; i < subs.length; i++) {
                setTimeout(async function () {

                    let sub = subs[i];
                    console.log(sub)
                    await got.delete(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${sub.id}`, {
                        headers: {
                            'client-id': process.env.TWITCH_CLIENTID,
                            'Authorization': process.env.TWITCH_AUTH
                        },
                    });
                }, 100 * i)
            }
            return "Okayge done!!";
        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}