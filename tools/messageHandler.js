const tools = require('./tools.js');
require('dotenv');
const talkedRecently = {};

let oldmessage = '';

exports.messageHandler = class Cooldown {
	constructor(channel, message, noBanphrase, showDelay, start, ping, user) {
		this.channel = channel;
		this.message = message;
		this.noBanphrase = noBanphrase || false;
		this.showDelay = showDelay || false;
		this.ping = ping || false;
		this.start = start;
		this.user = user;
		this.noCD = 0;
	}
	async Cooldown() {
		let cooldown = 1250;
		if (talkedRecently[this.channel]) {
			cooldown = 1250 * (talkedRecently[this.channel].length);

		}
		return cooldown;
	}

	async newMessage() {
		const cc = require('../bot.js').cc;
		require('../bot.js').start;

		if (process.env.TWITCH_USER === 'devbear1110' && this.channel !== 'hottestbear') {
			console.log(`Channel: #${this.channel} - msg: ${this.message}`);
			return;
		}
		if (this.channel === '#forsen') {
			let newmessage = tools.splitLine(this.message, 150);
			if (newmessage[1]) {
				if (!newmessage[0].length) {
					this.message = 'ForsenLookingAtYou Message is too long';
				} else {
					this.message = newmessage[0] + ' ...';
				}
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

		if (talkedRecently[this.channel]) {
			this.noCD = 0;
			let tempList = talkedRecently[this.channel];
			tempList.push(this.message);
			talkedRecently[this.channel] = tempList;
		} else {
			if (!(this.message.includes('Reminder to eat your cookie nymnOkay') || this.message.includes('Reminder to eat your cookie nymnOkay 󠀀 ')) || oldmessage !== this.message) {
				if (!(this.message.includes('Your cookie cdr is ready.') || this.message.includes('Your cookie cdr is ready. 󠀀 ')) || oldmessage !== this.message) {
					if (this.message === oldmessage) {
						this.message = this.message + ' 󠀀 ';
					}
					cc.say(this.channel, this.message);
				}
			}
			this.noCD = 1;
			let tempList = [];
			tempList.push(this.message);
			talkedRecently[this.channel] = tempList;
		}

		setTimeout(() => {
			let tempList = talkedRecently[this.channel];
			if (this.noCD === 0) {
				if (!(this.message.includes('Reminder to eat your cookie nymnOkay') || this.message.includes('Reminder to eat your cookie nymnOkay 󠀀 ')) || oldmessage !== this.message) {
					if (!(this.message.includes('Your cookie cdr is ready.') || this.message.includes('Your cookie cdr is ready. 󠀀 ')) || oldmessage !== this.message) {
						if (this.message === oldmessage) {
							this.message = this.message + ' 󠀀 ';
						}
						cc.say(this.channel, this.message);
					}
				}
			}
			oldmessage = this.message;
			tempList.shift();
			talkedRecently[this.channel] = tempList;
			if (!talkedRecently[this.channel].length) {
				delete talkedRecently[this.channel];
				this.noCD = 0;
			}

		}, await this.Cooldown());
		return;
	}

};