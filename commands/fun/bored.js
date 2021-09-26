module.exports = {
	name: 'bored',
	description: 'Gives you something to do! 🤷',
	cooldown: 3,
	category: 'fun',
	async execute(message, args) {
		const fetch = require('node-fetch'); const activity = await fetch('http://www.boredapi.com/api/activity/');

		activity.json();
		const user = message.author;
		const color = require('../../color.json');
		const { MessageEmbed } = require('discord.js');
		const embed = new MessageEmbed()
			.setColor(color.bot_theme)
			.setTitle('Thing to do')
			.setURL(activity.link)
			.setDescription(activity.activity)
			.addField('**Type: **', activity.type, true)
			.addField('**Participants: **', activity.participants.toString(), true)
			.addField('**Accessibility: **', activity.accessibility.toString(), true)
			.setFooter(user.username, user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		await message.reply({ embeds: [embed] });
	},
};