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
const permissions = require('../../utils/permissions.json');
const { oneLine } = require('common-tags');
const config = require('../../../config.json');

module.exports = class PermissionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'permissions',
      aliases: ['perms'],
      usage: 'permissions [@membre/ID]',
      description: oneLine`
        Affiche toutes les autorisations actuelles pour l'utilisateur spécifié.
        Si aucun utilisateur n'est donné, vos propres autorisations seront affichées.
      `,
      type: client.types.INFO,
      examples: ['permissions @Alcatraz']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    const memberPermissions = member.permissions.toArray().sort((a, b) => {
      return Object.keys(permissions).indexOf(a) - Object.keys(permissions).indexOf(b);
    }).map(p => '`' + permissions[p] + '`').join('\n');
    const embed = new MessageEmbed()
      .setTitle(`Permissions de ${member.displayName}`)
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(memberPermissions)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};