//  ______   __                      __                                  
// /      \ |  \                    |  \                                 
//|  $$$$$$\| $$  _______  ______  _| $$_     ______   ______   ________ 
//| $$__| $$| $$ /       \|      \|   $$ \   /      \ |      \ |        \
//| $$    $$| $$|  $$$$$$$ \$$$$$$\\$$$$$$  |  $$$$$$\ \$$$$$$\ \$$$$$$$$
//| $$$$$$$$| $$| $$      /      $$ | $$ __ | $$   \$$/      $$  /    $$ 
//| $$  | $$| $$| $$_____|  $$$$$$$ | $$|  \| $$     |  $$$$$$$ /  $$$$_ 
//| $$  | $$| $$ \$$     \\$$    $$  \$$  $$| $$      \$$    $$|  $$    \
// \$$   \$$ \$$  \$$$$$$$ \$$$$$$$   \$$$$  \$$       \$$$$$$$ \$$$$$$$$
//=======================================================================                                                                      
//● Crée par GalackQSM le 09 novembre 2019
//● Serveur Discord: https://discord.gg/Kcw3q53353
//● Github: https://github.com/GalackQSM/Alcatraz                                                      
//=======================================================================                                                                      
                                                                       
const Command = require('../Alcatraz.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { oneLine } = require('common-tags');
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

const channelTypes = {
  dm: 'DM',
  text: 'Texte',
  voice: 'Vocal',
  category: 'Categorie',
  news: 'News',
  store: 'Store'
};

module.exports = class ChannelInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'saloninfo',
      aliases: ['salon', 'ci'],
      usage: 'saloninfo [#salon/ID]',
      description: oneLine`
        Récupère des informations sur le salon fourni.
        Si aucun salon n'est indiqué, le salon actuel sera utilisé.
      `,
      type: client.types.INFO,
      examples: ['saloninfo #salon']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;
    const embed = new MessageEmbed()
      .setTitle('Information sur le salon')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField(''+emojis.library+' Salon', channel, true)
      .addField(''+emojis.id+' ID', `\`${channel.id}\``, true)
      .addField(''+emojis.members+' Type', `\`${channelTypes[channel.type]}\``, true)
      .addField(''+emojis.members+' Membres', `\`${channel.members.size}\` membres`, true)
      .addField(''+emojis.emojis+' Emojis', `\`${this.client.emojis.cache.size}\` emojis`, true)
      .addField(''+emojis.bot+' Bots', `\`${channel.members.array().filter(b => b.user.bot).length}\` bots`, true)
      .addField(''+emojis.creation+' Créé le', `\`${moment(channel.createdAt).format('DD/MM/YYYY')}\``, true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    if (channel.type === 'text') {
      if (channel.topic) embed.setDescription(channel.topic);
      embed 
        .spliceFields(3, 0, { name: ''+emojis.uptime+' Slowmode', value: `\`${channel.rateLimitPerUser}\` secondes`, inline: true })
        .spliceFields(6, 0, { name: ''+emojis.nsfw+' NSFW', value: `\`${channel.nsfw}\``, inline: true });
    } else if (channel.type === 'voice') {
      embed 
        .spliceFields(0, 1, { name: 'Salon', value: `<735665114870710413> ${channel.name}`, inline: true })
        .spliceFields(5, 0, { name: 'Limite utilisateur', value: `\`${channel.userLimit}\``, inline: true })
        .spliceFields(6, 0, { name: 'Plein', value: `\`${channel.full}\``, inline: true });
      const members = channel.members.array();
      if (members.length > 0) 
        embed.addField('Membres rejoints', message.client.utils.trimArray(channel.members.array()).join(' '));
    }
    message.channel.send(embed);
  }
};
