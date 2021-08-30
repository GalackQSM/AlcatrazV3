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
const ms = require('ms');
const config = require('../../../config.json');

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      usage: 'mute <@membre/ID> <temps> [raison]',
      description: 'Coupe un utilisateur pendant la durée spécifiée (14 jours maximum).',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['mute @GalackQSM 10s', 'mute @GalackQSM 30m spam']
    });
  }
  async run(message, args) {

    const muteRoleId = message.client.db.settings.selectMuteRoleId.pluck().get(message.guild.id);
    let muteRole;
    if (muteRoleId) muteRole = message.guild.roles.cache.get(muteRoleId);
    else return this.sendErrorMessage(message, 1, 'Il n\'y a actuellement aucun rôle muet défini sur ce serveur');

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous auto mute');
    if (member === message.guild.me) return this.sendErrorMessage(message, 0, 'Tu ne peux pas me mute');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas mute une personne ayant un rôle égal ou supérieur');
    if (!args[1])
      return this.sendErrorMessage(message, 0, 'Veuillez saisir une durée de 14 jours ou moins (1s/m/h/d)');
    let time = ms(args[1]);
    if (!time || time > 1209600000)
      return this.sendErrorMessage(message, 0, 'Veuillez saisir une durée de 14 jours ou moins (1s/m/h/d)');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (member.roles.cache.has(muteRoleId))
      return this.sendErrorMessage(message, 0, 'Si le membre est déjà muter');

    try {
      await member.roles.add(muteRole);
    } catch (err) {
      message.client.logger.error(err.stack);
      return this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
    }
    const muteEmbed = new MessageEmbed()
      .setTitle('Un membre viens d\'être mute')
      .setDescription(`${member} a été mis mute depuis **${ms(time, { long: true })}**.`)
      .addField('Par', message.member, true)
      .addField('Membre', member, true)
      .addField('Temps', `\`${ms(time)}\``, true)
      .addField('Raison', reason)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(muteEmbed);

    member.timeout = message.client.setTimeout(async () => {
      try {
        await member.roles.remove(muteRole);
        const unmuteEmbed = new MessageEmbed()
          .setTitle('Un membre viens d\'être démute')
          .setDescription(`${member} a été démuter.`)
          .setFooter(config.footer)
          .setTimestamp()
          .setColor("#2f3136");
        message.channel.send(unmuteEmbed);
      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }, time);

    this.sendModLogMessage(message, reason, { Membre: member, Temps: `\`${ms(time)}\`` });
  }
};
