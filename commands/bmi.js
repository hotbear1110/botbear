module.exports = {
    name: "bmi",
    ping: true,
    description: 'This command will calculate your bmi. Format: "bb bmi weight(kg) height(bm)". Example: "bb bmi 65 180"',
    permission: 100,
    category: "Random command",
    execute: async (channel, user, input, perm) => {
        try {
            if (module.exports.permission > perm) {
                return;
            }
            let bmi = (input[3]**2)/10000
            return input[2]/bmi
        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}