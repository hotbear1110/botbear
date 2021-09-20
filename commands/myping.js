require('dotenv').config();
const tools = require("../tools/tools.js");
const axios = require('axios');

module.exports = {
    name: "myping",
    ping: true,
    description: "Makes the bot ping you, when the streamer is playing specific games",
    permission: 100,
    execute: async (channel, user, input, perm) => {
        try {
            if (this.permission > perm) {
                return;
            }
            switch (input[2]) {
                case "add":
                    const gameUsers = await tools.query(`SELECT * FROM Streamers WHERE username="${channel}"`);
                    let gameusers = JSON.parse(gameUsers[0].game_ping);

                    if (gameusers.includes(user.username)) {
                        return 'You should do "bb remove game" first';
                    }
                    input.splice(0, 3);
                    console.log(input.toString());
                    let emote = input.toString().replaceAll(',', ' ');
                    console.log(emote);
                    let realgame = await axios.get(`https://api.twitch.tv/helix/games?name=${emote}`, {
                        headers: {
                            'client-id': process.env.TWITCH_CLIENTID,
                            'Authorization': process.env.TWITCH_AUTH
                        },
                        timeout: 10000
                    });
                    if (!realgame.data.data[0]) {
                        return `"${emote}", is either not a twitch category, or it's not specific enough!`;
                    }
                    realgame = realgame.data.data[0];
                    realgame = realgame["name"];

                    let userchannel = [];
                    userchannel.push(`"${user.username}"`);
                    userchannel.push(`"${channel}"`);



                    const alreadyJoined = await tools.query(`
                SELECT *
                FROM MyPing
                WHERE username=?`,
                        [`[${userchannel}]`]);

                    if (!alreadyJoined.length) {
                        await tools.query('INSERT INTO MyPing (username, game_pings) values (?, ?)', [`[${userchannel}]`, `["${realgame}"]`]);
                        return `The game ${realgame} has been added to your ping list :)`;
                    }

                    let game_list = JSON.parse(alreadyJoined[0].game_pings);

                    if (game_list.includes(realgame)) {
                        return "That game is already in your ping list :) You can do 'bb myping list' to see your list.";
                    }
                    game_list.push(realgame);
                    game_list = JSON.stringify(game_list);
                    console.log(game_list);

                    await tools.query(`UPDATE MyPing SET game_pings=? WHERE username=?`, [game_list, `[${userchannel}]`])
                    return `The game ${realgame} has been added to your ping list :) You can do 'bb myping list' to see your list.`;


                    break;

                case "remove":
                    let userchannel2 = [];
                    userchannel2.push(`"${user.username}"`);
                    userchannel2.push(`"${channel}"`);

                    if (input.length == 4 && input[3] === "all") {
                        let removeall = [];
                        await tools.query(`UPDATE MyPing SET game_pings=? WHERE username=?`, [`[]`, `[${userchannel2}]`])
                        return `Your ping list is now empty :)`;

                    }
                    input.splice(0, 3);
                    let emote2 = input.toString().replaceAll(',', ' ');
                    let realgame2 = await axios.get(`https://api.twitch.tv/helix/games?name=${emote2}`, {
                        headers: {
                            'client-id': process.env.TWITCH_CLIENTID,
                            'Authorization': process.env.TWITCH_AUTH
                        },
                        timeout: 10000
                    });
                    if (!realgame2.data.data[0]) {
                        return `"${input}", is either not a twitch category, or it's not specific enough!`;
                    }
                    realgame2 = realgame2.data.data[0];
                    realgame2 = realgame2["name"];


                    const alreadyJoined2 = await tools.query(`
                SELECT *
                FROM MyPing
                WHERE username=?`,
                        [`[${userchannel2}]`]);

                    if (!alreadyJoined2.length) {
                        return `FeelsDankMan You don't have any games in your ping list to remove!`;
                    }

                    let game_list2 = JSON.parse(alreadyJoined2[0].game_pings);

                    if (!game_list2.includes(realgame2)) {
                        return "FeelsDankMan That game is not in your ping list! You can do 'bb myping list' to see your list.";
                    }

                    for (var i = 0; i < game_list2.length; i++) {

                        if (game_list2[i] === realgame2) {

                            game_list2.splice(i, 1);
                        }

                    }
                    game_list2 = JSON.stringify(game_list2);
                    console.log(game_list2);

                    await tools.query(`UPDATE MyPing SET game_pings=? WHERE username=?`, [game_list2, `[${userchannel2}]`])
                    return `The game ${realgame2} has been removed from your ping list :)`;
                    break;

                case "list":
                    let username = user.username;
                    if (input[3]) {
                        if (input[3].startsWith("@")) {
                            input[3] = input[3].substring(1);
                        }
                        username = input[3];
                    }
                    let userchannel3 = [];
                    userchannel3.push(`"${username}"`);
                    userchannel3.push(`"${channel}"`);

                    const alreadyJoined3 = await tools.query(`
                        SELECT *
                        FROM MyPing
                        WHERE username=?`,
                        [`[${userchannel3}]`]);

                    if (!alreadyJoined3.length || alreadyJoined3[0].game_pings == "[]") {
                        return `FeelsDankMan ! You don't have a game list yet. You should add a game first, by typing "bb myping add *game*"`;
                    }
                    else {

                        const gamelist = await tools.query(`SELECT * FROM MyPing WHERE username=?`, [`[${userchannel3}]`]);
                        let listgames = JSON.parse(gamelist[0].game_pings);
                        listgames = listgames.toString().replaceAll(',', '\n');
                        let user = "";
                        if (input[3]) {
                            user = `${input[3]}'s'`;
                        }

                        let hastebinlist = await tools.makehastebin(listgames, username, channel);

                        return `${user} Game list: ${hastebinlist}.txt`;
                        break;
                    }
            }

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}