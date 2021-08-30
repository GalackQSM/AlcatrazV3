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
const config = require('../../../config.json');

module.exports = class KissCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kiss',
      aliases: ['embrasser'],
      usage: 'kiss',
      description: 'Embrasser une personne.',
      type: client.types.FUN,
      examples: ['kiss @GalackQSM']
    });
  }

    async run(message, args, level) {

        const user = message.mentions.members.first();
        if (!user) return message.reply("Vous devez mentionner une personne !");

        const member = message.member;


        const kiss = [
            `https://cdn.nekos.life/kiss/kiss_001.gif`,
            `https://cdn.nekos.life/kiss/kiss_102.gif`,
            `https://cdn.nekos.life/kiss/kiss_131.gif`,
            `https://cdn.nekos.life/kiss/kiss_050.gif`,
            `https://cdn.nekos.life/kiss/kiss_060.gif`,
            `https://cdn.nekos.life/kiss/kiss_072.gif`,
            `https://cdn.nekos.life/kiss/kiss_091.gif`,
            `https://cdn.nekos.life/kiss/kiss_021.gif`,
            `https://cdn.nekos.life/kiss/kiss_064.gif`,
            `https://cdn.nekos.life/kiss/kiss_083.gif`
        ]

         const embed = new MessageEmbed()
        .setDescription(`**${member.user.username}** viens d'embrasser **${user.user.username}** :kiss:`, message.author.avatarURL)
        .setImage(kiss[Math.floor(Math.random() * kiss.length)])
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136")

        message.channel.send(embed)

    }
};