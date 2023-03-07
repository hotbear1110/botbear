let talkedRecently = {};
const tools = require('./tools.js');

exports.whisperHandler = class Cooldown {
	constructor(recipient, message) {
		this.sender = process.env.TWITCH_UID;
		this.recipient = recipient;
		this.message = message;
		this.noCD = 0;
	}

	async Cooldown() {
		let cooldown = 1250;
		if (talkedRecently[this.recipient]) {
			cooldown = 1250 * (talkedRecently[this.recipient].length);

		}
		return cooldown;
	}

	async newWhisper() {
		const cc = require('../bot.js').cc;

		if (talkedRecently[this.recipient]) {
			this.noCD = 0;
			let tempList = talkedRecently[this.recipient];
			tempList.push(this.message);
			talkedRecently[this.recipient] = tempList;
		} else {
			await tools.sendWhisper(this.recipient, this.sender, this.message);
			this.noCD = 1;
			let tempList = [];
			tempList.push(this.message);
			talkedRecently[this.recipient] = tempList;
		}

		setTimeout(async () => {
			let tempList = talkedRecently[this.recipient];
			if (this.noCD === 0) {
				await tools.sendWhisper(this.recipient, this.sender, this.message);
			}
			tempList.shift();
			talkedRecently[this.recipient] = tempList;
			if (!talkedRecently[this.recipient].length) {
				delete talkedRecently[this.recipient];
				this.noCD = 0;
			}

		}, await this.Cooldown());
		return;
	}

};