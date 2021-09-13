module.exports = async member => {
	const Discord = require('discord.js');
	const { MessageEmbed } = require('discord.js');
	const color = require('../color.json');
	const Canvas = require('canvas');
	const db = require('quick.db');
	const { registerFont } = require('canvas');
	const { Client, MessageAttachment } = require('discord.js');
	var welcomeChannel = db.get('welcomechannel_' + member.guild.id);
	var welcomeChannel = member.guild.channels.cache.get(welcomeChannel);
	// registerFont('./OpenSans-Regular.ttf', { family: 'sans-serif' });
	registerFont('./BalooTammudu2-Regular.ttf', { family: 'sans-serif' });
	const applyText = (canvas, text) => {
		const ctx = canvas.getContext('2d');

		// Declare a base size of the font
		let fontSize = 70;

		do {
			// Assign the font to the context and decrement it so it can be measured again
			ctx.font = `${fontSize -= 10}px sans-serif`;
			// Compare pixel width of the text to the canvas minus the approximate avatar size
		} while (ctx.measureText(text).width > canvas.width - 300);

		// Return the result to use in the actual canvas
		return ctx.font;
	};

	const guild = member.guild;

	var modLogChannel = db.get('loggingchannel_' + guild.id);
	var modLogChannel = guild.channels.cache.get(modLogChannel);
	// Send the message to a designated channel on a server:
	/* const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome-and-goodbye');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Hey ${member}, welcome to **${guild.name}!**`);*/
	// member.send(`Have a good time here in **${guild.name}**! Please make sure to read the rules before sending in #rules. If you have a problem with this server, Dm @ModMail#5460 for help. `);

	if (!welcomeChannel) return;

	const canvas = Canvas.createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	ctx.font = '32px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`Hey ${member.user.username},`, canvas.width / 2.5, canvas.height / 3.5);

	ctx.font = '34px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText('welcome to the', canvas.width / 2.5, canvas.height / 2.2);

	// Add an exclamation point here and below
	ctx.font = '48px sans-serif';
	ctx.fillStyle = '#ffffff';
	ctx.fillText(`${guild.name}!`, canvas.width / 2.5, canvas.height / 1.3);

	ctx.beginPath();
	ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
	ctx.drawImage(avatar, 25, 25, 200, 200);

	const welattachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	welcomeChannel.send({ content: `Hey ${member}, welcome to **${guild.name}!**`, files: [welattachment] });

	if (!modLogChannel) return;
	const embed = new MessageEmbed()
		.setAuthor('Member joined', 'https://cdn.discordapp.com/emojis/812013459298058260.png')
		.setColor(color.bot_theme)
		.setDescription(`${member} joined ${member.guild.name}`)
		.addField('Account Created:', `${member.user.createdAt.toDateString()}`, true)
		.setFooter('COOL BOI BOT MEMBER LOGGING')
		.setTimestamp();
		//modLogChannel.send({ embeds: [embed] }).catch(console.error);
	const webhooks = await modLogChannel.fetchWebhooks();
	const webhook = webhooks.first();

	await webhook.send({		
		username: 'COOL BOI BOT Logging',
		avatarURL: 'https://images-ext-1.discordapp.net/external/IRCkcws2ACaLh7lfNgQgZkwMtAPRQvML2XV1JNugLvM/https/cdn.discordapp.com/avatars/811024409863258172/699aa52d1dd597538fc33ceef502b1e6.png',
		embeds: [embed],
	});

};