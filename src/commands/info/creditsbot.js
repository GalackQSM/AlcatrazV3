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
const { oneLine, stripIndent } = require('common-tags');

module.exports = class FindIdCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'creditsbot',
      aliases: ['cb'],
      usage: 'creditsbot',
      description: 'Voir les crédits officiel de la source.',
      type: client.types.INFO,
      examples: ['creditsbot']
    });
  }
  run(message, args) {
    const embed = new MessageEmbed()
      .setTitle(`Voici les crédits officiel de la source`)
      .setDescription("`La source officielle d'Alcatraz est créé par GalackQSM, cet open-source est sous licence (BSD 2-Clause License).`\n\n**__Alcatraz:__**\n**Date de création du projet:** `09 Novembre 2019`\n**Nombre de version totals:** `3 versions`\n\n**__Nos réseaux:__**\n**Site:** https://alcatraz-bot.com\n**Github:** https://github.com/GalackQSM/AlcatrazV3\n**Discord:** https://discord.gg/bp5ANG326t\n**Twitter:** https://twitter.com/AlcatrazBot\n\n© 2019 - 2021 - Alcatraz-Bot.com | Tous droits réserver")
      .setFooter(config.footer)
      .setImage('https://i.imgur.com/NnT1N6X.png')
      .setTimestamp()
      .setColor("#2f3136");
    message.channel.send(embed);
  }
};