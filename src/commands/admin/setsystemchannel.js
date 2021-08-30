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
const { oneLine } = require('common-tags');
const config = require('../../../config.json');

module.exports = class SetSystemChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setsystemchannel',
      aliases: ['setsc', 'ssc'],
      usage: 'setsystemchannel <#salon/ID>',
      description: oneLine`
        Définit le salon de texte système pour votre serveur. C'est là que les messages système de Alcatraz seront envoyés.
        Ne fournissez aucun salon pour effacer le courant \`Salon système\`. La suppression de ce paramètre **n'est pas recommandée** 
        car Alcatraz nécessite un \`Salon système\` pour vous signaler des erreurs importantes.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setsystemchannel #système']
    });
  }
  run(message, args) {
    const systemChannelId = message.client.db.settings.selectSystemChannelId.pluck().get(message.guild.id);
    const oldSystemChannel = message.guild.channels.cache.get(systemChannelId) || '`Aucun`';
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Salon système`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `Salon système` a été mis à jour avec succès. <:valider:774806924712476674>')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    if (args.length === 0) {
      message.client.db.settings.updateSystemChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Salon', `${oldSystemChannel} ➔ \`Aucun\``));
    }

    const systemChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!systemChannel || systemChannel.type != 'text' || !systemChannel.viewable)
      return this.sendErrorMessage(message, 0, `
      Argument invalide. Veuillez mentionner un salon texte accessible ou fournir un identifiant de salon valide.
      `);
    message.client.db.settings.updateSystemChannelId.run(systemChannel.id, message.guild.id);
    message.channel.send(embed.addField('Salon', `${oldSystemChannel} ➔ ${systemChannel}`));
  }
};
