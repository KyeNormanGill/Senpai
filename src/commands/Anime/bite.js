const { Command } = require('klasa');

module.exports = class BiteCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '[member:member]',
			botPerms: ['ATTACH_FILES'],
			description: 'Bite someone or get bitten'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.wolkeHandler.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(
			new this.client.methods.Embed()
				.setDescription(member ? `${member} got bitten by ${msg.member}` : `${msg.member} got bitten`)
				.setImage(url)
		);
	}
};
