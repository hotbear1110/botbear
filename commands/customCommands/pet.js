const sql = require('./../../sql/index.js');

module.exports = {
	name: 'pet',
	ping: true,
	description: 'Shows an image of a pet from a random chatter',
	permission: 100,
	cooldown: 1800, //in seconds
	category: 'channelSpecific command',
	opt_outable: false,
	showDelay: false,
	noBanphrase: true,
	channelSpecific: true,
	activeChannel: 'yabbe',
	// eslint-disable-next-line no-unused-vars
	execute: async (channel, user, input, perm, aliascommand) => {
		try {
			if (module.exports.permission > perm) {
				return;
			}

			switch(input[2]) {
				case 'add': {

					let isBanned = (await sql.Query('SELECT * FROM Yabbe_bans WHERE Command=? AND User=?', ['pet', user.username.toLowerCase()]));

					if (isBanned.length) {
						return;
					}

					let id = (await sql.Query('SELECT ID FROM Yabbe_pet'));

					id = id[id.length - 1].ID + 1;

					let msg = input.join(' ');

					this.user = [...msg.matchAll(/user:"([\sa-z0-9./:]+)"/gi)][0];
					this.user = (this.user) ? this.user[1] : user.username;
					this.pet = [...msg.matchAll(/pet:"([\sa-z0-9./:]+)"/gi)][0];
					this.pet = (this.pet) ? this.pet[1] : undefined;
					this.name = [...msg.matchAll(/name:"([\sa-z0-9./:]+)"/gi)][0];
					this.name = this.name ? this.name[1] : undefined;
					this.link = [...msg.matchAll(/link:"([\sa-z0-9./:]+)"/gi)][0];
					this.link = this.link ? this.link[1] : undefined;

					if (!this.user || !this.pet || !this.name || !this.link) {
						return 'Unexpected unput - Example: bb test add user:"NymN" pet:"Cat" name:"Apollo" link:"Link To Image"';
					}

					await sql.Query(`INSERT INTO Yabbe_pet 
        			(ID, User, Pet, Pet_name, Image) 
            			values 
        			(?, ?, ?, ?, ?)`,
				[id, this.user, this.pet, this.name, this.link]
				);
					return `Added new pet: ID: ${id} | User: ${this.user} | Pet: ${this.pet} | Pet Name: ${this.name} | Image: ${this.link} `;
				}
				case 'remove': {

					const isMod = user.mod || user['user-type'] === 'mod';
					const isBroadcaster = channel.toLowerCase() === user.username.toLowerCase();

					if (!isMod && !isBroadcaster && perm < 2000) {
						return 'Only mods can use this command';
					}

					if (!input[3])  {
						return 'Please provide an id to be removed'; 
					}

					if (input[3].startsWith('-') || input[3] === '0') {
						return '3rd input can\'t be negative or 0';
	
					}
					let isnumber = !isNaN(input[3]);
					if (!isnumber) {
						return '3rd input should be a number';
					}

					const pet = await sql.Query('SELECT * FROM Yabbe_pet WHERE ID=?', [input[3]]);

					if (!pet.length) {
						return 'No pet entry with id: ' + input[3];
					}

					await sql.Query('DELETE FROM Yabbe_pet WHERE ID=?', [input[3]]);

					return `Deleted pet image: ID: ${pet[0].ID} | User: ${pet[0].User} | Pet: ${pet[0].Pet} | Pet Name: ${pet[0].Pet_name} | Image: ${pet[0].Image} `;
				}
				case 'ban': {
					let isBanned = (await sql.Query('SELECT * FROM Yabbe_bans WHERE Command=? AND User=?', ['pet', input[3].toLowerCase()]));

					if (isBanned.length) {
						return 'That user is already banned';
					}

					await sql.Query(`INSERT INTO Yabbe_bans 
        			(Command, User) 
            			values 
        			(?, ?)`,
				['pet', input[3].toLowerCase()]
				);

					return `@${input[3]} Is now banned from adding pets`;
				}
				case 'unban': {
					let isBanned = (await sql.Query('SELECT * FROM Yabbe_bans WHERE Command=? AND User=?', ['pet', input[3].toLowerCase()]));

					if (!isBanned.length) {
						return 'That user is not banned';
					}

					await sql.Query(`DELETE FROM Yabbe_bans 
        			WHERE Command=? AND User=?`,
				['pet', input[3].toLowerCase()]
				);

					return `@${input[3]} Is now unbanned from adding pets`;
				}
				default: {
					let pets = await sql.Query('SELECT * FROM Yabbe_pet',);

					let users = [];
		
					pets.map(x => users.includes(x.User) ? false : users.push(x.User));
		
					let user =  users[~~(Math.random() * users.length - 1)];
		
					pets = pets.filter(x => (x.User === user));
		
					let pet =  pets[~~(Math.random() * pets.length - 1)];
		
					return `Random pet image: ID: ${pet.ID} | User: ${pet.User} | Pet: ${pet.Pet} | Pet Name: ${pet.Pet_name} | Image: ${pet.Image} `;
				}
			}

		} catch (err) {
			console.log(err);
			return 'FeelsDankMan Error';
		}
	}
};