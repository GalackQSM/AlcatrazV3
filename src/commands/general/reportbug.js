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

module.exports = class ReportBugCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reportbug',
      aliases: ['bugreport', 'report', 'bug', 'rb', 'br'],
      usage: 'reportbug <message>',
      description: oneLine`
        Envoie un message au salon de rapport de bogue du serveur de support d'Alcatraz.
        Lorsque vous signalez un bogue, veuillez inclure autant d'informations que possible.
      `,
      type: client.types.GENERAL,
      examples: ['reportbug j\'ai découvert un bug']
    });
  }
  run(message, args) {
    const reportChannel = message.client.channels.cache.get(message.client.bugReportChannelId);
    if (!reportChannel)
      return this.sendErrorMessage(message, 1, 'L\'ID du salon **reportbug** dans le fichier **config.js** n\'a pas été définie');
    if (!args[0]) return this.sendErrorMessage(message, 0, 'Veuillez fournir un message à envoyer');
    let report = message.content.slice(message.content.indexOf(args[0]), message.content.length);

    const reportEmbed = new MessageEmbed()
      .setTitle('Rapport de bugs')
      .setThumbnail(reportChannel.guild.iconURL({ dynamic: true }))
      .setDescription(report) 
      .addField('Membre', message.member, true)
      .addField('Serveur', message.guild.name, true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    reportChannel.send(reportEmbed);

    if (report.length > 1024) report = report.slice(0, 1021) + '...';
    const embed = new MessageEmbed()
      .setTitle('Rapport de bugs')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(oneLine`
        Rapport de bogue envoyé avec succès!
        Veuillez rejoindre le serveur [${config.NomServeur}](${config.Support}) pour discuter davantage de votre problème.
        De plus, n'hésitez pas à soumettre un problème sur [GitHub](https://github.com/GalackQSM/Alcatraz/issues).
      `) 
      .addField('Membre', message.member, true)
      .addField('Message', report)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};