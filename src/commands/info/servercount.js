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
const { stripIndent } = require('common-tags');
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

module.exports = class ServerCountCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'servercount',
      aliases: ['sc'],
      usage: 'servercount',
      description: 'Récupère les stats des serveurs.',
      type: client.types.INFO
    });
  }
  run(message) {
    const counts = stripIndent`
      Serveurs :: ${message.client.guilds.cache.size}
      Membres   :: ${message.client.users.cache.size}
      Emojis   :: ${message.client.emojis.cache.size}
    `;
    const embed = new MessageEmbed()
      .setTitle(''+emojis.creation+' Information des stats des serveurs')
      .setDescription(stripIndent`\`\`\`asciidoc\n${counts}\`\`\``)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
