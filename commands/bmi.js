module.exports = {
	name: 'bmi',
	ping: true,
	description: 'This command will calculate your bmi. Format: "bb bmi weight(kg) height(cm)". Example: "bb bmi 65 180"',
	permission: 100,
	category: 'Random command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

			if (!input[3]) {
				return 'Format should be: "bb bmi weight(kg) height(cm)"';
			}
			let text = '';
			let bmi = (input[3] ** 2) / 10000;
			bmi = input[2] / bmi;

			if (bmi <= 18.5) {
				text = 'Underweight';
			}
			if (bmi >= 18.5 && 24.9 >= bmi) {
				text = 'Normal weight';
			}
			if (bmi >= 25 && 29.9 >= bmi) {
				text = 'Overweight';
			}
			if (bmi >= 30 && 34.9 >= bmi) {
				text = 'Obese';
			}
			if (bmi >= 35) {
				text = 'Extremly obese';
			}

			bmi = bmi.toString().substring(0, 5);

			return `${bmi} - ${text}`;

		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};