const shell = require("child_process")
const tools = require("../tools/tools.js");

module.exports = {
    name: "botstats",
    ping: true,
    description: 'This command will give you some info about the bot',
    permission: 100,
    category: "Info command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }

            const test = shell.execSync("free -h")

            let total = test.toString().split(":")[1]

            total = total.split(" ")

            let used = total[17];
            total = total[10];

            used = used.slice(0, -2);
            total = total.slice(0, -1);

            const cpu = shell.execSync("mpstat")

            let cpuused = cpu.toString().split("all")[1]
            cpuused = cpuused.split(" ")[4]

            let temp = shell.execSync("sensors");

            temp = temp.toString().split("+")[1];
            temp = temp.split(" ")[0]

            const commits = shell.execSync('git rev-list --all --count');

            let streamerCount = await tools.query(`SELECT * FROM Streamers`);



            return `CPU: 9000% - Memory: 69MB/420GB - Temperature: -45C - Commits: 1 KKona - Currently active in every channels.`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}