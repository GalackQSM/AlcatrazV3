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
const emojis = require('../../utils/emojis.json');

module.exports = class ToggleCommandCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'desacommande',
      usage: 'desacommande <commande>',
      description: oneLine`
        Active ou désactive la commande fournie.
        Les commandes désactivées ne pourront plus être utilisées et n'apparaîtront plus dans la commande \`help\`.
        \`${client.types.ADMIN}\` les commandes ne peuvent pas être désactivées.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['desacommande ping']
    });
  }
  run(message, args) {

    const command = message.client.commands.get(args[0]) || message.client.aliases.get(args[0]);
    if (!command || (command && command.type == message.client.types.OWNER)) 
      return this.sendErrorMessage(message, 0, 'Argument invalide. Veuillez fournir une commande valide.');

    if (command.type === message.client.types.ADMIN) 
      return this.sendErrorMessage(message, 0, `
      Argument invalide. \`${message.client.types.ADMIN}\` les commandes ne peuvent pas être désactivées.
      `);

    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    let description;

    // Disable command
    if (!disabledCommands.includes(command.name)) {
      disabledCommands.push(command.name); // Add to array if not present
      description = `La commande \`${command.name}\` est maintenant **non actif**. ${emojis.fail}`;
    
    // Enable command
    } else {
      message.client.utils.removeElement(disabledCommands, command.name);
      description = `La commande \`${command.name}\` est maintenant **actif**. ${emojis.verify}`;
    }

    message.client.db.settings.updateDisabledCommands.run(disabledCommands.join(' '), message.guild.id);

    disabledCommands = disabledCommands.map(c => `\`${c}\``).join(' ') || '`Aucune`';
    const embed = new MessageEmbed()
      .setTitle('Paramètres: `Commandes désactivées`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Commandes désactivées', disabledCommands, true)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
