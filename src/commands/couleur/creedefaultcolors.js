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
const colors = require('../../utils/colors.json');
const len = Object.keys(colors).length;
const { oneLine } = require('common-tags');
const config = require('../../../config.json');

module.exports = class CreateDefaultColorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'creedefaultcolors',
      aliases: ['cdc'],
      usage: 'creedefaultcolors',
      description: oneLine`
        Génère les rôles de couleur par défaut fournis avec Alcatraz sur votre serveur.
        Les rôles de couleur sont indiqués par le préfixe \`#\`.
      `,
      type: client.types.COULEUR,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES']
    });
  }
  async run(message) {

    const embed = new MessageEmbed()
      .setTitle('Créer les couleurs par défaut')
      .setDescription('Création des couleurs...')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    const msg = await message.channel.send(embed);

    let position = 1;
    const colorList = [];
    for (let [key, value] of Object.entries(colors)){
      key = '#' + key;
      if (!message.guild.roles.cache.find(r => r.name === key)) {
        try {
          const role = await message.guild.roles.create({
            data: {
              name: key,
              color: value,
              position: position,
              permissions: []
            }
          });
          colorList.push(role);
          position++; 
        } catch (err) {
          message.client.logger.error(err.message);
        }
      } 
    }
    const fails = len - colorList.length;
    embed 
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Création de \`${len - fails}\` sur  \`${len}\` des couleurs par défaut.`)
      .addField('Couleurs créées', (colorList.length > 0) ? colorList.reverse().join(' ') : '`Aucune`')
      .setFooter("© 2020 - Alcatraz | Projet open-source")
      .setTimestamp()
      .setColor("#2f3136");
    msg.edit(embed);
  }
};
