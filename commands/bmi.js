module.exports = {
    name: "bmi",
    ping: true,
    execute: async (channel, user, input, perm) => {
        try {
            let bmi = input[1]/(input[2]**2)
            return bmi;
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}