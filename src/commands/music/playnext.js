const Commands = require('../../structures/new/Command.js');
const info = {
	name: 'playnext',
	description: 'add a song to the queue as #2 position. Important! this Command takes no playlists',
	aliases: [],
	examples: ['playnext Adele Hello', 'playnext https://www.youtube.com/watch?v=YQHsXMglC9A']
};

class PlayNextCommand extends Commands {
	constructor(client, group) {
		super(client, info, group);
	}

	async run(msg, params, prefix) {
		const { voiceConnection } = msg.guild;
		const guildConfig = await msg.guild.getConfig();
		let channel = msg.guild.channels.get(guildConfig.musicID);
		const musicChannel = channel || msg.channel;
		const isLimited = await msg.guild.getConfig();
		if (isLimited.musicLimited) {
			const permissionLevel = await msg.member.getPermissionsLevel();
			if (permissionLevel > 3) return msg.reply("on this server the music feature is limited to music roles and since you don't have one you dont have permission to do this Command!");
		}
		if (voiceConnection === null) return msg.reply(`You must let me join a Voice Channel with ${prefix}join!`);
		const message = await msg.channel.send('trying to add your Song at next position to the queue....');
		let link = params[0];
		if (!link) return message.edit('You must add a Link to add behind!');
		if (link.startsWith('http')) {
			if (link.includes('watch') || link.includes('youtu.be')) {
				try {
					const result = await msg.guild.getMusic().handleSongAsNext(link, msg.author, true, musicChannel);
					message.edit(`**Queued:** ${result.title}`);
				} catch (error) {
					message.edit(`Could not add the Song/Playlist because this reason ${error.message}`);
				}
			} else if (link.includes('playlist')) {
				return message.edit("this command don't accept Playlists!");
			}
		} else {
			try {
				const searchTerm = params.join(' ');
				const result = await msg.guild.getMusic().handleSongAsNext(searchTerm, msg.author, false, musicChannel);
				message.edit(`**Queued:** ${result.title}`);
			} catch (error) {
				message.edit(`Could not add the Song/Playlist because this reason ${error.message}`);
			}
		}
	}
}

module.exports = PlayNextCommand;
