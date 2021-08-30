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
const emojis = require('../../utils/emojis.json');

module.exports = class RemoveRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'removerole',
      aliases: ['remover', 'rr'],
      usage: 'removerole [@membre/ID] [@role/ID] [raison]',
      description: 'Supprime le rôle spécifié de l\'utilisateur fourni.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['removerole @GalackQSM @Membre']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un utilisateur ou fournir un ID utilisateur valide');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'Vous ne pouvez pas supprimer un rôle d\'une personne ayant un rôle égal ou supérieur');

    const role = this.getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]);

    let reason = args.slice(2).join(' ');
    if (!reason) reason = '`Aucune raison fourni`';
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    
    if (!role) 
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un rôle ou fournir un ID de rôle valide');
    else if (!member.roles.cache.has(role.id)) 
      return this.sendErrorMessage(message, 0, 'L\'utilisateur n\'a pas le rôle fourni');
    else {
      try {

        await member.roles.remove(role);
        const embed = new MessageEmbed()
          .setTitle('Un rôle a été supprimer')
          .setDescription(""+emojis.success+" Le rôle <@&"+role+"> a été supprimé avec succès.")
          .addField('Par', message.member, true)
          .addField('Membre', member, true)
          .addField('Rôle', role, true)
          .addField('Raison', reason)
          .setFooter(config.footer)
          .setTimestamp()
          .setColor("#2f3136");
        message.channel.send(embed);

        this.sendModLogMessage(message, reason, { Member: member, Role: role });

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }  
  }
};