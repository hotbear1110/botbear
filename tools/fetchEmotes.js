const sql = require('../sql/index.js');
const { got } = require('./../got');

exports.STV_emotes = new Promise(async(Resolve) => {
    const user_ids = await sql.Query('SELECT uid FROM Streamers');

    for (const user of user_ids) {
        try {
            const STV_api = await got(`https://7tv.io/v3/users/twitch/${user.uid}`).json();

            const emote_list = [];


            if (STV_api.emote_set.emotes.length) {
                emote_list = STV_api.emote_set.emotes.reduce(
                    (emote_list, emote) => { 
                        emote_list.push(
                        {
                            "name": emote.name,
                            "id": emote.id,
                            "time_added": emote.timestamp,
                            "uploader": (emote.data.owner?.username !== undefined) ? emote.data.owner.username : 'Unknown',
                            "platform": "7TV"
                        }
                        ); return emote_list;
                    }, []);
        
                await sql.Query('UPDATE Streamers SET emote_list=? WHERE uid=?', [JSON.stringify(emote_list), user.uid]);
            }

        } catch(error) {
            console.log(error);
        }

    }
    console.log(`Fetched all 7TV emotes`);
    Resolve()
}
)