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

module.exports = class SetVoicePointsVoice extends Command {
  constructor(client) {
    super(client, {
      name: 'setvoicepoints',
      aliases: ['setvp', 'svp'],
      usage: 'setvoicepoints <nombre de point>',
      description: 'Définit le nombre de points gagnés par minute passée dans le salon vocal.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setvoicepoints 5']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez saisir un entier positif.');
    const { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    const status = message.client.utils.getStatus(pointTracking);
    message.client.db.settings.updateVoicePoints.run(amount, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Système de points`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('la valeur des `points de vocal` a été mise à jour avec succès. <:valider:774806924712476674>')
      .addField('Points de message', `\`${messagePoints}\``, true)
      .addField('Points de commande', `\`${commandPoints}\``, true)
      .addField('Points de vocal', `\`${voicePoints}\` ➔ \`${amount}\``, true)
      .addField('Statut', status)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
