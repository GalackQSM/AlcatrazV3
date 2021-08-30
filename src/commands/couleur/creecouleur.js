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

const rgx = /^#?[0-9A-F]{6}$/i;

module.exports = class CreateColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'creecouleur',
      aliases: ['cc'],
      usage: 'createcolor <hex> <nopm de la couleur>',
      description: 'Crée un nouveau rôle pour l\'hex de couleur donné. Les rôles de couleur sont indiqués par le préfix `#`.',
      type: client.types.COULEUR,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['creecouleur #ffffff Blanc']
    });
  }
  async run(message, args) {
    let hex = args.shift();
    if (args.length === 0 || !rgx.test(hex))
      return this.sendErrorMessage(message, 'Arguments non valides. Veuillez fournir un hex de couleur et un nom de couleur.');
    let colorName = args.join(' ');
    if (!colorName.startsWith('#')) colorName = '#' + colorName;
    if (!hex.startsWith('#')) hex = '#' + hex;
    try {
      const role = await message.guild.roles.create({
        data: {
          name: colorName,
          color: hex,
          permissions: []
        }
      });
      const embed = new MessageEmbed()
        .setTitle('Créations des couleurs')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setDescription(`Création réussie du ${role} couleur.`)
        .addField('Hex', `\`${hex}\``, true)
        .addField('Nom de la couleur', `\`${colorName.slice(1, colorName.length)}\``, true)
        .setFooter(config.footer)
        .setTimestamp()
        .setColor(hex);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 'Un problème est survenu. Veuillez réessayer.', err.message);
    }
  }
};
