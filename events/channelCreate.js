const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const color = require('../color.json');
const db = require('quick.db');
const { getLogChannel } = require('../utils.js');
const config = require('../config.json');
/** @type {(...args: import("discord.js").ClientEvents["channelCreate"]) => Promise<any>} */
module.exports = async channel => {
	if (channel.type === 'DM') return;

	const logChannel = getLogChannel(channel.guild, db);

	const { client } = channel;

	if (!logChannel) return;

	const botPerms = logChannel.permissionsFor(channel.guild.me);

	if (!botPerms.has('VIEW_CHANNEL')) return;

	if (!botPerms.has('MANAGE_WEBHOOKS')) return;

	if (!botPerms.has('SEND_MESSAGES')) return;

	const jumpToChannel = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setURL(`https://discord.com/channels/${channel.guild.id}/${channel.id}`)
				.setLabel('Go to channel')
				.setEmoji('⬆️')
				.setStyle('LINK'),
		);
	const embed = new MessageEmbed()
		.setAuthor({ name: '🔨 Channel created' })
		.setColor(color.success)
		.setDescription(`Created channel ${channel}`)
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
