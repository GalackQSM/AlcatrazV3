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
const config = require('../../../config.json');

module.exports = class UptimeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'uptime',
      aliases: ['up'],
      usage: 'uptime',
      description: 'Récupère la disponibilité actuelle de d\'Alcatraz.',
      type: client.types.INFO
    });
  }
  run(message) {
    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} jour` : `${d.days()} jours`;
    const hours = (d.hours() == 1) ? `${d.hours()} heure` : `${d.hours()} heures`;
    const minutes = (d.minutes() == 1) ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
    const seconds = (d.seconds() == 1) ? `${d.seconds()} seconde` : `${d.seconds()} secondes`;
    const date = moment().subtract(d, 'ms').format('DD/MM/YYYY');
    const embed = new MessageEmbed()
    .setTitle(`Temps de disponibilité de ${config.NomBot}`)
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setDescription(`\`${days}\`, \`${hours}\`, \`${minutes}\`, et \`${seconds}\``)
    .addField('Date de la dernière mise à jour', `\`${date}\``) 
    .setFooter(config.footer)
    .setTimestamp()
    .setColor("#2f3136");
    message.channel.send(embed);
  }
};
