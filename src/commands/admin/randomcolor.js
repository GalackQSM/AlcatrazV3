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

module.exports = class ToggleRandomColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'randomcolor',
      usage: 'randomcolor',
      description: `
        Active ou désactive l'attribution de rôles de couleur aléatoires lorsque quelqu'un rejoint votre serveur.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    let randomColor = message.client.db.settings.selectRandomColor.pluck().get(message.guild.id);
    randomColor = 1 - randomColor; // Invert
    message.client.db.settings.updateRandomColor.run(randomColor, message.guild.id);
    let description, status;
    if (randomColor == 1) {
      status = '`non actif`	➔ `actif`';
      description = 'Les `Couleurs aléatoire` sont maintenant **actif**. <:valider:774806924712476674>';
    } else {
      status = '`actif` ➔ `non actif`';
      description = 'Les `Couleurs aléatoire` sont maintenant **non actif**. <:fail:775004965352898561>';   
    } 
    
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Couleurs aléatoire`')
      .setThumbnail(message.guild.iconURL())
      .setDescription(description)
      .addField('Status', status, true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
