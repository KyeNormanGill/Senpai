const { Command } = require('klasa');

module.exports = class PlayNextCommand extends Command {
	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			cooldown: 5,
			usage: '<song_or_playlist:str>',
			description: 'Add a Song/Playlist/Livestream from Youtube/Soundcloud/Twitch on the next playing position in the queue.'
		});
	}

	async run(msg, [...query]) {
		if (!msg.guild.music.channelID) msg.guild.music.channelID = msg.channel.id;
		await msg.send('*adding your Song/Playlist to the queue....*');
		const player = this.client.lavalink.players.get(msg.guild.id);
		if (!player) return;
		try {
			let songs;
			if (this.isLink(query)) {
				songs = await this.client.lavalink.resolveTrack(query);
			} else {
				let arr = [];
				const searchResult = await this.client.lavalink.resolveTrack(`ytsearch: ${query}`);
				arr.push(searchResult[0]);
				songs = arr;
			}
			if (songs.length > 1) {
				await this._playlist(songs, msg, { name: msg.member.displayName, url: msg.member.user.displayAvatarURL() });
			} else {
				await this._song(songs[0], msg, { name: msg.member.displayName, url: msg.member.user.displayAvatarURL() });
			}
		} catch (error) {
			await msg.send(error.message);
		}
	}

	async _playlist(songs, message, requestor) {
		for (const song of songs) {
			song.user = requestor;
			message.guild.music.queueNext(song);
		}
		await message.send(`**Queued** ${songs.length} songs.`);
	}

	async _song(song, message, requestor) {
		song.user = requestor;
		message.guild.music.queueNext(song);
		await message.send(`**Queued:** ${song.info.title}.`);
	}

	isLink(input) {
		return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g.test(input); // eslint-disable-line no-useless-escape
	}
};