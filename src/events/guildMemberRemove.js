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
const config = require('../../config.json');

module.exports = (client, member) => {

  if (member.user === client.user) return;

  client.logger.info(`${member.guild.name}: ${member.user.tag} a quitté le serveur`);

  const memberLogId = client.db.settings.selectMemberLogId.pluck().get(member.guild.id);
  const memberLog = member.guild.channels.cache.get(memberLogId);
  if (
    memberLog &&
    memberLog.viewable &&
    memberLog.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
  ) {
    const embed = new MessageEmbed()
      .setTitle('Membre gauche')
      .setAuthor(`${member.guild.name}`, member.guild.iconURL({ dynamic: true }))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${member} (**${member.user.tag}**)`)
      .setTimestamp()
      .setColor(member.guild.me.displayHexColor);
    memberLog.send(embed);
  }

  let { leave_channel_id: leaveChannelId, leave_message: leaveMessage } = 
    client.db.settings.selectLeaves.get(member.guild.id);
  const leaveChannel = member.guild.channels.cache.get(leaveChannelId);
  
  if (
    leaveChannel &&
    leaveChannel.viewable &&
    leaveChannel.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
    leaveMessage
  ) {
    leaveMessage = leaveMessage
      .replace(/`?\?member`?/g, member) 
      .replace(/`?\?username`?/g, member.user.username) 
      .replace(/`?\?tag`?/g, member.user.tag) 
      .replace(/`?\?size`?/g, member.guild.members.cache.size); 
    leaveChannel.send(new MessageEmbed()
      .setDescription(leaveMessage)
        .setFooter(config.footer)
        .setTimestamp()
        .setImage("https://i.imgur.com/OccZQPj.png")
        .setColor("#2f3136"));
  }
  
  client.db.users.updateCurrentMember.run(0, member.id, member.guild.id);
  client.db.users.wipeTotalPoints.run(member.id, member.guild.id);

};