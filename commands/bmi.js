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
            let text = "";
            let bmi = (input[3]**2)/10000;
            bmi = input[2]/bmi;

console.log(24.9 >= bmi >= 18.5)
console.log(bmi)
            if (bmi <= 18.5) {
                text = "Underweight";
            }
            if (24.9 >= bmi >= 18.5) {
                text = "Normal weight";
            }
            if (29.9 >= bmi >= 25) {
                text = "Overweight";
            }
            if (34.9 >= bmi >= 30) {
                text = "Obese";
            }
            if (bmi >= 35) {
                text = "Extremly obese";
            }

            return `${bmi} - ${text}`

        } catch (err) {
            console.log(err);
            return ` Error FeelsBadMan `;
        }
    }
}