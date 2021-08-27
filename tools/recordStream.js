const { exec } = require("child_process");


exports.recordStream = (date) => {
    exec(`sudo streamlink twitch.tv/hotbear1110 best -o /opt/TwitchBots/Botbear2.0/nymn2/${date}.mp4`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

}
