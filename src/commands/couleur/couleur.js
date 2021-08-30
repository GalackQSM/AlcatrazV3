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

module.exports = class CouleurCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'couleur',
      aliases: ['changecouleur', 'c'],
      usage: 'couleur <@role/ID> <couleur>',
      description: oneLine`
        Remplace votre couleur actuelle par celle spécifiée. Ne fournissez aucune couleur pour effacer votre rôle de couleur actuel.
      `,
      type: client.types.COULEUR,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      examples: ['couleur Blanc #ffffff']
    });
  }
 async run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Changement de couleur')
      .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
      .addField('Membre', message.member, true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    const colors = message.guild.roles.cache.filter(c => c.name.startsWith('#'));
    const colorName = args.join('').toLowerCase();
    const oldColor = (message.member.roles.color && message.member.roles.color.name.startsWith('#')) ? 
      message.member.roles.color : '`Aucun`';

    if (!colorName) {
      try {
        await message.member.roles.remove(colors);
        return message.channel.send(embed.addField('Couleur', `${oldColor} ➔ \`Aucun\``, true));
      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }

    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    let color;
    if (role && colors.get(role.id)) color = role;
    if (!color) {
      color = colors.find(c => {
        return colorName == c.name.slice(1).toLowerCase().replace(/\s/g, '') || 
          colorName == c.name.toLowerCase().replace(/\s/g, '');
      });
    }
    if (!color)
      return this.sendErrorMessage(message, 0, `Veuillez fournir une couleur valide, utilisez ${prefix}couleurs pour voir la liste`);
    else {
      try {
        await message.member.roles.remove(colors);
        await message.member.roles.add(color);
        message.channel.send(embed.addField('Couleur', `${oldColor} ➔ ${color}`, true).setColor(color.hexColor));
      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Veuillez vérifier la hiérarchie des rôles', err.message);
      }
    }
  }
};