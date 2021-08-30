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
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const config = require('../../../config.json');

module.exports = class SetLeaveChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setleavechannel',
      aliases: ['setfc', 'sfc'],
      usage: 'setleavechannel <#salon/ID>',
      description: oneLine`
        Définit le salon de texte du message d'adieu pour votre serveur.
        Ne fournissez aucun salon pour effacer le \`salon d'adieu\` actuel.
        Un \`message d'adieu\` doit également être défini pour activer les messages d'adieu.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setleavechannel #bye']
    });
  }
  run(message, args) {
    let { leave_channel_id: leaveChannelId, leave_message: leaveMessage } = 
      message.client.db.settings.selectLeaves.get(message.guild.id);
    const oldLeaveChannel = message.guild.channels.cache.get(leaveChannelId) || '`Aucun`';
    const oldStatus = message.client.utils.getStatus(leaveChannelId, leaveMessage);

    if (leaveMessage && leaveMessage.length > 1024) leaveMessage = leaveMessage.slice(0, 1021) + '...';
    
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Salon d\'au revoir`')
      .setDescription(`Le \`Salon d\'au revoir\` a été mis à jour avec succès. ${success}`)
      .addField('Message', message.client.utils.replaceKeywords(leaveMessage) || '`Aucun`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    if (args.length === 0) {
      message.client.db.settings.updateLeaveChannelId.run(null, message.guild.id);

      const status = 'désactivé';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 
      
      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Salon', value: `${oldLeaveChannel} ➔ \`Aucun\``, inline: true })
        .spliceFields(1, 0, { name: 'Statut', value: statusUpdate, inline: true })
      );
    }

    const leaveChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!leaveChannel || (leaveChannel.type != 'text' && leaveChannel.type != 'news') || !leaveChannel.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Veuillez mentionner un texte ou un salon d'annonce accessible ou fournir un identifiant de salon de texte ou d'annonce valide
      `);

    const status =  message.client.utils.getStatus(leaveChannel, leaveMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.client.db.settings.updateLeaveChannelId.run(leaveChannel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Salon', value: `${oldLeaveChannel} ➔ ${leaveChannel}`, inline: true})
      .spliceFields(1, 0, { name: 'Statut', value: statusUpdate, inline: true})
    );
  }
};
