const { MessageEmbed } = require('discord.js');
const { spoiler } = require('@discordjs/builders');
const fetch = require('node-fetch').default;
const color = require('../../color.json');
module.exports = {
	name: 'joke',
	description: 'Gives a funny joke 😆',
	aliases: ['pun'],
	usage: '(joke id)',
	cooldown: 3,
	category: 'fun',
	options: {
		id: {
			type: 'Integer',
			description: 'The joke id you want',
			required: false,
		},
	},
	async execute(message, args) {
		const id = parseInt(args[0]);

		if (!args[0]) {
			const joke = await getRandomJoke();
			const embed = new MessageEmbed()
				.setTitle(`😆 ${joke.question}`)
				.setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
				.setColor(color.bot_theme)
				.setDescription(`${spoiler(joke.answer)}`)
				.setFooter({ text: `ID: ${joke.id} | The ${message.client.user.username}` })
				.setTimestamp();

			return await message.reply({ embeds: [embed] });
		}
		if (isNaN(id)) {
			return await message.reply({ embeds: [
				new MessageEmbed()
					.setColor('RED')
					.setDescription('<:X_:807305490160943104> That doesn\'t seem to be a valid number.'),
			] });
		} else if (id < 0 || id > 100) {
			return await message.reply({ embeds: [
				new MessageEmbed()
					.setColor('RED')
					.setDescription('<:X_:807305490160943104> You need to input a number between 0 and 100.'),
			] });
		}
		const joke = await getJokeByID(id);
		const embed = new MessageEmbed()
			.setTitle(`😆 ${joke.question}`)
			.setAuthor({ name: `${message.author.username}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true })}` })
			.setColor(color.bot_theme)
			.setDescription(`${spoiler(joke.answer)}`)
			.setFooter({ text: `ID: ${id} | The ${message.client.user.username}` })
			.setTimestamp();

		await message.reply({ embeds: [embed] });
	},
	async executeSlash(interaction) {
		const wait = require('util').promisify(setTimeout);
		await interaction.deferReply();
		await wait(1);
		const id = interaction.options.getInteger('id');
		const user = interaction.user;
		if (!id) {
			const joke = await getRandomJoke();
			const embed = new MessageEmbed()
				.setTitle(`😆 ${joke.question}`)
				.setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
				.setColor(color.bot_theme)
				.setDescription(`${spoiler(joke.answer)}`)
				.setFooter({ text: `ID: ${joke.id} | The ${interaction.client.user.username}` })
				.setTimestamp();

			return await interaction.editReply({ embeds: [embed] });
		} else if (id < 0 || id > 100) {
			return await interaction.editReply({ embeds: [
				new MessageEmbed()
					.setColor('RED')
					.setDescription('<:X_:807305490160943104> You need to input a number between 0 and 100.'),
			] });
		}
		const joke = await getJokeByID(id);
		const embed = new MessageEmbed()
			.setTitle(`😆 ${joke.question}`)
			.setAuthor({ name: `${user.username}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
			.setColor(color.bot_theme)
			.setDescription(`${spoiler(joke.answer)}`)
			.setFooter({ text: `ID: ${id} | The ${interaction.client.user.username}` })
			.setTimestamp();

		await interaction.editReply({ embeds: [embed] });
	},
};
const baseURL = 'https://blague.xyz/';
async function getJoke(path) {
	const url = new URL(`/api/joke/${path}`, baseURL);

	url.searchParams.set('lang', 'EN');
	const res = await fetch(url);

	if (!res.ok) {throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);}

	const obj = await res.json();

	if (obj.error) {
		throw new Error('The returned object has an error');
	}

	return obj.joke;
}
function getRandomJoke() {
	return getJoke('random');
}
function getJokeByID(id) {
	return getJoke(`${id}`);
}
