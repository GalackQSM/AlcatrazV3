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
const { oneLine } = require('common-tags');
const config = require('../../../config.json');

module.exports = class ClearWarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearwarns',
      usage: 'clearwarns <@membre/ID> [raison]',
      description: 'Efface tous les avertissements du membre fourni.',
      type: client.types.MOD,
      userPermissions: ['KICK_MEMBERS'],
      examples: ['clearwarns @GalackQSM']
    });
  }
  run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas effacer vos propres avertissements'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas effacer les avertissements d\'une personne ayant un rôle égal ou supérieur');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    message.client.db.users.updateWarns.run('', member.id, message.guild.id);

    const embed = new MessageEmbed()
      .setTitle('Suppression de tous les avertissements')
      .setDescription(`Les avertissements de ${member} ont été effacés avec succès.`)
      .addField('Par', message.member, true)
      .addField('Membre', member, true)
      .addField('Nombre d\'avertissement', '`0`', true)
      .addField('Raison', reason)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
    message.client.logger.info(oneLine`
      ${message.guild.name}: ${message.author.tag} a effacé les avertissements de ${member.user.tag}
    `);
    
    this.sendModLogMessage(message, reason, { Membre: member, 'Nombre d\'avertissements': '`0`' });
  }
};
