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
const config = require('../../config.json');
const IBL = require("infinity-api");

module.exports = async (client) => {
  
  const activities = [
    { name: `${config.NomBot} | V3.0.1`, type: 'PLAYING' }, 
    { name: `Je suis dans ${client.guilds.cache.size} serveurs avec ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} membres`, type: 'LISTENING' }
  ];

  client.user.setPresence({ status: 'online', activity: activities[0] });

  let activity = 1;

  setInterval(() => {
    activities[2] = { name: `${client.guilds.cache.size} serveurs`, type: 'WATCHING' }; 
    activities[3] = { name: `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} membres`, type: 'WATCHING' }; 
    if (activity > 3) activity = 0;
    client.user.setActivity(activities[activity]);
    activity++;
  }, 30000);

  client.logger.info('Mise à jour de la base de données et planification des travaux...');
  for (const guild of client.guilds.cache.values()) {

    const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 
      c.name.replace('-', '').replace('s', '') === 'moderatorlog');

    const adminRole = 
    guild.roles.cache.find(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'administrator');
    const modRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mod' || r.name.toLowerCase() === 'moderator');
    const muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mute');
    const crownRole = guild.roles.cache.find(r => r.name === 'Meilleur membre');

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
        member.user.bot ? 1 : 0
      );
    });
    const currentMemberIds = client.db.users.selectCurrentMembers.all(guild.id).map(row => row.user_id);
    for (const id of currentMemberIds) {
      if (!guild.members.cache.has(id)) {
        client.db.users.updateCurrentMember.run(0, id, guild.id);
        client.db.users.wipeTotalPoints.run(id, guild.id);
      }
    }
    const missingMemberIds = client.db.users.selectMissingMembers.all(guild.id).map(row => row.user_id);
    for (const id of missingMemberIds) {
      if (guild.members.cache.has(id)) client.db.users.updateCurrentMember.run(1, id, guild.id);
    }
    client.utils.scheduleCrown(client, guild);

  }

  const dbGuilds = client.db.settings.selectGuilds.all();
  const guilds = client.guilds.cache.array();
  const leftGuilds = dbGuilds.filter(g1 => !guilds.some(g2 => g1.guild_id === g2.id));
  for (const guild of leftGuilds) {
    client.db.settings.deleteGuild.run(guild.guild_id);
    client.db.users.deleteGuild.run(guild.guild_id);

    client.logger.info(`${config.NomBot} a quitté le serveur: ${guild.guild_name}`);
  }

//InfinityBotList
const stats = new IBL(config.BotID, ""+config.InfinityBotList+"", true);
stats.postStats(client.guilds.cache.size);

  client.logger.info(`${config.NomBot} est maintenant en ligne`);
  client.logger.info(`${config.NomBot} est en service sur ${client.guilds.cache.size} serveur(s)`);
};
