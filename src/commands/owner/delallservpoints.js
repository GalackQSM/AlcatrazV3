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
const emojis = require('../../utils/emojis.json');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class WipeAllTotalPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delallservpoints',
      usage: 'delallservpoints [ID serveur]',
      description: 'Efface les points de tous les membres et le nombre total de points sur le serveur avec l\'ID fourni.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['delallservpoints 709992782252474429']
    });
  }
  run(message, args) {
    const guildId = args[0];
    if (!rgx.test(guildId))
      return this.sendErrorMessage(message, 0, 'Veuillez fournir un identifiant de serveur valide');
    const guild = message.client.guilds.cache.get(guildId);
    if (!guild) return this.sendErrorMessage(message, 0, 'Impossible de trouver le serveur, veuillez vérifier l\'ID fourni');
    message.client.db.users.wipeAllTotalPoints.run(guildId);
    const embed = new MessageEmbed()
      .setTitle('J\'ai bien effacé tous les points totaux du serveur')
      .setDescription(""+emojis.success+" Les points et le total des points de **"+guild.name+"** ont été effacés avec succès.")
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  } 
};