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

module.exports = class ServerStaffCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'serverstaff',
      aliases: ['staff'],
      usage: 'serverstaff',
      description: 'Affiche une liste de tous les modérateurs et administrateurs actuels du serveur.',
      type: client.types.INFO
    });
  }
  run(message) {
    
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    let modRole, mods;
    if (modRoleId) modRole = message.guild.roles.cache.get(modRoleId);
    
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    let adminRole, admins;
    if (adminRoleId) adminRole = message.guild.roles.cache.get(adminRoleId);
  
    let modList = [], adminList = [];

    if (modRole) modList = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    if (modList.length > 0) mods = message.client.utils.trimStringFromArray(modList, 1024);
    else mods = '`Aucun modérateur trouvé.`';
    
    if (adminRole) adminList = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === adminRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    if (adminList.length > 0) admins = message.client.utils.trimStringFromArray(adminList, 1024);
    else admins = 'Aucun administrateur trouvé.';
    

    const embed = new MessageEmbed()
      .setTitle(`Liste du staff du serveur [${modList.length + adminList.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField(`Administrateur(s) [${adminList.length}]`, admins)
      .addField(`Modérateur(s) [${modList.length}]`, mods)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};