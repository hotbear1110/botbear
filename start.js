(async () => {
    require('dotenv').config();
    const sql = require('./sql/index.js');

    const sql_opts = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectTimeout: 10000,
        waitForConnections: true,
        connectionLimit: 20,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0
    };

    await sql.New(sql_opts);
    //await sql.Migrate();

    const got = require('./got');
    await got.Setup();

    /** @type { Array<SQL.Streamers> } */
    const channels = await sql.Query('SELECT username, uid FROM Streamers');
    const { joinChannel } = require('./tools/tools.js');

    /// TODO: uid are defined as ints in the database, we don't want that, they are defined as strings by twitch themselfes.
    /// As such if in the future there would be changes to uid's such as adding a letter or something, we would have a big problem.
    /// We should change the uid's to strings in the database.
    /// And remove that String casting.
    const checkOwner = channels.find(({ uid }) => String(uid) === process.env.TWITCH_OWNERUID);
    if (!checkOwner) {
        const user = {
            username: process.env.TWITCH_OWNER,
            uid: process.env.TWITCH_OWNERUID,
        };

        await joinChannel(user, false);
    }

    // Check if bot channel is in the database.
    if (!channels?.find(({ username }) => username === process.env.TWITCH_USER)) {
        const opts = {
            username: process.env.TWITCH_USER,
            uid: process.env.TWITCH_UID
        };
        await joinChannel(opts);
    }

    await require('./commands/index.js').Load();
    
    const redis = require('./tools/redis.js').Get();
    await redis.Connect();
    await redis.Subscribe('EventSub');

    require('./tools/markovLogger.js');
    await require('./connect/connect.js').setupChannels.then(require('./bot.js'));
    require('./loops/loops.js');
    //await require('./tools/fetchEmotes.js').STV_emotes;
    //require('./tools/fetchEmotes.js').STV_events;

    console.log('Ready!');
})();
