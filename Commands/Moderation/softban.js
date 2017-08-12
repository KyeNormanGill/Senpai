const Discord = require('discord.js');
const rethink = require('rethinkdb');
const config  = require('../../config/config.json')
const async   = require('async')
exports.run = async (client, msg, args) => {
     async function banAndUnban(member, reason, channel) {
        const message = await channel.send(`trying to softban ${member.user.tag}`)
        try{
        const ban = await member.ban({
                reason,
                "days": 7
        })
        const newMessage = await message.edit(`successfully banned ${member.user.tag} Awaiting unban ...`)
        const unban = await member.guild.unban(ban.user)
        await newMessage.edit(`successfully softbanned ${unban.tag}`)
        const embed = new Discord.RichEmbed()
            .setAuthor(msg.author.username, msg.author.avatarURL)
            .setColor(0x00AE86)
            .setTimestamp()
            .addField("Command", "Softban")
            .addField("Member", `${member.user.tag} (${member.user.id})`)
            .addField("Reason", reason)

        const connection = await rethink.connect()
        connection.use('Discord')
        rethink.table('guildConfig')
            .get(msg.guild.id)
            .run(connection, (err, result) => {
                if (err) throw err
                connection.close()
                if (result.ModlogID === "None") {
                    let prefix
                    if(result.customPrefix === "None") {
                        prefix = config.prefix
                    } else {
                        prefix = result.customPrefix
                    }
                    msg.guild.defaultChannel.send(`You didn't added a Modlog so i write my Logs in the default Channel\nadd one with ${prefix}setmodlog, so my logs are seperated`, {embed})
                }else{
                    msg.guild.channels.get(result.ModlogID).send({embed})
                }
            })
        }catch(error) {
            message.edit(`i had an error while trying to softban the member if this happens often & i have the needed permissions you should contact my DEV!`)
        }
    }
    if(msg.channel.type != "text") return msg.channel.send("You can run this command only on a Server!")
    const connection = await rethink.connect()
    connection.use('Discord')
    rethink.table('guildConfig')
    .get(msg.guild.id)
    .run(connection, (err, result) => {
        if (err) throw err
        const ModroleIDs = result.ModerationRolesIDs
        let prefix = result.customPrefix
        if(prefix === "None") prefix = config.prefix
        let haveModerationRole = false
        async.forEach(ModroleIDs, function(ID, callback) {
            if(msg.member.roles.has(ID)) haveModerationRole = true
            callback();
        }, function() {
            if(haveModerationRole === false && msg.guild.owner.id !== msg.author.id && msg.author.id !== config.OwnerID) return msg.reply(`You have no role that is registered as an Moderation Role! add/remove these in my configuration with ${prefix}modrole`)
            if (msg.mentions.members.size < 1) return msg.reply('You must mention someone for this Command.')
            let member   = msg.mentions.members.first()
            if (!member.kickable) return msg.reply('I have no rights to softban that User');
            if(msg.member.highestRole.comparePositionTo(member.highestRole) <= 0 && msg.guild.owner.id !== msg.author.id) return msg.reply("You can't softban someone with an higher or the same roleposition!")
            let reason = args.slice(1).join(' ');
            if (reason.length < 1) return msg.reply('You must supply a reason for the softban.');
            banAndUnban(member, reason, msg.channel)
        })
    })
}

exports.help = {
    'name': 'softban',
    'description': 'bans a mentioned Member and unban him after that so all of his messages in the last 7 days are deleted',
    'usage': 'softban [@User] [reason]'
}

exports.alias = ["softbanne"]
