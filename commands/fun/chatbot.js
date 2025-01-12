const { MessageEmbed } = require('discord.js');
const smartestchatbot = require('smartestchatbot');
const chatbot = new smartestchatbot.Client();
const sendError = require('../../error.js');
module.exports = {
	name: 'chatbot',
	description: 'Talk a AI controlled bot! 🤖',
	aliases: ['bot', 'ai'],
	cooldown: 3,
	category: 'fun',
	options: {
		message: {
			type: 'String',
			description: 'The message to send to the AI controlled bot',
		},
	},
	async execute(message, args, client) {
		const query = args.join(' ');

		if (!args.length) {return sendError('I need a message to reply to!', message.channel);}

		const reply = await chatbot.chat({ message: query, name: client.user.username, owner: 'NotBacon#4259', user: message.author.id, language: 'en' });
		const embed = new MessageEmbed()
			.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dymamic: true }) })
			.setDescription(`${reply}`)
			.setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL({ dymamic: true }) })
			.setTimestamp()
			.setColor(message.channel.type === 'GUILD_TEXT' ? message.guild.me.displayHexColor : '#FFB700');

		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const query = interaction.options.getString('message');
		const { client } = interaction;
		const wait = require('util').promisify(setTimeout);
		await interaction.deferReply();
		await wait(1);
		const reply = await chatbot.chat({ message: query, name: client.user.username, owner: 'NotBacon#4259', user: interaction.user.id, language: 'en' });
		const embed = new MessageEmbed()
			.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dymamic: true }) })
			.setDescription(`${reply}`)
			.setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dymamic: true }) })
			.setTimestamp()
			.setColor(interaction.channel.type === 'GUILD_TEXT' ? interaction.guild.me.displayHexColor : '#FFB700');
		await interaction.editReply({ embeds: [embed] });
	},
};
