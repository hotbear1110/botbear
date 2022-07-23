const sql = require('../sql/index.js');
const CONSTANTS = require('./constants');

exports.validateIsPositiveBot = (input, user) => {
    if (user['user-id'] !== CONSTANTS.POSITIVE_BOT) return false;
    if ([...input].includes('your cooldown has been reset!')) return false;
    return true;
};

/**
 * 
 * @param { import("tmi.js").ChatUserstate } user 
 * @param { String[] } input 
 * @param { String } channel 
 * @returns { Promise<{ Status: 'Confirmed' | '', User: String }> }
 */
exports.setCdr = async (input, channel) => {
    return new Promise(async (Resolve) => {
        const realuser = input[1].replace(',', '');
        
        await sql.Query(`SELECT COUNT(*) AS Count FROM Cdr AS Foo
                        WHERE EXISTS(SELECT * FROM Cdr WHERE User = ?)`, [realuser])
        .then(async(res) => {
            const response = 'Confirmed';
            const time = Date.now() + 10800000;
            
            if (res[0].Count !== 0) {
               await sql.Query(`UPDATE Cdr 
                            SET Status=?, 
                                Channel=?, 
                                RemindTime=? 
                        WHERE User=?`, [response, channel, time, realuser]);
                                
                Resolve({ Status: response, User: realuser });
            } else {
                Resolve({ Status: '', User: '', Channel: ''});
            }
            return;
        });
    });
};
