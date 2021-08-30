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

module.exports = class SoftBanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'softban',
      usage: 'softban <@membre/ID> [raison]',
      description: oneLine`
        Softbans un membre de votre serveur (banni puis débloque immédiatement).
        Cela efface tous les messages de ce membre de votre serveur.`,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['softban @GalackQSM']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas vous bannir'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas bannir une personne ayant un rôle égal ou supérieur');
    if (!member.bannable)
      return this.sendErrorMessage(message, 0, 'Le membre fourni ne peut pas être banni');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    await member.ban({ reason: reason });
    await message.guild.members.unban(member.user, reason);

    const embed = new MessageEmbed()
      .setTitle('Un membre viens d\'être softban')
      .setDescription(`Le membre **${member}** a été softban avec succès.`)
      .addField('Par', message.member, true)
      .addField('Membre', member, true)
      .addField('Raison', reason)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
    message.client.logger.info(`${message.guild.name}: ${message.author.tag} à été softban ${member.user.tag}`);
        
    this.sendModLogMessage(message, reason, { Member: member});
  }
};
