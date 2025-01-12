const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const db = require('quick.db');
const { getLogChannel } = require('../utils.js');
const color = require('../color.json');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["channelUpdate"]) => Promise<any>} */
module.exports = async (oldchannel, newchannel) => {
	if (oldchannel.type === 'DM' || oldchannel.name === newchannel.name) return;

	const logChannel = getLogChannel(oldchannel.guild, db);

	const { client } = newchannel;

	if (!logChannel) return;

	const botPerms = logChannel.permissionsFor(newchannel.guild.me);

	if (!botPerms.has('VIEW_CHANNEL')) return;

	if (!botPerms.has('SEND_MESSAGES')) return;

	if (!botPerms.has('MANAGE_WEBHOOKS')) return;

	const jumpToChannel = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setURL(`https://discord.com/channels/${newchannel.guild.id}/${newchannel.id}`)
				.setLabel('Go to channel')
				.setEmoji('⬆️')
				.setStyle('LINK'),
		);
	const embed = new MessageEmbed()
		.setAuthor({ name: '📝 Channel updated' })
		.setColor(color.bot_theme)
		.setDescription(`Channel Updated ${oldchannel}`)
		.addField('Old channel:', `${oldchannel.name}`, true)
		.addField('New channel:', `${newchannel.name}`, true)
		.setFooter({ text: `${client.user.username} SERVER LOGGING` })
		.setTimestamp();
	const webhooks = await logChannel.fetchWebhooks();
	const webhook = webhooks.find(wh => wh.token);

	await webhook.send({
		username: `${client.user.username} Logging`,
		avatarURL: config.webhookAvatarURL,
		embeds: [embed],
		components: [jumpToChannel],
	});
};
