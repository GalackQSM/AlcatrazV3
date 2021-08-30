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

module.exports = class SetPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setprefix',
      aliases: ['setp', 'sp'],
      usage: 'setprefix <prefix>',
      description: 'Définie la commande `prefix` pour votre serveur. Le max `prefix` la longueur est de 3 caractères.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setprefix !']
    });
  }
  run(message, args) {
    const oldPrefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const prefix = args[0];
    if (!prefix) return this.sendErrorMessage(message, 'Argument invalide. Veuillez spécifier un préfix.');
    else if (prefix.length > 3) 
      return this.sendErrorMessage(
        message, 'Argument invalide. Veuillez vous assurer que le préfix ne dépasse pas 3 caractères.'
      );
    message.client.db.settings.updatePrefix.run(prefix, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Prefix`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('Le `prefix` a été mis à jour avec succès. <:valider:774806924712476674>')
      .addField('Prefix', `\`${oldPrefix}\` ➔ \`${prefix}\``)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
