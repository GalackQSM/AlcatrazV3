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

module.exports = class RandomColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'couleurhasard',
      aliases: ['rc'],
      usage: 'couleurhasard',
      description: 'Change votre couleur actuelle en une couleur différente au hasard.',
      type: client.types.COULEUR,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES']
    });
  }
  async run(message) {
    
    const embed = new MessageEmbed()
      .setTitle('Changement de couleur')
      .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
      .addField('Membre', message.member, true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    const colors = message.guild.roles.cache.filter(c => c.name.startsWith('#')).array();
    if (colors.length === 0) return this.sendErrorMessage(message, 'Il n\'y a actuellement aucune couleur définie sur ce serveur.');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const oldColor = (message.member.roles.color && message.member.roles.color.name.startsWith('#')) ? 
      message.member.roles.color : '`Aucune`';

    try {
      await message.member.roles.remove(colors);
      await message.member.roles.add(color);
      message.channel.send(embed.addField('Couleur', `${oldColor} ➔ ${color}`, true).setColor(color.hexColor));
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 'Un problème est survenu. Veuillez vérifier la hiérarchie des rôles.', err.message);
    }
  }
};
