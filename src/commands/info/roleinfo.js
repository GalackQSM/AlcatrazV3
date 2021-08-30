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
const permissions = require('../../utils/permissions.json');
const config = require('../../../config.json');

module.exports = class RoleInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roleinfo',
      aliases: ['role', 'ri'],
      usage: 'roleinfo <@role/ID>',
      description: 'Récupère des informations sur le rôle fourni.',
      type: client.types.INFO,
      examples: ['roleinfo @membre']
    });
  }
  run(message, args) {

    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!role)
      return this.sendErrorMessage(message, 0, 'Veuillez mentionner un rôle ou fournir un ID de rôle valide');

    const rolePermissions = role.permissions.toArray();
    const finalPermissions = [];
    for (const permission in permissions) {
      if (rolePermissions.includes(permission)) finalPermissions.push(`+ ${permissions[permission]}`);
      else finalPermissions.push(`- ${permissions[permission]}`);
    }

    const position = `\`${message.guild.roles.cache.size - role.position}\`/\`${message.guild.roles.cache.size}\``;

    const embed = new MessageEmbed()
      .setTitle('Information du rôle')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Rôle', role, true)
      .addField('ID du rôle', `\`${role.id}\``, true)
      .addField('Position', position, true)
      .addField('Mentionnable', `\`${role.mentionable}\``, true)
      .addField('Rôle du bot', `\`${role.managed}\``, true)
      .addField('Color', `\`${role.hexColor.toUpperCase()}\``, true)
      .addField('Membres', `\`${role.members.size}\``, true)
      .addField('Hoisted', `\`${role.hoist}\``, true)
      .addField('Créé le', `\`${moment(role.createdAt).format('DD/MM/YYYY')}\``, true)
      .addField('Permissions', `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};