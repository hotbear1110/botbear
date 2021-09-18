module.exports = {
    name: "test",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let Time = new Date().getTime();
            let RemindTime = Time + 7200000;


            return RemindTime;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}