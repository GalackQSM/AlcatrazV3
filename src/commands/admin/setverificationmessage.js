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

module.exports = class SetVerificationMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setverificationmessage',
      aliases: ['setverificationmsg', 'setvm', 'svm'],
      usage: 'setverificationmessage <message>',
      description: oneLine`
        Définit le message que de vérification dans le \`salon de vérification\`.
        N'entrez aucun message pour effacer le message de vérification.
        Un \`rôle de vérification\`, un \`salon de vérification\`,
        et un \`message de vérification\` doit être défini pour activer la vérification du serveur.      `,
      type: client.types.ADMIN,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setverificationmessage Veuillez lire les règles du serveur, puis réagir à ce message.']
    });
  }
  async run(message, args) {

    let { 
      verification_role_id: verificationRoleId,
      verification_channel_id: verificationChannelId, 
      verification_message: oldVerificationMessage,
      verification_message_id: verificationMessageId 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const verificationRole = message.guild.roles.cache.get(verificationRoleId);
    const verificationChannel = message.guild.channels.cache.get(verificationChannelId);

    const oldStatus = message.client.utils.getStatus(
      verificationRoleId && verificationChannelId && oldVerificationMessage
    );

    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Vérification`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`message de vérification\` a été mis à jour avec succès. ${success}`)
      .addField('Rôle', verificationRole || '`Aucun`', true)
      .addField('Salon', verificationChannel || '`Aucun`', true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateVerificationMessage.run(null, message.guild.id);
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
        .addField('Statut', statusUpdate, true)
        .addField('Message', '`Aucun`')
      );
    }
    
    let verificationMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateVerificationMessage.run(verificationMessage, message.guild.id);
    if (verificationMessage.length) verificationMessage = verificationMessage.slice();

    const status =  message.client.utils.getStatus(verificationRole && verificationChannel && verificationMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .addField('Statut', statusUpdate, true)
      .addField('Message', verificationMessage)
    );

    if (status === 'actif') {
      if (verificationChannel.viewable) {
        try {
          await verificationChannel.messages.fetch(verificationMessageId);
        } catch (err) { 
          message.client.logger.error(err);
        }
        const msg = await verificationChannel.send(new MessageEmbed()
          .setDescription(verificationMessage)
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