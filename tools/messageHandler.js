const tools = require("./tools.js");

talkedRecently = {};

let oldmessage = "";

exports.messageHandler = class Cooldown {
    constructor(channel, message) {
        this.channel = channel;
        this.message = message;
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
        const cc = require("../bot.js").cc;
        if (this.channel === "#forsen") {
            let newmessage = tools.splitLine(this.message, 150)
            if (newmessage[1]) {
                if (!newmessage[0].length) {
                    this.message = "ForsenLookingAtYou Message is too long";
                } else {
                    this.message = newmessage[0] + " ...";
                }
            }
        }

        this.message = await tools.checkAllBanphrases(this.message, this.channel);

        if (talkedRecently[this.channel]) {
            this.noCD = 0
            let tempList = talkedRecently[this.channel]
            tempList.push(this.message)
            talkedRecently[this.channel] = tempList;
        } else {
            if (!(this.message.includes("Reminder to eat your cookie nymnOkay") || this.message.includes("Reminder to eat your cookie nymnOkay 󠀀 ")) || oldmessage !== this.message) {
                if (!(this.message.includes("Your cookie cdr is ready.") || this.message.includes("Your cookie cdr is ready. 󠀀 ")) || oldmessage !== this.message) {
                    cc.say(this.channel, this.message);
                }
            }
            this.noCD = 1;
            let tempList = [];
            tempList.push(this.message)
            talkedRecently[this.channel] = tempList;
        }

        setTimeout(() => {
            let tempList = talkedRecently[this.channel]
            if (this.noCD === 0) {
                if (!(this.message.includes("Reminder to eat your cookie nymnOkay") || this.message.includes("Reminder to eat your cookie nymnOkay 󠀀 ")) || oldmessage !== this.message) {
                    if (!(this.message.includes("Your cookie cdr is ready.") || this.message.includes("Your cookie cdr is ready. 󠀀 ")) || oldmessage !== this.message) {
                        if (this.message === oldmessage) {
                            this.message = this.message + " 󠀀 ";
                        }
                        cc.say(this.channel, this.message);
                    }
                }
            }
            oldmessage = this.message;
            tempList.shift()
            talkedRecently[this.channel] = tempList;
            if (!talkedRecently[this.channel].length) {
                delete talkedRecently[this.channel];
                this.noCD = 0
            }

        }, await this.Cooldown());
        return;
    }

};