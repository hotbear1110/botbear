const tools = require('../tools/tools.js');
const sql = require('./../sql/index.js');

module.exports = {
  name: 'help',
  ping: true,
  description: 'This command will give you information about any other command. Example: "bb help followage"',
  permission: 100,
  category: 'Core command',
  noBanphrase: true,
  execute: async (channel, user, input, perm) => {
    if (module.exports.permission > perm) {
      return;
    }

    if (!input[2]) {
      return 'List of commands: https://hotbear.org/ - If you want help with a command, write: "bb help *command*"';
    }

    input = input.slice(2).join(' ');
    input = await tools.Alias(input);

    const command = await sql.query('SELECT * FROM Commands WHERE Name=?', [input]);

    if (!command.length) {
      return 'Command not found FeelsDankMan';
    }

    let cooldown = command[0].Cooldown || 3;

    if (command[0].Name === 'trivia' || command[0].Name === 'trivia2') {
      let cd = await sql.query('SELECT trivia_cooldowns FROM Streamers WHERE username = ?', [channel]);

      if (!cd[0].trivia_cooldowns) {
        cd[0].trivia_cooldowns = 30000;
        await sql.query('UPDATE Streamers SET trivia_cooldowns = 30000 WHERE username = ?', [channel]);
      }

      cooldown = cd[0].trivia_cooldowns / 1000;
    }

    return `${command[0].Command} - Permission lvl: ${command[0].Perm} - Cooldown: ${cooldown}s`;
  }
};