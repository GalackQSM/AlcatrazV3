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

module.exports = class SetAutoRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setautorole',
      aliases: ['setaur', 'saur'],
      usage: 'setautorole <role mention/ID>',
      description: oneLine`
      Définit le rôle que tous les nouveaux membres recevront lorsqu'ils rejoindront votre serveur.
      Ne donnez aucun rôle pour effacer le courant \`auto role\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setautorole @Membres']
    });
  }
  run(message, args) {
    const autoRoleId = message.client.db.settings.selectAutoRoleId.pluck().get(message.guild.id);
    const oldAutoRole = message.guild.roles.cache.find(r => r.id === autoRoleId) || '`Aucun`';

    const embed = new MessageEmbed()
      .setTitle('Réglages: `Auto Rôle`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `auto role` a été mis à jour avec succès. <:alcatraz_valider:776109858948120636>')
      .setFooter(config.footer)
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (args.length === 0) {
      message.client.db.settings.updateAutoRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Rôle', `${oldAutoRole} ➔ \`Aucun\``));
    }

    const autoRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!autoRole) 
      return this.sendErrorMessage(message, 0, 'Argument invalide. Veuillez mentionner un rôle ou fournir un identifiant de rôle.');
    message.client.db.settings.updateAutoRoleId.run(autoRole.id, message.guild.id);
    message.channel.send(embed.addField('Rôle', `${oldAutoRole} ➔ ${autoRole}`));
  }
};
