module.exports = {
    name: "bmi",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let bmi = (input[3]**2)/10000
            return input[2]/bmi
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}