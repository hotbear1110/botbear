const tools = require('./tools.js');
require('dotenv');
const talkedRecently = {};

let oldmessage = '';

exports.messageHandler = class Cooldown {
	constructor(channel, message, noBanphrase, showDelay, start, ping, user, spamAllowed) {
		this.channel = channel;
		this.message = message;
		this.noBanphrase = noBanphrase || false;
		this.showDelay = showDelay || false;
		this.start = start || 0;
		this.ping = ping || false;
		this.user = user || null;
		this.spamAllowed = spamAllowed  || false;
		this.noCD = 0;
	}
	Cooldown() {
		let cooldown = 1250;
		if (talkedRecently[this.channel]) {
			cooldown = 1250 * (talkedRecently[this.channel].length);

		}
		return cooldown;
	}

	async newMessage() {
		const cc = require('../bot.js').cc;
		require('../bot.js').start;

		if (process.env.TWITCH_USER === 'devbear1110' && this.channel !== process.env.TWITCH_OWNERNAME) {
			console.log(`Channel: #${this.channel} - msg: ${this.message}`);
			return;
		} else if (process.env.TWITCH_USER === 'devbear1110') {
			this.noBanphrase = true;
		}
		if (this.channel === '#forsen') {
			let newmessage = tools.splitLine(this.message, 150);
			if (newmessage[1]) {
				this.message = newmessage[0] + ' ...';
			}
		}

		if (!this.noBanphrase) {
			this.message = await tools.checkAllBanphrases(this.message, this.channel);
		}
		if (this.ping) {
			this.message = `${this.user['display-name']}, ${this.message}`;
		}
		if (this.showDelay) {
			this.end = new Date().getTime();
			this.message = `${this.message} ${this.end - this.start}ms`;

		}

		if (talkedRecently[this.channel] && !this.spamAllowed) {
			this.noCD = 0;
			let tempList = talkedRecently[this.channel];
			tempList.push(this.message);
			talkedRecently[this.channel] = tempList;
		} else {
			if (this.message === oldmessage) {
				this.message = (this.message.endsWith(' 󠀀 '))  ? this.message.substring(this.message.length-4, 0) : this.message + ' 󠀀 ';
			}
			await cc.say(this.channel, this.message);
			this.noCD = 1;
			let tempList = [];
			tempList.push(this.message);
			talkedRecently[this.channel] = tempList;
		}

		setTimeout(async () => {
			let tempList = talkedRecently[this.channel] || [];
			if (this.noCD === 0) {
				if (this.message === oldmessage) {
					this.message = (this.message.endsWith(' 󠀀 '))  ? this.message.substring(this.message.length-4, 0) : this.message + ' 󠀀 ';
				}
				await cc.say(this.channel, this.message);
			}
			tempList.shift();
			tempList.push(this.message);
			talkedRecently[this.channel] = tempList;
			if (!talkedRecently[this.channel].length) {
				delete talkedRecently[this.channel];
				this.noCD = 0;
			}

		}, this.Cooldown());
		return;
	}

};