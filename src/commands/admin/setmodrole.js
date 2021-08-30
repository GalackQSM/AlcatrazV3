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

module.exports = class SetModRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodrole',
      aliases: ['setmr', 'smr'],
      usage: 'setmodrole <@role/ID>',
      description: 'Définit le `Rôle Mod` pour votre serveur. Ne donnez aucun rôle pour effacer le courant `Rôle Mod`.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodrole @Modérateur']
    });
  }
  run(message, args) {
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    const oldModRole = message.guild.roles.cache.find(r => r.id === modRoleId) || '`Aucun`';

    const embed = new MessageEmbed()
      .setTitle('Paramètre: `Rôle Mod`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `mod role` a été mis à jour avec succès. <:valider:774806924712476674>')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

    if (args.length === 0) {
      message.client.db.settings.updateModRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Rôle', `${oldModRole} ➔ \`Aucun\``));
    }

    const modRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!modRole)
      return this.sendErrorMessage(message, 'Argument invalide. Veuillez mentionner un rôle ou fournir un identifiant de rôle.');
    message.client.db.settings.updateModRoleId.run(modRole.id, message.guild.id);
    message.channel.send(embed.addField('Rôle', `${oldModRole} ➔ ${modRole}`));
  }
};
