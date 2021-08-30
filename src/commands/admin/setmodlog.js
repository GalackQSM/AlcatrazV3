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

module.exports = class SetModLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodlog',
      aliases: ['setml', 'sml'],
      usage: 'setmodlog <#salon/ID>',
      description: oneLine`
        Définit le salon de texte du journal des mods pour votre serveur.
        Ne fournissez aucun salon pour effacer le courant \`mod log\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodlog #logs']
    });
  }
  run(message, args) {
    const modLogId = message.client.db.settings.selectModLogId.pluck().get(message.guild.id);
    const oldModLog = message.guild.channels.cache.get(modLogId) || '`Aucun`';
    const embed = new MessageEmbed()
      .setTitle('Paramètre: `Salon log`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Le \`salon log\` a été mis à jour avec succès. ${success}`)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    if (args.length === 0) {
      message.client.db.settings.updateModLogId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Salon log', `${oldModLog} ➔ \`Aucun\``));
    }

    const modLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!modLog || modLog.type != 'text' || !modLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Veuillez mentionner un canal de texte accessible ou fournir un ID de salon de texte valide
      `);
    message.client.db.settings.updateModLogId.run(modLog.id, message.guild.id);
    message.channel.send(embed.addField('Salon log', `${oldModLog} ➔ ${modLog}`));
  }
};
