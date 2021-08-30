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

module.exports = class TogglePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'actpoints',
      usage: 'actpoints',
      description: 'Active ou désactive les suivis des points.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['points @membre']

    });
  }
  run(message) {
    let { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    pointTracking = 1 - pointTracking; 
    message.client.db.settings.updatePointTracking.run(pointTracking, message.guild.id);

    let description, status;
    if (pointTracking == 1) {
      status = '`non actif`	🡪 `actif`';
      description = '`Les points` sont maintenant **actif**. <:valider:774806924712476674>';
    } else {
      status = '`actif` ➔ `non actif`';
      description = '`Les points` sont maintenant **non actif**. <:fail:775004965352898561>';   
    } 
    
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `système de points`')
      .setThumbnail(message.guild.iconURL())
      .setDescription(description)
      .addField('Points de message', `\`${messagePoints}\``, true)
      .addField('Points de commande', `\`${commandPoints}\``, true)
      .addField('Points de vocal', `\`${voicePoints}\``, true)
      .addField('Statut', status)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
