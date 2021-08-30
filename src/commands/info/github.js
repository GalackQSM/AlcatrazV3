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
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

module.exports = class GitHubCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'github',
      aliases: ['gh', 'repo'],
      usage: 'github',
      description: 'Affiche le lien vers le référentiel GitHub d\'Alcatraz.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle(''+emojis.github+' Lien GitHub')
      .setThumbnail(message.guild.iconURL())
      .setDescription(oneLine`
        [Clique ici](https://github.com/GalackQSM/AlcatrazV3) pour visiter mon référentiel GitHub!
        S'il vous plaît, soutenez-moi en mettant en vedette ⭐ le repo, et n'hésitez pas à commenter des problèmes ou des suggestions!
      `)
      .addField(`<:alcatraz_liens:881311929212215327> Liens`, `**[Ajouter ${config.NomBot}](https://discordapp.com/oauth2/authorize?client_id=${config.BotID}&scope=bot&permissions=2146958847) | [${config.NomServeur}](${config.Support}) | [Github](https://github.com/GalackQSM/AlcatrazV3) | [Site](https://alcatraz-bot.com) | [Dons](https://www.patreon.com/AlcatrazBot) | [Vote](https://top.gg/bot/${config.BotID}/vote)**`)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};
