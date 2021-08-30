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
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');
const Discord = require('discord.js')
const { utc } = require("moment");
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

module.exports = class StatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      aliases: ['statistics', 'metrics'],
      usage: 'stats',
      description: 'Avoir les stats du bot.',
      type: client.types.INFO
    });
  }
  async run(message) {
    const d = moment.duration(message.client.uptime);
    const days = (d.days() == 1) ? `${d.days()} jour` : `${d.days()} jours`;
    const hours = (d.hours() == 1) ? `${d.hours()} heure` : `${d.hours()} heures`;
    const minutes = (d.minutes() == 1) ? `${d.minutes()} minute` : `${d.minutes()} minutes`;
    const seconds = (d.seconds() == 1) ? `${d.seconds()} seconde` : `${d.seconds()} secondes`;
    const donateurStats = stripIndent`
      \`• GalackQSM#2021\`
      \`• !Zerg#9999\`
    `;
    const clientStats = stripIndent`
      **• Serveurs:** \`${message.client.guilds.cache.size}\`
      **• Membres:** \`${message.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\`
      **• Salons:** \`${message.client.channels.cache.size}\`
      **• Emojis:** \`${message.client.emojis.cache.size}\`
      **• Ping:** \`${Math.round(message.client.ws.ping)}ms\`
      **• En ligne depuis:** \`${days}\` \`${hours}\` \`${minutes}\` et \`${seconds}\`
      **• Version:** \`${config.version}\`
    `;
    const { totalMemMb, usedMemMb } = await mem.info();
    const serverStats = stripIndent`
      **• Modèle:** \`${cpu.model()}\`
      **• Cores:** \`${cpu.count()}\`
      **• CPU:** \`${await cpu.usage()} %\`
      **• RAM Total:** \`${totalMemMb} MB\`
      **• RAM:** \`${usedMemMb} MB\`
      **• DiscordJS:** \`${Discord.version}\`
      **• NodeJS:** \`${process.versions.node}\`
    `;
    const embed = new MessageEmbed()
      .setTitle(`Statistiques de ${config.NomBot}`)
      .setDescription(`● **${config.NomBot}** a été créé par **GalackQSM#2021**\n● Merci à [Flaticon](https://flaticon.com/) pour presque tous les emojis!\n● **${config.NomBot}** à été crée le **${utc(message.client.user.createdTimestamp).format('DD/MM/YYYY à HH:mm:ss')}**\n● Source développer par **GalackQSM#2021**!`) //merci de laisser le copyright "● Source développer par **GalackQSM#2021**!"
      .addField('Commandes:', `\`${message.client.commands.size} commandes\``, true)
      .addField('Aliases:', `\`${message.client.aliases.size} aliases\``, true)
      .addField('Catégories:', `\`${Object.keys(message.client.types).length} catégories\``, true)
      .addField('__Les donateurs d\'Alcatraz__', `${donateurStats}`)
      .addField(`__${config.NomBot}__`, `${clientStats}`)
      .addField('__Serveur__', `${serverStats}`)
      .addField(`<:alcatraz_liens:881311929212215327> Liens`, `**[Ajouter ${config.NomBot}](https://discordapp.com/oauth2/authorize?client_id=${config.BotID}&scope=bot&permissions=2146958847) | [${config.NomServeur}](${config.Support}) | [Github](https://github.com/GalackQSM/Alcatraz) | [Site](https://alcatraz-bot.com) | [Dons](https://www.patreon.com/AlcatrazBot) | [Vote](https://top.gg/bot/${config.BotID}/vote)**`)
      .setImage('https://i.imgur.com/1jlqgj9.png')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
function formatSizeUnits(bytes) {
  if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
  else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
  else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + " KB"; }
  else if (bytes > 1) { bytes = bytes + " bytes"; }
  else if (bytes == 1) { bytes = bytes + " byte"; }
  else { bytes = "0 bytes"; }
  return bytes;
}
function convertMS(milliseconds) {
  var day, hour, minute, seconds;
  seconds = Math.floor(milliseconds / 1000);
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  day = Math.floor(hour / 24);
  hour = hour % 24;
  return { day: day, hour: hour, minute: minute, seconds: seconds };
}
