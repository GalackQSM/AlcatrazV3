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
const config = require('../../../config.json');

module.exports = class BlastCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'annonce',
      usage: 'Annonce <message>',
      description: 'Envoie un message à chaque serveur dans lequel se trouve Alcatraz et qui a un salon système.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['Annonce Mise à jour d\'Alcatraz!']
    });
  }
  run(message, args) {
    if (!args[0]) return this.sendErrorMessage(message, 0, 'Veuillez fournir un message');
    const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    const guilds = [];
    message.client.guilds.cache.forEach(guild => {
      const systemChannelId = message.client.db.settings.selectSystemChannelId.pluck().get(guild.id);
      const systemChannel = guild.channels.cache.get(systemChannelId);
      if (
        systemChannel && 
        systemChannel.viewable &&
        systemChannel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
      ) {
        const embed = new MessageEmbed()
          .setTitle(`Message système ${config.NomBot}`)
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .setDescription(msg)
          .setFooter(config.footer)
          .setTimestamp()
          .setColor("#2f3136");
        systemChannel.send(embed);
      } else guilds.push(guild.name);
    });
  
    if (guilds.length > 0) {
      const description = message.client.utils.trimStringFromArray(guilds);

      const embed = new MessageEmbed()
        .setTitle('Échecs du message d\'envoi')
        .setDescription(description)
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");
      message.channel.send(embed);
    }
  } 
};