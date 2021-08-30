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

module.exports = class SetMessagePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmessagepoints',
      aliases: ['setmp', 'smp'],
      usage: 'setmessagepoints <point>',
      description: 'Définit le nombre de points gagnés par message.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmessagepoints 1']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 0, 'Argument invalide. Veuillez saisir un nombre positif.');
    const { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    const status = message.client.utils.getStatus(pointTracking);
    message.client.db.settings.updateMessagePoints.run(amount, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Paramètre: `Système de points`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('la valeur des `Systèmes de points` a été mise à jour avec succès. <:valider:774806924712476674>')
      .addField('Points de message', `\`${messagePoints}\` ➔ \`${amount}\``, true)
      .addField('Points de commande', `\`${commandPoints}\``, true)
      .addField('Points de vocal', `\`${voicePoints}\``, true)
      .addField('Status', status)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
