const { MessageEmbed } = require('discord.js');

module.exports = (client, oldMember, newMember) => {
  
  const embed = new MessageEmbed()
    .setAuthor(`${newMember.user.tag}`, newMember.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(oldMember.guild.me.displayHexColor);

  if (oldMember.nickname != newMember.nickname) {
    const nicknameLogId = client.db.settings.selectNicknameLogId.pluck().get(oldMember.guild.id);
    const nicknameLog = oldMember.guild.channels.cache.get(nicknameLogId);
    if (
      nicknameLog &&
      nicknameLog.viewable &&
      nicknameLog.permissionsFor(oldMember.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const oldNickname = oldMember.nickname || '`Aucun`';
      const newNickname = newMember.nickname || '`Aucun`';
      embed
        .setTitle('Mise à jour des membres: `Pseudo`')
        .setDescription(`${newMember} ton surnom a été modifié.`)
        .addField('Surnom', `${oldNickname} ➔ ${newNickname}`);
      nicknameLog.send(embed);
    }
  }

  if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    const roleLogId = client.db.settings.selectRoleLogId.pluck().get(oldMember.guild.id);
    const roleLog = oldMember.guild.channels.cache.get(roleLogId);
    if (
      roleLog &&
      roleLog.viewable &&
      roleLog.permissionsFor(oldMember.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const role = newMember.roles.cache.difference(oldMember.roles.cache).first();
      embed
        .setTitle('Mise à jour des membres: `Rôle ajouter`')
        .setDescription(`${newMember} as reçu le rôle ${role}.`);
      roleLog.send(embed);
    }
  }

  // Role remove
  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    // Get role log
    const roleLogId = client.db.settings.selectRoleLogId.pluck().get(oldMember.guild.id);
    const roleLog = oldMember.guild.channels.cache.get(roleLogId);
    if (
      roleLog &&
      roleLog.viewable &&
      roleLog.permissionsFor(oldMember.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {
      const role = oldMember.roles.cache.difference(newMember.roles.cache).first();
      embed
        .setTitle('Mise à jour des membres: `Rôle supprimer`')
        .setDescription(`${newMember} as perdu le rôle ${role}.`);
      roleLog.send(embed);
    }
  }
};
