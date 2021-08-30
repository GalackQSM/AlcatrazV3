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

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      usage: 'warn <@membre/ID> [raison]',
      description: 'Avertir un membre de votre serveur.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      examples: ['warn @GalackQSM']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous prévenir'); 
    if (member.roles.highest.position >= message.member.roles.highest.position) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas avertir quelqu\'un avec un rôle égal ou supérieur');

    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id); 

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    let warns = message.client.db.users.selectWarns.pluck().get(member.id, message.guild.id) || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);
    const warning = {
      mod: message.member.id,
      date:  moment().format('DD/MM/YYYY'),
      Raison: reason
    };

    warns.warns.push(warning);
    
    message.client.db.users.updateWarns.run(JSON.stringify(warns), member.id, message.guild.id);

    const embed = new MessageEmbed()
      .setTitle('Un membre viens d\'être averti')
        .setDescription(`Le membre ${member} a réçu un avertissement.`)
      .addField('Par', message.member, true)
      .addField('Membre', member, true)
      .addField('Nombre d\'avertissement', `\`${warns.warns.length}\``, true)
      .addField('Raison', reason)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} a averti ${member.user.tag}`);
    
    this.sendModLogMessage(message, reason, { Membre: member, 'Nombre d\'avertissement': `\`${warns.warns.length}\`` });

    if (autoKick && warns.warns.length === autoKick) {
      message.client.commands.get('kick')
        .run(message, [member.id, `Limite d'avertissement atteinte. Lancé automatiquement par ${message.guild.me}.`]);
    }
  }
};
