require('dotenv').config();
const sql = require('../sql/index.js');

const init = async () => {
	return new Promise(async(Resolve) => {
		const sql_opts = {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			connectTimeout: 10000,
		};
        
		await sql.New(sql_opts);
                    
		Resolve();
	});
};

init().then(() => {
    require('../bot.js').cc;
	require('../tools/webhook.js');
	console.log('Ready!');
})
	.catch((e) => {
		console.error(`Unable to setup botbear/web: ${e}`);
		process.exit(1);
	});
