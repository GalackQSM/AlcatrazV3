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

const { MessageEmbed } = require('discord.js');
const colors = require('../utils/colors.json');
const { success } = require('../utils/emojis.json');

module.exports = async (client, guild) => {

  client.logger.info(`Alcatraz viens de rejoindre le serveur: ${guild.name}`);
  const serverLog = client.channels.cache.get(client.serverLogId);
  if (serverLog)
    serverLog.send(new MessageEmbed().setDescription(`${client.user} viens de rejoindre le serveur: **${guild.name}** ${success}`));

  const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 
    c.name.replace('-', '').replace('s', '') === 'moderatorlog');

  const adminRole = 
    guild.roles.cache.find(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'administrator');
  const modRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mod' || r.name.toLowerCase() === 'moderator');

  let muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'Mute');
  if (!muteRole) {
    try {
      muteRole = await guild.roles.create({
        data: {
          name: 'Mute',
          permissions: []
        }
      });
    } catch (err) {
      client.logger.error(err.message);
    }
    for (const channel of guild.channels.cache.values()) {
      try {
        if (channel.viewable && channel.permissionsFor(guild.me).has('MANAGE_ROLES')) {
          if (channel.type === 'text')
            await channel.updateOverwrite(muteRole, {
              'SEND_MESSAGES': false,
              'ADD_REACTIONS': false
            });
          else if (channel.type === 'voice' && channel.editable) 
            await channel.updateOverwrite(muteRole, {
              'SPEAK': false,
              'STREAM': false
            });
        } 
      } catch (err) {
        client.logger.error(err.stack);
      }
    }
  }
  
  let crownRole = guild.roles.cache.find(r => r.name === 'Meilleur membre');
  if (!crownRole) {
    try {
      crownRole = await guild.roles.create({
        data: {
          name: 'Meilleur membre',
          permissions: [],
          hoist: true
        }
      });
    } catch (err) {
      client.logger.error(err.message);
    }
  }
  client.db.settings.insertRow.run(
    guild.id,
    guild.name,
    guild.systemChannelID, 
    guild.systemChannelID,
    guild.systemChannelID, 
    guild.systemChannelID,
    modLog ? modLog.id : null,
    adminRole ? adminRole.id : null,
    modRole ? modRole.id : null,
    muteRole ? muteRole.id : null,
    crownRole ? crownRole.id : null
  );

  guild.members.cache.forEach(member => {
    client.db.users.insertRow.run(
      member.id, 
      member.user.username, 
      member.user.discriminator,
      guild.id, 
      guild.name,
      member.joinedAt.toString(),
      member.bot ? 1 : 0
    );
  });
  
};