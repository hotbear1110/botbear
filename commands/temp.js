module.exports = {
	name: 'temp',
	ping: true,
	description: 'This command will convert temperatures ',
	permission: 100,
	cooldown: 3, //in seconds
	category: 'Random command',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}
            //bb temp toC 144
            let value;
switch (input[2]) {
  case 'toC':
    value=~~((input[3] - 32) * 5/9)+'°C';
    break;
  case 'toF':
    value=~~(input[3] * 9/5) + 32+'°F';
    break;

}
            return value;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};