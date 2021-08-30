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

module.exports = class InviteMoiCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'invitemoi',
      aliases: ['invite', 'invme', 'im'],
      usage: 'inviteme',
      description: 'Génère un lien que vous pouvez utiliser pour inviter Alcatraz sur votre propre serveur.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('Je serais ravi d\'être sur ton serveur !')
      .setThumbnail(message.guild.iconURL())
      .setDescription(oneLine`
        [Ajouter ${config.NomBot}](https://discordapp.com/oauth2/authorize?client_id=${config.BotID}&scope=bot&permissions=2146958847) pour m'inviter sur ton serveur !`)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
