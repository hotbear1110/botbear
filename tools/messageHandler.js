talkedRecently = {};

let oldmessage = "";

exports.messageHandler = class Cooldown {
    constructor(channel, message) {
        this.channel = channel;
        this.message = message;
        console.log(this.channel, this.message)
    }
    async Cooldown() {
        let cooldown = 1250;
        if (talkedRecently[this.channel]) {
            cooldown = 1250 * (talkedRecently[this.channel].length);

        }
        console.log(cooldown)

        return cooldown;
    }

    async newMessage() {

        if (talkedRecently[this.channel]) {
            let tempList = talkedRecently[this.channel]
            tempList.push(this.message)
            talkedRecently[this.channel] = tempList;
            console.log(tempList)
        } else {
            let tempList = [];
            tempList.push(this.message)
            console.log(tempList)
            talkedRecently[this.channel] = tempList;
        }

        setTimeout(() => {
            const cc = require("../bot.js").cc;

            if (this.message === oldmessage) {
                this.message = this.message + " 󠀀 ";
            }
            cc.say(this.channel, this.message);
            oldmessage = this.message;
            let tempList = talkedRecently[this.channel]
            tempList.shift()
            console.log(tempList)
            talkedRecently[this.channel] = tempList;
            if (!talkedRecently[this.channel].length) {
                delete talkedRecently[this.channel];
            }

        }, await this.Cooldown());
        return;
    }

};