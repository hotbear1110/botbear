const shell = require("child_process")

module.exports = {
    name: "uptime",
    ping: true,
    description: 'This command will tell you how long the bot has been live for',
    permission: 100,
    category: "Bot command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }

            const test = shell.execSync("free -h")

            let total = test.toString().split(":")[1]

            total = total.split(" ")

            let used = total[18];
            total = total[11];

            used = used.slice(0, -2);
            total = total.slice(0, -1);

            const cpu = shell.execSync("mpstat")

            let cpuused = cpu.toString().split("all")[1]
            cpuused = cpuused.split(" ")[3]

            let temp = shell.execSync("vcgencmd measure_temp");

            temp = temp.split("=")[1];


            return `CPU: ${cpuused}% - Memory: ${used}/${total}B - Temperature: ${temp}`;

        } catch (err) {
            console.log(err);
            return `FeelsDankMan Error`;
        }
    }
}