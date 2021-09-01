module.exports = {
    name: "bot",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let uid = user["user-id"]
            
            if (input[2]) {
            uid = await axios.get(`https://api.ivr.fi/twitch/resolve/${input[2]}`);
            uid = uid.data.id
            }

            let twitchdata = await axios.get(`https://api.twitch.tv/helix/users?id=${uid}`, {
            headers: {
                'client-id': process.env.TWITCH_CLIENTID,
                'Authorization': process.env.TWITCH_AUTH
            }
        })
        let age = twitchdata.data[0].view_count

        return `Account is ${tools.humanizeDuration(age)} old`

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}