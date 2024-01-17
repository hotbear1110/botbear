const sql = require('../sql/index.js');
const { got } = require('./../got');

exports.STV_emotes = new Promise(async(Resolve) => {
    const user_ids = await sql.Query('SELECT uid FROM Streamers');

    for (const user_id in user_ids) {
        const STV_api = await got(`7tv.io/v3/users/twitch/${user_id}`).json();

        const emote_list = []
        STV_api.emote_set.emotes.array.forEach(emote => {
            emote_list.push(
                {
                    "name": emote.name,
                    "id": emote.id,
                    "time_added": emote.timestamp,
                    "uploader": emote.data.owner.username,
                    "platform": "7TV"
                }
            )
        });

        await sql.Query('UPDATE Streamers SET emote_list=? WHERE uid=?', [emote_list, user_id]);
    }
    console.log(`Fetched all 7TV emotes`);
    Resolve()
}
)