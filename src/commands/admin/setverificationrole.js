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

module.exports = class SetVerificationRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setverificationrole',
      aliases: ['setvr', 'svr'],
      usage: 'setverificationrole <@role/ID>',
      description: oneLine`
        Définit le rôle donner aux membres qui sont vérifiés.
        Ne fournissez aucun rôle pour effacer le \`rôle de vérification\` actuel.
        Un \`rôle de vérification\`, un \`salon de vérification\`,
        et un \`message de vérification\` doit être défini pour activer la vérification du serveur.`,
      type: client.types.ADMIN,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setverificationrole @membre']
    });
  }
  async run(message, args) {
    let { 
      verification_role_id: verificationRoleId, 
      verification_channel_id: verificationChannelId, 
      verification_message: verificationMessage,
      verification_message_id: verificationMessageId 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const oldVerificationRole = message.guild.roles.cache.get(verificationRoleId) || '`Aucun`';
    const verificationChannel = message.guild.channels.cache.get(verificationChannelId);
    
    const oldStatus = message.client.utils.getStatus(
      verificationRoleId && verificationChannelId && verificationMessage
    );

    if (verificationMessage && verificationMessage.length > 1024) 
      verificationMessage = verificationMessage.slice(0, 1021) + '...';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Verification`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`rôle de vérification\` a été mis à jour avec succès. ${success}`)
      .addField('Salon', verificationChannel || '`Aucun`', true)
      .addField('Message', verificationMessage || '`Aucun`')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (args.length === 0) {
      message.client.db.settings.updateVerificationRoleId.run(null, message.guild.id);
      message.client.db.settings.updateVerificationMessageId.run(null, message.guild.id);

      if (verificationChannel && verificationMessageId) {
        try {
          await verificationChannel.messages.delete(verificationMessageId);
        } catch (err) { 
          message.client.logger.error(err);
        }
      }
      
      const status = 'non actif';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Rôle', value: `${oldVerificationRole} ➔ \`Aucun\``, inline: true })
        .spliceFields(2, 0, { name: 'Statut', value: statusUpdate, inline: true })
      );
    }

    const verificationRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!verificationRole) return this.sendErrorMessage(message, 0, 'Veuillez mentionner un rôle ou fournir un ID de rôle valide');
    message.client.db.settings.updateVerificationRoleId.run(verificationRole.id, message.guild.id);

    const status =  message.client.utils.getStatus(verificationRole && verificationChannel && verificationMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Rôle', value: `${oldVerificationRole} ➔ ${verificationRole}`, inline: true })
      .spliceFields(2, 0, { name: 'Statut', value: statusUpdate, inline: true })
    );

    if (status === '  ctif') {
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