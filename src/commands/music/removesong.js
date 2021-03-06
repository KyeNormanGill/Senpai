const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'removesong',
	description: 'removes a certian song from the queue',
	aliases: ['deletesong'],
	examples: ['removesong 5', 'removesong 3', 'removesong 8']
};

class RemoveSongCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params) {
		let number = params[0];
		number = Number(number);
		const { me, client } = msg.guild;
		let { prefix } = await msg.guild.getConfig();
		prefix = prefix ? prefix : client.config.prefix;
		if (!me.voiceChannelID) return msg.reply(`Im not in a Voice channel on this Server!`);
		if (!msg.guild.music.playing) return msg.reply(`I don't play music at the moment!`);
		if (number === 1) return msg.reply(`You try to delete the current playing song from the queue use ${prefix}skip instead`);
		if (isNaN(number)) return msg.reply('I only accpet the queue number in this command');
		if (number <= 0) return msg.channel.send('There is no Song which is in queue place 0 or less :thinking:');
		if (number > msg.guild.music._queue.length) return msg.channel.send("You can't try to delete a song that is not there!");
		const indexnumber = number - 1;
		await msg.channel.send(`I've deleted the Song ${msg.guild.music._queue[indexnumber].info.title} from the queue`);
		msg.guild.music.remove(indexnumber);
	}
}

module.exports = RemoveSongCommand;
