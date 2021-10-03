const { MessageEmbed } = require('discord.js');
const statuses = {
	online: '<:online:806215585415168040> Online',
	dnd: '<:dnd:806215804773335120> Do not disturb',
	idle: '<:Idle:806215585267712062> Idle',
	offline: '<:offline:806216568660164659> Offline',
};
/** @type {Record<import("discord.js").UserFlagsString & `HOUSE_${string}`, string>} */
const allBadges = {
	HOUSE_BALANCE: '<:HOUSE_BALANCE:885673359537500180>',
	HOUSE_BRAVERY: '<:HOUSE_BRAVERY:885673359579426856>',
	HOUSE_BRILLIANCE: '<:HOUSE_BRILLIANCE:885673359600406598>',
};
module.exports = {
	name: 'user-info',
	description: 'Gets the mentioned user\'s info!',
	usage: '(@user or userid)',
	guildOnly: true,
	aliases: ['who-is'],
	cooldown: 3,
	category: 'info',
	clientPermissons: 'EMBED_LINKS',
	options: {
		user: {
			type: 'User',
			description: 'The user to get the info of',
			required: false,
		},
	},
	async execute(message, args, client) {
		const member = args[0]
			? message.mentions.members.first() || message.guild.members.cache.get(args[0])
			: message.member;

		if (!member) {
			return message.channel.send('Member not found');
		}
		const roles = member.roles.cache.map(role => role.toString());
		let color = member.displayHexColor;
		if (color === '#000000') {color = '#C0C0C0';}

		const badges = member.id === client.user.id
			? ['<:VERIFIED_BOT:885673359474569226>']
			: Object.keys(allBadges).filter(b => member.user.flags.has(b)).map(b => allBadges[b]);

		if (member.id === message.guild.ownerId) {badges.push('<:serverowner:885673359885606942>');}

		const status = statuses[member.presence?.status ?? 'offline'];
		const embed = new MessageEmbed()
			.setTitle(`${member.user.username}`)
			.setColor(color)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setImage(await member.user.bannerURL())
			.addField('Username', member.user.tag)
			.addField('ID', member.id, true)
			.addField('Account Created', member.user.createdAt.toDateString(), true)
			.addField('Joined Server', member.joinedAt.toDateString(), true)
			.addField('Current VC: ', member.voice.channel === null ? 'None' : `<:voice_channel:804772497684693052> ${member.voice.channel.name}`, true)
			.addField('Status: ', status, true)
			.addField('Roles', roles.join(' **|** '), true)
			.addField('Badges: ', badges.join(' ') || 'None', true)
			.setFooter(`Powered by the ${message.client.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		return await message.reply({ embeds: [embed] });
	},
	/**
   * @param {CommandInteraction} interaction
   * @param {import("discord.js").Client} client
   */
	async executeSlash(interaction, client) {
		/** @type {GuildMember} */
		// eslint-disable-next-line no-extra-parens
		const member = (interaction.options.getMember('user') ?? interaction.member);

		if (!member) {
			return interaction.reply('Member not found');
		}
		const roles = member.roles.cache.map(role => role.toString());
		let color = member.displayHexColor;
		if (color === '#000000') {color = '#C0C0C0';}

		const badges = member.id === client.user.id
			? ['<:VERIFIED_BOT:885673359474569226>']
			: Object.keys(allBadges).filter(b => member.user.flags.has(b)).map(b => allBadges[b]);

		if (member.id === interaction.guild.ownerId) {badges.push('<:serverowner:885673359885606942>');}

		const status = statuses[member.presence?.status ?? 'offline'];
		const embed = new MessageEmbed()
			.setTitle(`${member.user.username}`)
			.setColor(color)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setImage(await member.user.bannerURL())
			.addField('Username', member.user.tag)
			.addField('ID', member.id, true)
			.addField('Account Created', member.user.createdAt.toDateString(), true)
			.addField('Joined Server', member.joinedAt.toDateString(), true)
			.addField('Current VC: ', member.voice.channel === null ? 'None' : `<:voice_channel:804772497684693052> ${member.voice.channel.name}`, true)
			.addField('Status: ', status, true)
			.addField('Roles', roles.join(' **|** '), true)
			.addField('Badges: ', badges.join(' ') || 'None', true)
			.setFooter(`Powered by the ${interaction.client.user.username}`, member.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		return await interaction.reply({ embeds: [embed] });
	},
};