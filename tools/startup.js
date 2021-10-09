const tools = require("../tools/tools.js");
const _ = require("underscore");
const cc = require("../bot.js").cc;

start = async function () {
await tools.refreshCommands();

let bannedUsers = await tools.bannedStreamer;

if (await bannedUsers.length) {
    _.each(bannedUsers, async function (user) {
        await cc.part(user).then((data) => {
            // data returns [channel]
        }).catch((err) => {
            console.log(err);
        });
        await cc.say("#botbear1110", `Left channel ${user}. Reason: Banned/deleted channel`)
    })
}

let namechange = await tools.nameChanges;

if (await namechange.length) {
    _.each(namechange, async function (name) {
        await cc.join(name[0]).then((data) => {
            // data returns [channel]
        }).catch((err) => {
            console.log(err);
        });

        await cc.part(name[1]).then((data) => {
            // data returns [channel]
        }).catch((err) => {
            console.log(err);
        });

        await cc.say(`#${name[0]}`, `Name change detected, ${name[1]} -> ${name[0]}`)
        await cc.say("#botbear1110", `Left channel ${name[1]}. Reason: Name change detected, ${name[1]} -> ${name[0]}`)
    })
}
}

start()