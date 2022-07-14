module.exports = {
	'env': {
		'node': true,
		'browser': false,
		'commonjs': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest'
	},
	'rules': {
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'no-async-promise-executor': 'off',
        'no-unused-vars': [1, {
            'varsIgnorePattern': '_'
        }]
	}
};
