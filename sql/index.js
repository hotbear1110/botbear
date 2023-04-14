const mysql = require('mysql2/promise');
const fs = require('node:fs');
const { resolve } = require('node:path');

const createDefaultMigrationTable = async (db) => {
	return db.Query(`
        CREATE TABLE IF NOT EXISTS Migration (
            version INTEGER NOT NULL,
            PRIMARY KEY (version)
        )
    `);
};

const getCurrentVersion = async (db) => {
	return new Promise((Resolve, Reject) => {
		db.Query(`
            SELECT version FROM Migration
            ORDER BY version DESC
            LIMIT 1
        `)
			.then(async (rows) => {
				if (rows !== null && rows[0]) {
					Resolve(rows[0].version);
				} else {
					await db.Query('INSERT INTO Migration (version) VALUES (0)');
					Resolve(0);
				}
			})
			.catch(Reject);
	});
};

module.exports = {
	/**
     * @type {mysql.Connection}
     */
	con: null,

	/**
     * Setup a new connection to the database.
     * @param {object} opts 
     * @returns {Promise<void>}
     */
	New: async function (opts) {
		this.con = await mysql.createPool(opts);

		this.con.on('error', (e) => {
			console.error('MySQL error: ' + e);
		});
		this.con.on('close', () => {
			console.log('MySQL connection closed');
		});

		return Promise.resolve();
	},
	/**
     * Raw query
     * @template T
     * @param {String} query
     * @param {Array<any>} data
     * @returns {Promise<Array<T>>}
     */
	Query: async function (query, data = []) {
		return await this.con.query(query, data)
			.then(([rows]) => {
				console.log('sql query: ' + rows);
				return rows;
			})
			.catch((err) => {
				// TODO Melon: Should this throw or not.
				console.error(new Error(`MySQL Error: ${err}`));
				return null;
			});
	},
	Transaction: async function (query) {
		// Run migration using transaction
		return await this.con.beginTransaction()
			.then(() => {
				return this.con.query(query);
			}
			)
			.then(() => {
				return this.con.commit();
			}
			)
			.catch((err) => {
				this.con.rollback();
				throw err;
			});
	},
	Migrate: async function () {
		await createDefaultMigrationTable(this);
		const currVersion = await getCurrentVersion(this);
		let newVersion = currVersion;
        
		const migrationsToRun = fs.readdirSync(resolve(__dirname, 'migrations'))
			.map((file) => {
				const [version, name] = file.split('_');
				return [Number(version), name];
			})
			.filter((v) => v[0] > currVersion);

		for (const [version, name] of migrationsToRun) {
			const migrationPath = resolve(__dirname, 'migrations', `${version}_${name}`);
			const data = fs.readFileSync(migrationPath, 'utf8')
				.split(';')
				.map((query) => query.trim())
				.filter(Boolean);

			console.debug(`Running migration ${version}_${name}`);
            
			for (const query of data) {
				await this.Transaction(query)
					.catch((err) => {
						console.error(`Error running migration ${version}_${name}: ${err}`);
						process.exit(1);
					});
			}

			await this.Query('UPDATE Migration SET version = ?', [version]);
            
			newVersion = version;
		}

		if (currVersion != newVersion) {
			console.log(`Migrated from version ${currVersion} to ${newVersion}`);
		}
	}
};