const got = require("got");

module.exports = {
    name: "test",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            const regexV1 = new RegExp(/^\d+$/)
            const regexV2 = new RegExp(/^emotesv2_[a-z0-9]{32}$/)
            const isEmoteID = (regexV1.test("nymnBiggus") || regexV2.test("nymnBiggus"));

            const response = await got("https://api.ivr.fi/v2/twitch/emotes/emotesv2_e0adfa2af1ce49429fed1942a2c2210c", {
                searchParams: ("emotesv2_e0adfa2af1ce49429fed1942a2c2210c") ? { id: "true" } : {},
                throwHttpErrors: false
            });

            console.log(response)
            console.log(user.emotes)
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}