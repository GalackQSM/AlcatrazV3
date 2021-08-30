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
const moment = require('moment');
const emojis = require('../../utils/emojis.json');
const region = {
  'us-central': 'US Central :flag_us:',
  'us-east': 'US East :flag_us:',
  'us-south': 'US South :flag_us:',
  'us-west': 'US West :flag_us:',
  'europe': 'Europe :flag_eu:',
  'singapore': 'Singapour :flag_sg:',
  'japan': 'Japon :flag_jp:',
  'russia': 'Russie :flag_ru:',
  'hongkong': 'Hong Kong :flag_hk:',
  'brazil': 'Brésil :flag_br:',
  'sydney': 'Sydney :flag_au:',
  'southafrica': 'Afrique du sud :flag_za:'
};
const verificationLevels = {
  NONE: 'Aucune',
  LOW: 'Faible',
  MEDIUM: 'Moyens',
  HIGH: 'Elevé',
  VERY_HIGH: 'Très élevé'
};

module.exports = class ServerInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      aliases: ['server', 'si'],
      usage: 'serverinfo',
      description: 'Récupère des informations et des statistiques sur le serveur.',
      type: client.types.INFO
    });
  }
  run(message) {

    let roles = message.client.utils.trimArray(
      message.guild.roles.cache.array().filter(r => !r.name.startsWith('#'))
    );
    roles = message.client.utils.removeElement(roles, message.guild.roles.everyone);
    roles.sort((a, b) => b.position - a.position);

    const textChannels = message.client.utils.trimArray(
      message.guild.channels.cache.array().filter(c => c.type === 'text').sort((a, b) => a.rawPosition - b.rawPosition)
    );
    
    const voiceChannels = message.client.utils.trimArray(
      message.guild.channels.cache.array().filter(c => c.type === 'voice')
    );
    
    const embed = new MessageEmbed()
      .setTitle(`Information du serveur: ${message.guild.name}`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField(''+emojis.id+' ID', `\`${message.guild.id}\``, true)
      .addField(''+emojis.owner+' Propriétaire', message.guild.owner, true)
      .addField(''+emojis.world+' Région', region[message.guild.region], true)
      .addField(''+emojis.members+' Membres', `\`${message.guild.memberCount}\` membres`, true)
      .addField(''+emojis.bot+' Bots', `\`${message.guild.members.cache.array().filter(b => b.user.bot).length}\` bots`, true)
      .addField(''+emojis.roles+' Nombre de rôles', `\`${message.guild.roles.cache.size - 1}\` rôles`, true) //
      .addField(''+emojis.text+' Salon texte', `\`${textChannels.length}\` salons`, true)
      .addField(''+emojis.voice+' Salon vocaux', `\`${voiceChannels.length}\` salons`, true)
      .addField(''+emojis.verification+' Vérification', `\`${verificationLevels[message.guild.verificationLevel]}\``, true)
      .addField(''+emojis.afk+' Salons AFK', 
        (message.guild.afkChannel) ? `${message.guild.afkChannel.name}` : '`Aucun`', true
      )
      .addField(''+emojis.afk+' AFK Temps libre', 
        (message.guild.afkChannel) ? 
          `\`${moment.duration(message.guild.afkTimeout * 1000).asMinutes()} minutes\`` : '`Aucun`', 
        true
      )
      .addField(''+emojis.creation+' Créé le', `\`${moment(message.guild.createdAt).format('DD/MM/YYYY')}\``, true)
      .addField(''+emojis.boost+' Nombre boosts', `\`${message.guild.premiumSubscriptionCount || 0}\` Boosts`, true)
      .addField(''+emojis.roles+' Les rôles', roles.join(' '))
      .addField(''+emojis.text+' Salons textes', textChannels.join(' ') || '`Aucun`')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    if (message.guild.description) embed.setDescription(message.guild.description);
    if (message.guild.bannerURL) embed.setImage(message.guild.bannerURL({ dynamic: true }));
    message.channel.send(embed);
  }
};
