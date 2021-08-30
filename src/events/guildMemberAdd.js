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
const moment = require('moment');
const { stripIndent } = require('common-tags');
const config = require('../../config.json');

module.exports = async (client, member) => {

  client.logger.info(`${member.guild.name}: ${member.user.tag} a rejoint le serveur`);

  const memberLogId = client.db.settings.selectMemberLogId.pluck().get(member.guild.id);
  const memberLog = member.guild.channels.cache.get(memberLogId);
  if (
    memberLog &&
    memberLog.viewable &&
    memberLog.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
  ) {
    const embed = new MessageEmbed()
      .setTitle('Nouveau membre nous a rejoint')
      .setAuthor(`${member.guild.name}`, member.guild.iconURL({ dynamic: true }))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${member} (**${member.user.tag}**)`)
      .addField('Compte créé le', moment(member.user.createdAt).format('DD/MM/YYYY'))
      .setTimestamp()
      .setColor(member.guild.me.displayHexColor);
    memberLog.send(embed);
  }

  const autoRoleId = client.db.settings.selectAutoRoleId.pluck().get(member.guild.id);
  const autoRole = member.guild.roles.cache.get(autoRoleId);
  if (autoRole) {
    try {
      await member.roles.add(autoRole);
    } catch (err) {
      client.sendSystemErrorMessage(member.guild, 'auto role', stripIndent`
        Impossible d'attribuer un rôle automatique, veuillez vérifier la hiérarchie des rôles et vous assurer que je dispose de l'autorisation Gérer les rôles
      `, err.message);
    }
  }

  let { welcome_channel_id: welcomeChannelId, welcome_message: welcomeMessage } = 
    client.db.settings.selectWelcomes.get(member.guild.id);
  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

  if (
    welcomeChannel &&
    welcomeChannel.viewable &&
    welcomeChannel.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
    welcomeMessage
  ) {
    welcomeMessage = welcomeMessage
      .replace(/`?\?member`?/g, member) 
      .replace(/`?\?username`?/g, member.user.username) 
      .replace(/`?\?tag`?/g, member.user.tag) 
      .replace(/`?\?size`?/g, member.guild.members.cache.size); 
    welcomeChannel.send(new MessageEmbed()
    	.setDescription(welcomeMessage)
        .setFooter(config.footer)
        .setTimestamp()
        .setImage("https://i.imgur.com/FQlNwlB.png")
        .setColor("#2f3136"));

  }
  
  const randomColor = client.db.settings.selectRandomColor.pluck().get(member.guild.id);
  if (randomColor) {
    const colors = member.guild.roles.cache.filter(c => c.name.startsWith('#')).array();

    if (colors.length > 0) {
      const color = colors[Math.floor(Math.random() * colors.length)]; 
      try {
        await member.roles.add(color);
      } catch (err) {
        client.sendSystemErrorMessage(member.guild, 'random color', stripIndent`
          Impossible d'attribuer une couleur aléatoire, veuillez vérifier la hiérarchie des rôles et vous assurer que j'ai l'autorisation Gérer les rôles
        `, err.message);
      }
    }
  }

  client.db.users.insertRow.run(
    member.id, 
    member.user.username, 
    member.user.discriminator,
    member.guild.id, 
    member.guild.name,
    member.joinedAt.toString(),
    member.user.bot ? 1 : 0
  );
  
  const missingMemberIds = client.db.users.selectMissingMembers.all(member.guild.id).map(row => row.user_id);
  if (missingMemberIds.includes(member.id)) client.db.users.updateCurrentMember.run(1, member.id, member.guild.id);
};