module.exports = {
	name: 'swag',
	description: 'Returns a random mathematical fact that equals 15',
	ping: true,
	permission: 0,
	category: 'Fun command',
	noBanphrase: true,
	execute: async (channel, user, input, perm) => {
		try {
			const mathFacts = [
			  'If she is the first Erdős–Woods number, Swag.',
			  'If she is the largest integer n for which 2^n+1 is prime, Swag.',
			  'If she is the base of the hexadecimal number system, Swag.',
			  'If she is the only integer that equals m^n and n^m, for some unequal integers m and n, Swag.',
			  'If she is the fourth power of two, Swag.',
			  'If she is the amount of partially ordered sets with 4 unlabeled elements, Swag.',
			  'If she is the smallest number with 2 representations as a sum of 2 distinct primes, Swag.',
			  'If she is quadratic residues modulo 0, 1, 4, 9, Swag.',
			  'If she is unicode: U+0010, Swag.',
			  'If she has the prime factorization of 2^4, Swag.',
			  'If she is the sum of five consecutive odd numbers, Swag.',
			  'If she is the only solution to the equation (n-2)! + (n-1)! = n!, Swag.',
			  'If she is the sum of the first three factorials, Swag.',
			  'If she is the sum of the cubes of the first two prime numbers, Swag.',
			  'If she is the product of the first three prime numbers, Swag.',
			  'If she is the fourth root of 50625, Swag.'
			];
			const mathFact = mathFacts[Math.floor(Math.random() * mathFacts.length)];
			return mathFact;
		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};