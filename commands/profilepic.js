const { got } = require('./../got');

module.exports = {
	name: 'profilepic',
	ping: true,
	description: 'Get the profile pic of a twitch user',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: true,
	channelSpecific: false,
	activeChannel: '',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

            let username = input[2] ?? user.username;

            const profile = await got('https://api.twitch.tv/helix/users', {
                headers: {
                    'client-id': process.env.TWITCH_USER_CLIENTID,
                    'Authorization': process.env.TWITCH_USER_AUTH
                },
                searchParams: {
                    'login': username
                },
                throwHttpErrors: false
            }).json();

            if (profile.error || !profile.data.length || !profile.data) {
                return "No user with that username found";
            }

			return profile.data[0].profile_image_url.replace('300x300', '600x600');
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};