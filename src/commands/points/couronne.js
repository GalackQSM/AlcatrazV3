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

module.exports = class CrownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'couronne',
      usage: 'couronne',
      description: 'Affiche tous les membres couronnés du serveur, le rôle de la couronne et le calendrier de la couronne.',
      type: client.types.POINTS
    });
  }
  run(message) {
    const { crown_role_id: crownRoleId, crown_schedule: crownSchedule } = 
      message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId) || '`Aucun`';
    const crowned = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === crownRole)) return true;
    }).array();

    let description = message.client.utils.trimStringFromArray(crowned);
    if (crowned.length === 0) description = 'Personne n\'a la couronne!';

    const embed = new MessageEmbed()
      .setTitle(':crown:  Membres couronnés  :crown:')
      .setDescription(description)
      .addField('Rôle de la Couronne', crownRole)
      .addField('Calendrier de la Couronne', `\`${crownSchedule || 'Aucun calendrier fourni'}\``)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};