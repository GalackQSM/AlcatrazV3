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
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');
const statuses = {
  online: 'En Ligne',
  idle: 'Inactif',
  offline: 'Hors Ligne',
  dnd: 'Ne pas déranger'
};
const flags = {
  DISCORD_EMPLOYEE: ''+emojis.discord_employee+' `Staff Discord`',
  DISCORD_PARTNER: ''+emojis.discord_partner+' `Partenaire Discord`',
  BUGHUNTER_LEVEL_1: ''+emojis.bughunter_level_1+' `Chasseur de bugs (Level 1)`',
  BUGHUNTER_LEVEL_2: ''+emojis.bughunter_level_2+' `Chasseur de bugs (Level 2)`',
  HYPESQUAD_EVENTS: ''+emojis.hypesquad_events+' `Événements HypeSquad`',
  HOUSE_BRAVERY: ''+emojis.house_bravery+' `Maison de la bravoure`',
  HOUSE_BRILLIANCE: ''+emojis.house_brilliance+' `Maison de la brillance`',
  HOUSE_BALANCE: ''+emojis.house_balance+' `Maison de l\'équilibre`',
  EARLY_SUPPORTER: ''+emojis.early_supporter+' `Premier partisan`',
  TEAM_USER: 'Utilisateur d\'équipe',
  SYSTEM: 'Système',
  VERIFIED_BOT: ''+emojis.verified_bot+' `Bot vérifié`',
  VERIFIED_DEVELOPER: ''+emojis.verified_developer+' `Développeur de bot vérifié`'
};

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['ui'],
      usage: 'userinfo [@membre/ID]',
      description: 'Récupère les informations d\'un membre. Si aucun utilisateur n\'est indiqué, vos propres informations seront affichées.',
      type: client.types.INFO,
      examples: ['userinfo @Alcatraz']
    });
  }
  async run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const userFlags = (await member.user.fetchFlags()).toArray();
    const activities = [];
    let customStatus;
    for (const activity of member.presence.activities.values()) {
      switch (activity.type) {
        case 'PLAYING':
          activities.push(`Joue **${activity.name}**`);
          break;
        case 'LISTENING':
          if (member.user.bot) activities.push(`Ecoute **${activity.name}**`);
          else activities.push(`Ecoute **${activity.details}** par **${activity.state}**`);
          break;
        case 'WATCHING':
          activities.push(`Regarde **${activity.name}**`);
          break;
        case 'STREAMING':
          activities.push(`Stream **${activity.name}**`);
          break;
        case 'CUSTOM_STATUS':
          customStatus = activity.state;
          break;
      }
    }
    
    let roles = message.client.utils.trimArray(member.roles.cache.array().filter(r => !r.name.startsWith('#')));
    roles = message.client.utils.removeElement(roles, message.guild.roles.everyone)
      .sort((a, b) => b.position - a.position).join(' ');
    
    const embed = new MessageEmbed()
      .setTitle(`Information sur le membre: ${member.displayName} `)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addField(''+emojis.pseudo+' Pseudo', `\`${member.user.username}\``, true)
      .addField(''+emojis.discriminateur+' Discriminateur', `\`#${member.user.discriminator}\``, true)
      .addField(''+emojis.id+' ID', `\`${member.id}\``, true)
      .addField(''+emojis.surnom+' Surnom', (member.nickname) ? member.nickname : '`Aucun`', true)
      .addField(''+emojis.statut+' Statut', `\`${statuses[member.presence.status]}\``, true)
      .addField(''+emojis.roles+' Rôle de couleur', member.roles.color || '`Aucun`', true)
      .addField(''+emojis.roles+' Rôle le + élevé', member.roles.highest, true)
      .addField(''+emojis.join_serveur+' Rejoint le serveur le', `\`${moment(member.joinedAt).format('DD/MM/YYYY')}\``, true)
      .addField(''+emojis.join_discord+' Rejoint Discord le', `\`${moment(member.user.createdAt).format('DD/MM/YYYY')}\``, true)
      .addField(''+emojis.roles+' Rôles', roles || '`Aucun`', true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    if (activities.length > 0) embed.setDescription(activities.join('\n'));
    if (customStatus) embed.spliceFields(0, 0, { name: 'Statut personnalisé', value: customStatus});
    if (userFlags.length > 0) embed.addField(''+emojis.badge+' Badges', userFlags.map(flag => flags[flag]).join('\n'));
    message.channel.send(embed);
  }
};
