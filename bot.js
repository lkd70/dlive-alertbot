'use strict';

const dlive = require('dlivetv-unofficial-api');
const config = require('./config');
const axios = require('axios');

const bots = [];

config.channels.forEach(channel => bots.push({ dlive: new dlive(channel.id, config.authkey), channel }));

bots.forEach(bot => {
	bot.dlive.on('ChatLive', () => {
		bot.dlive.getChannelInformation(bot.channel.name, res => {
			axios.post(bot.channel.webhook, {
				content: bot.channel.tag,
				embeds: [ {
					title: `${bot.channel.name} - ${res.livestream.category.title}`,
					type: 'rich',
					description: `${bot.channel.name} is going live!`,
					url: `https://dlive.tv/${bot.channel.name}`,
					thumbnail: { url: res.avatar },
					image: { url: res.livestream.category.imgUrl },
					fields: [
						{ name: 'Category', value: res.livestream.category.title }
					]
				}
				]
			});
		});
	});
});
