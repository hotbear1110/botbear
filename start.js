require("dotenv").config();
const sql = require("./sql/index.js");

const init = async () => {
    return new Promise(async(Resolve) => {
        const sql_opts = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            connectTimeout: 10000,
        };
        
        await sql.New(sql_opts);

        /** @type { Array<SQL.Streamers> } */
        const channels = await sql.Query("SELECT * FROM Streamers");
        
        // Check if bot channel is in the database.
        if (!channels.find(({username}) => username === process.env.TWITCH_USER)) {
            const opts = {
                username: process.env.TWITCH_USER,
                uid: process.env.TWITCH_UID
            }
            await require("./tools/tools.js").joinChannel(opts);
        }
            
        await require("./commands/index.js").Load();
        await require("./connect/connect.js").setupChannels();
        await sql.Migrate()
        
        Resolve();
    })
}

init().then(() => {
    //require("./tools/logger.js");
    require("./bot.js");
    require("./loops/loops.js");
    require("./tools/webhook.js");
    console.log("Ready!");
})
.catch((e) => {
    console.error(`Unable to setup botbear: ${e}`);
    process.exit(1);
});

