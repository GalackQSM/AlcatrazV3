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
const emojis = require('../../utils/emojis.json');

module.exports = class NukesalonCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nuke',
      aliases: ['nuke'],
      usage: 'nukesalon',
      description: 'Recrée un salon',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  async run(message, args) {
    message.channel.send('**Nuke en cours!**');
    let channel = message.guild.channels.cache.get(message.channel.id);
    var position = channel.position;
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;

    channel.clone().then((channel1) => {
      channel1.setPosition(position);
      channel.delete({ timeout: 1500 });
      const embed = new Discord.MessageEmbed()
        .setDescription(""+emojis.success+" **Salon nuke avec succès par <@"+member.id+">**")
        .setImage(`https://media.giphy.com/media/XUFPGrX5Zis6Y/giphy.gif`)        
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");

      channel1.send(embed);
    });
  }
};
