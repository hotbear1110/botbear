const tools = require("./tools.js");

talkedRecently = {};

exports.whisperHandler = class Cooldown {
    constructor(user, message) {
        this.user = user;
        this.message = message;
        this.noCD = 0;
    }

    async Cooldown() {
        let cooldown = 1250;
        if (talkedRecently[this.user]) {
            cooldown = 1250 * (talkedRecently[this.user].length);

        }
        return cooldown;
    }

    async newWhisper() {
        const cc = require("../bot.js").cc;

        if (talkedRecently[this.user]) {
            this.noCD = 0
            let tempList = talkedRecently[this.user]
            tempList.push(this.message)
            talkedRecently[this.user] = tempList;
        } else {
            cc.whisper(this.user, this.message);
            this.noCD = 1;
            let tempList = [];
            tempList.push(this.message)
            talkedRecently[this.user] = tempList;
        }

        setTimeout(() => {
            let tempList = talkedRecently[this.user]
            if (this.noCD === 0) {
                cc.whisper(this.user, this.message);
            }
            tempList.shift()
            talkedRecently[this.user] = tempList;
            if (!talkedRecently[this.user].length) {
                delete talkedRecently[this.user];
                this.noCD = 0
            }

        }, await this.Cooldown());
        return;
    }

};