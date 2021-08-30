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
const { success, verify } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const config = require('../../../config.json');

module.exports = class SetVerificationChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setverificationchannel',
      aliases: ['setvc', 'svc'],
      usage: 'setverificationchannel <#salon/ID>',
      description: oneLine`
       Définit le salon de texte de vérification pour votre serveur. Si défini, les membres non vérifiés commenceront ici.
        Une fois vérifié, le «rôle de vérification» leur sera attribué.
        Veuillez vous assurer que les nouveaux membres ne peuvent pas accéder à d'autres canaux de serveur pour une vérification appropriée.
        Un \`salon de vérification\`, un \`message de vérification\`,
        et un \ rôle de vérification\` doit être défini pour activer la vérification du serveur`,
      type: client.types.ADMIN,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setverificationchannel #vérification']
    });
  }
  async run(message, args) {

    let { 
      verification_role_id: verificationRoleId,
      verification_channel_id: verificationChannelId, 
      verification_message: verificationMessage,
      verification_message_id: verificationMessageId 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const verificationRole = message.guild.roles.cache.get(verificationRoleId);
    const oldVerificationChannel = message.guild.channels.cache.get(verificationChannelId) || '`Aucun`';

    const oldStatus = message.client.utils.getStatus(
      verificationRoleId && verificationChannelId && verificationMessage
    );

    if (verificationMessage && verificationMessage.length > 1024) 
      verificationMessage = verificationMessage.slice(0, 1021) + '...';
    
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Vérification`')
      .setDescription(`Le \`salon de vérification\` a été mis à jour avec succès. ${success}`)
      .addField('Rôle', verificationRole || '`Aucun`', true)
      .addField('Message', verificationMessage || '`Aucun`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(config.footer)
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (args.length === 0) {
      message.client.db.settings.updateVerificationChannelId.run(null, message.guild.id);
      message.client.db.settings.updateVerificationMessageId.run(null, message.guild.id);

      if (oldVerificationChannel && verificationMessageId) {
        try {
          await oldVerificationChannel.messages.delete(verificationMessageId);
        } catch (err) { 
          message.client.logger.error(err);
        }
      }

      const status = 'non actif';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 
      
      return message.channel.send(embed
        .spliceFields(1, 0, { name: 'Salon', value: `${oldVerificationChannel} ➔ \`Aucun\``, inline: true })
        .spliceFields(2, 0, { name: 'Statut', value: statusUpdate, inline: true })
      );
    }

    const verificationChannel = 
      this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!verificationChannel || verificationChannel.type != 'text' || !verificationChannel.viewable)
      return this.sendErrorMessage(message, 0, stripIndent`
        Veuillez mentionner un salon de texte accessible ou fournir un ID de salon de texte valide
      `);

    const status =  message.client.utils.getStatus(verificationRole && verificationChannel && verificationMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.client.db.settings.updateVerificationChannelId.run(verificationChannel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(1, 0, { 
        name: 'Salon', 
        value: `${oldVerificationChannel} ➔ ${verificationChannel}`, 
        inline: true
      })
      .spliceFields(2, 0, { name: 'Statut', value: statusUpdate, inline: true})
    );

    if (status === 'actif') {
      if (verificationChannel.viewable) {
        try {
          await verificationChannel.messages.fetch(verificationMessageId);
        } catch (err) { 
          message.client.logger.error(err);
        }
        const msg = await verificationChannel.send(new MessageEmbed()
          .setDescription(verificationMessage.slice(3, -3))
          .setColor(message.guild.me.displayHexColor)
        );
        await msg.react(verify.split(':')[2].slice(0, -1));
        message.client.db.settings.updateVerificationMessageId.run(msg.id, message.guild.id);
      } else {
        return message.client.sendSystemErrorMessage(message.guild, 'verification', stripIndent`
          Impossible d'envoyer le message de vérification, veuillez vous assurer que j'ai l'autorisation d'accéder au salon de vérification
        `);
      }
    }
  }
};
