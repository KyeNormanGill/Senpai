const rethink = require('rethinkdb');

class Economy {
	constructor(client) {
		this.recentlyUpdated = [];
		this.client = client;
		this.db = client.db;
		this.databaseTable = 'money';
	}

	static bankUpdate() {
		setInterval(() => this._updatebank(), 18000000);
	}

	messageUpdate(member) {
		if (!member) return;
		if (this.recentlyUpdated.includes(member.user.id)) return;
		this.recentlyUpdated.push(member.user.id);
		setTimeout(() => this._addMoney(member), 5000);
		setTimeout(() => this._removeIDFromArray(member), 30000);
	}

	async _addMoney(member) {
		try {
			let { cash, bank } = await member.getEconomy();
			cash += 5;
			await member.updateEconomy(cash, bank);
		} catch (error) {
			return; // eslint-disable-line no-useless-return
		}
	}

	_removeIDFromArray(member) {
		this.recentlyUpdated.splice(this.recentlyUpdated.indexOf(member.id), 1);
	}

	static async _updatebank() {
		const connection = await rethink.connect();
		const dbName = 'Discord';
		const databaseTable = 'money';
		connection.use(dbName);
		rethink.table(databaseTable)
			.update({ bank: rethink.round(rethink.row('bank').mul(1.01)) })
			.run(connection, (err, response) => {
				if (err) throw err;
				connection.close();
				return response;
			});
	}
}

module.exports = Economy;
