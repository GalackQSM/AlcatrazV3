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
discord = require("discord.js");
const emojis = require('../../utils/emojis.json');
const config = require('../../../config.json');

module.exports = class WeedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wumpus',
      usage: 'wumpus',
      description: 'Voir une photo de Wumpus.',
      type: client.types.FUN,
    });
  }

    async run(message, args, level) {

        const member = message.member;


        const wumpus = [
            `https://i.imgur.com/rRZOELH.png`,
            `https://i.imgur.com/EheiI8d.jpg`,
            `https://i.imgur.com/ZrwUAQO.png`,
            `https://i.imgur.com/6IR3ahR.png`,
            `https://i.imgur.com/XzrPpC7.jpg`,
            `https://i.imgur.com/KRGL2IW.png`,
            `https://i.imgur.com/gOwVsxc.jpg`,
            `https://i.imgur.com/SyLdkIL.png`
        ]

         const embed = new MessageEmbed()
        .setDescription("**"+member.user.username+"** Voici une photo de Wumpus "+emojis.wumpus+"", message.author.avatarURL)
        .setImage(wumpus[Math.floor(Math.random() * wumpus.length)])
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136")

        message.channel.send(embed)

    }
};