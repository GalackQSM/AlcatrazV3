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
const config = require('../../../config.json');

module.exports = class SetMuteRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmuterole',
      aliases: ['setmur', 'smur'],
      usage: 'setmuterole <role mention/ID>',
      description: 'Définit le `Rôle mute` votre serveur. Ne donnez aucun rôle pour effacer le courant `Rôle mute`.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmuterole @Mute']
    });
  }
  run(message, args) {
    const muteRoleId = message.client.db.settings.selectMuteRoleId.pluck().get(message.guild.id);
    const oldMuteRole = message.guild.roles.cache.find(r => r.id === muteRoleId) || '`Aucun`';

    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Rôle mute`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `Rôle mute` a été mis à jour avec succès. <:valider:774806924712476674>')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    if (args.length === 0) {
      message.client.db.settings.updateMuteRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Rôle', `${oldMuteRole} ➔ \`Aucun\``));
    }

    const muteRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!muteRole)
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez mentionner un rôle ou fournir un identifiant de rôle.');
    message.client.db.settings.updateMuteRoleId.run(muteRole.id, message.guild.id);
    message.channel.send(embed.addField('Rôle', `${oldMuteRole} ➔ ${muteRole}`));
  }
};
