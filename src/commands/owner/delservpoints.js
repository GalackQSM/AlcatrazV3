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

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class WipeAllPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delservpoints',
      usage: 'delservpoints <ID serveur>',
      description: 'Efface tous les points des membres du serveur avec l\'ID fourni.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['delservpoints 709992782252474429']
    });
  }
  run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId)) 
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant de serveur valide');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 0, 'Impossible de trouver le serveur, veuillez vérifier l\'ID fourni');
    message.client.db.users.wipeAllPoints.run(guildId);
    const embed = new MessageEmbed()
      .setTitle('J\'ai bien effacé tous les points du serveur')
      .setDescription(`Les points de **${guild.name}** ont bien été effacés.`)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  } 
};