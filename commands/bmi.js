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
	
			let weight = parseFloat(input[2]);
			let height = parseFloat(input[3]) / 100;
			let bmi = weight / (height ** 2);
	
			let bmiStatus = '';
			if (bmi < 18.5) {
				bmiStatus = 'Underweight';
			} else if (bmi >= 18.5 && bmi <= 24.9) {
				bmiStatus = 'Normal weight';
			} else if (bmi >= 25 && bmi <= 29.9) {
				bmiStatus = 'Overweight';
			} else if (bmi >= 30 && bmi <= 34.9) {
				bmiStatus = 'Obese';
			} else if (bmi >= 35) {
				bmiStatus = 'Extremely Obese';
			}
	
			bmi = bmi.toFixed(2);
	
			return `Your BMI is ${bmi}. You are ${bmiStatus}`;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};