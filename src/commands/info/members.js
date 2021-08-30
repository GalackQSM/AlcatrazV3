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
const { stripIndent } = require('common-tags');
const config = require('../../../config.json');

module.exports = class MembersCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'members',
      aliases: ['memberstatus'],
      usage: 'members',
      description: 'Affiche le nombre de membres du serveur en ligne, occupés, AFK et hors ligne.',
      type: client.types.INFO
    });
  }
  run(message) {
    const online = message.guild.members.cache.array().filter((m) => m.presence.status === 'online').length;
    const offline = message.guild.members.cache.array().filter((m) => m.presence.status === 'offline').length;
    const dnd = message.guild.members.cache.array().filter((m) => m.presence.status === 'dnd').length;
    const afk = message.guild.members.cache.array().filter((m) => m.presence.status === 'idle').length;
    const embed = new MessageEmbed()
      .setTitle(`Statut des membres du serveur: [${message.guild.members.cache.size}] membres`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(stripIndent`
        :green_circle: **En Ligne**: \`${online}\` membres

        :red_circle: **Occupé**: \`${dnd}\` membres

        :yellow_circle: **AFK**: \`${afk}\` membres

        :white_circle: **Hors Ligne**: \`${offline}\` membres
      `)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};