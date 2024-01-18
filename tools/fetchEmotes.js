const sql = require('../sql/index.js');
const { got } = require('./../got');
const EventSource = require('eventsource')

exports.STV_emotes = new Promise(async(Resolve) => {
    const user_ids = await sql.Query('SELECT uid FROM Streamers');

    

    for (const user of user_ids) {
        try {
            const STV_api = await got(`https://7tv.io/v3/users/twitch/${user.uid}`).json();

            if (STV_api.emote_set.emotes.length) {
                const emote_list = STV_api.emote_set.emotes.reduce(
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
        
                await sql.Query('UPDATE Streamers SET emote_set=?, emote_list=? WHERE uid=?', [STV_api.emote_set.id, JSON.stringify(emote_list), user.uid]);
            }

        } catch(error) {
            console.log(error);
        }

    }
    console.log(`Fetched all 7TV emotes`);
    Resolve()
}
)

exports.STV_events = new Promise(async() => {
    const emote_set_ids = await sql.Query('SELECT emote_set FROM Streamers');

    const baseURL = 'https://events.7tv.io/v3@';

    const events = []

    emote_set_ids.forEach(emote_set => {
        if (emote_set.emote_set) {
            events.push(`emote_set.update<object_id=${emote_set.emote_set}>`)
        }
    });

    const URL = baseURL + events.toString();

    const subscription = new EventSource(URL);
    
    subscription.addEventListener('open', () => {
        console.log('Connection opened')
    });

    subscription.addEventListener('close', () => {
        console.log('Connection closed')
    });
    
    subscription.addEventListener('error', (err) => {
        console.error("Subscription error: " + JSON.stringify(err))
        console.log("URL: " + URL)
    });


    subscription.addEventListener('dispatch', (update) => {
        if (JSON.parse(update.data).body.pushed) {
            console.log(JSON.parse(update.data).body.pushed.value.data)

            const id = JSON.parse(update.data).body.pushed.value.id
            const name = JSON.parse(update.data).body.pushed.value.name
            const time_added = JSON.parse(update.data).body.pushed.value.timestamp

        }
        if (JSON.parse(update.data).body.pulled) {
            console.log(JSON.parse(update.data).body.pulled)

            const id = JSON.parse(update.data).body.pulled.old_value.id
        }
    });

}
)