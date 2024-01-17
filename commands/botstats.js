const shell = require('child_process');
const sql = require('./../sql/index.js');

module.exports = {
	name: 'botstats',
	ping: true,
	description: 'This command will give you some info about the bot',
	permission: 100,
	category: 'Info command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

			const test = shell.execSync('free -h');

			let total = test.toString().split(':')[1];

			total = total.split(' ');

			let used = total[17];
			total = total[10];

			const totalused = used.slice(3, -1);
			used = used.slice(0, -2);
			total = total.slice(0, -1);

			const cpu = shell.execSync('mpstat');

			let cpuused = cpu.toString().split('all')[1];
			console.log(cpuused);
			cpuused = `${cpuused.split('.')[0].replaceAll(' ', '')}.${cpuused.split('.')[1].slice(0, -2).replaceAll(' ', '')}`;

			let temp = shell.execSync('sensors');

			temp = temp.toString().split('+')[1];
			temp = temp.split(' ')[0];

			const commits = shell.execSync('git rev-list --all --count');

			let streamerCount = await sql.Query('SELECT uid FROM Streamers');

			return `CPU: ${cpuused}% - Memory: ${used}${totalused}B/${total}B - Temperature: ${temp} - Commits: ${commits} KKona - Currently active in ${streamerCount.length} channels.`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};