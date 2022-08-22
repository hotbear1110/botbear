(async () => {
    require('dotenv').config();
    const sql = require('./sql/index.js');
    
    const sql_opts = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectTimeout: 10000,
    };

    await sql.New(sql_opts);
    await sql.Migrate();

    /** @type { Array<SQL.Streamers> } */
    const channels = await sql.Query('SELECT username, uid FROM Streamers');

    /// TODO: uid are defined as ints in the database, we don't want that, they are defined as strings by twitch themselfes.
    /// As such if in the future there would be changes to uid's such as adding a letter or something, we would have a big problem.
    /// We should change the uid's to strings in the database.
    /// And remove that String casting.
    const checkOwner = channels.find(({uid}) => String(uid) === process.env.TWITCH_OWNERUID);
    if (!checkOwner) {
        await sql.Query(`
            INSERT INTO Streamers (username, uid, live_ping, offline_ping, title_ping, game_ping, emote_list, emote_removed, disabled_commands)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            // eslint-disable-next-line
            [process.env.TWITCH_OWNERNAME, process.env.TWITCH_OWNERUID, "['']", "['']", "['']", "['']", '[]', '[]', '[]']);
    }

    // Check if bot channel is in the database.
    if (!channels?.find(({username}) => username === process.env.TWITCH_USER)) {
        const opts = {
            username: process.env.TWITCH_USER,
            uid: process.env.TWITCH_UID
        };
        await require('./tools/tools.js').joinChannel(opts);
    }

    await require('./commands/index.js').Load();
    await require('./connect/connect.js').setupChannels();
    
    const redis = require('./tools/redis.js').Get();
    await redis.Connect();
    await redis.Subscribe('EventSub');

    //require("./tools/logger.js");
    require('./bot.js');
    require('./loops/loops.js');
    
    console.log('Ready!');
})();