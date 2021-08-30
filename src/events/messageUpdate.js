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

module.exports = (client, oldMessage, newMessage) => {

  if (newMessage.webhookID) return;

  if (
    newMessage.member && 
    newMessage.id === newMessage.member.lastMessageID &&
    !oldMessage.command
  ) {
    client.emit('message', newMessage);
  }

  const embed = new MessageEmbed()
    .setAuthor(`${newMessage.author.tag}`, newMessage.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(newMessage.guild.me.displayHexColor);

  if (oldMessage.content != newMessage.content) {

    const starboardChannelId = client.db.settings.selectStarboardChannelId.pluck().get(newMessage.guild.id);
    const starboardChannel = newMessage.guild.channels.cache.get(starboardChannelId);
    if (newMessage.channel == starboardChannel) return;

    const messageEditLogId = client.db.settings.selectMessageEditLogId.pluck().get(newMessage.guild.id);
    const messageEditLog = newMessage.guild.channels.cache.get(messageEditLogId);
    if (
      messageEditLog &&
      messageEditLog.viewable &&
      messageEditLog.permissionsFor(newMessage.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {

      if (newMessage.content.length > 1024) newMessage.content = newMessage.content.slice(0, 1021) + '...';
      if (oldMessage.content.length > 1024) oldMessage.content = oldMessage.content.slice(0, 1021) + '...';

      embed
        .setTitle('Mise à jour du message: `Modifier`')
        .setDescription(`
          Le message de ${newMessage.member} dans ${newMessage.channel} a été modifié. [Voir le message!](${newMessage.url})
        `)
        .addField('Avant', oldMessage.content)
        .addField('Après', newMessage.content);
      messageEditLog.send(embed);
    }
  }

  if (oldMessage.embeds.length > newMessage.embeds.length) {
    const messageDeleteLogId = client.db.settings.selectMessageDeleteLogId.pluck().get(newMessage.guild.id);
    const messageDeleteLog = newMessage.guild.channels.cache.get(messageDeleteLogId);
    if (
      messageDeleteLog &&
      messageDeleteLog.viewable &&
      messageDeleteLog.permissionsFor(newMessage.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {

      embed.setTitle('Mise à jour du message: `Supprimer`');
      if (oldMessage.embeds.length > 1)
        embed.setDescription(`Le message de ${newMessage.member} dans ${newMessage.channel} ont été supprimés.`);
      else
        embed.setDescription(`Le message de ${newMessage.member} dans ${newMessage.channel} a été supprimée.`);
      messageDeleteLog.send(embed);
    }
  }
};