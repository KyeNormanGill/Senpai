const { Command } = require('klasa');


module.exports = class PatCommand extends Command {
	constructor(...args) {
		super(...args, {
			cooldown: 5,
			usage: '[member:member]',
			botPerms: ['ATTACH_FILES'],
			description: 'Pat someone or get pat'
		});
	}

	async run(msg, [member]) {
		const { url } = await this.wolkeHandler.getRandom({ type: this.name, hidden: false, nsfw: false, filetype: 'gif' });
		return msg.send(new this.client.methods.Embed()
			.setDescription(member ? `${msg.member} pat ${member}` : `${msg.member} got pat`)
			.setImage(url)
		);
	}
};
