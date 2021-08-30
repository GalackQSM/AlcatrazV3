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
const db = require('quick.db')
const config = require('../../../config.json');

module.exports = class AfkCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'afk',
      usage: 'afk [raison]',
      description: 'Définir le statut comme afk',
      type: client.types.GENERAL,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['afk [raison]']
    });
  }
  async run(message, args) {
    const content = args.join(" ")
    if (!content) return this.sendErrorMessage(message, 0, 'Veuillez fournir une raison.');
    await db.set(`afk-${message.author.id}+${message.guild.id}`, content)
    const embed = new MessageEmbed()
      .setDescription(`Est maintenant afk\n**Raison :** ${content}`)
      .setColor(`#2f3136`)
      .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic : true }))
      .setFooter(config.footer)
    message.channel.send(embed);   
  }
};