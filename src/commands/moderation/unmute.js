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

module.exports = class UnmuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      usage: 'unmute <@membre/ID>',
      description: 'Démute un membre.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['unmute @GalackQSM']
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
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas réactiver le son d\'une personne ayant un rôle égal ou supérieur');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    if (!member.roles.cache.has(muteRoleId)) 
      return this.sendErrorMessage(message, 0, 'Provided member is not muted');
    
    message.client.clearTimeout(member.timeout);
    try {
      await member.roles.remove(muteRole);
      const embed = new MessageEmbed()
      .setTitle('Un membre viens d\'être démuter du serveur')
        .setDescription(`Le membre ${member} a été démuter.`)
        .addField('Raison', reason)
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      return this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
    }
    
    this.sendModLogMessage(message, reason, { Member: member });
  }
};
