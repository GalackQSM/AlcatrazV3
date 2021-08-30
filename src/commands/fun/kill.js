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

module.exports = class KillCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kill',
      usage: 'kill',
      description: 'Tuer une personne.',
      type: client.types.FUN,
      examples: ['kill @GalackQSM']
    });
  }

    async run(message, args, level) {

        const user = message.mentions.members.first();
        if (!user) return message.reply("Vous devez mentionner une personne !");

        const member = message.member;


        const kill = [
            `https://www.gif-maniac.com/gifs/3/3474.gif`,
            `https://risibank.fr/cache/stickers/d1298/129888-full.gif`,
            `https://choualbox.com/Img/137764204285.gif`,
            `https://i.imgur.com/CjGEReC.gif`,
            `https://www.lelouverture.net/wp-content/uploads/2019/12/tenor-1-2.gif`,
            `https://choualbox.com/Img/145411159486.gif`,
            `https://i.pinimg.com/originals/91/06/b8/9106b8a59e4d271b6e9f3b375b57837a.gif`
        ]

         const embed = new MessageEmbed()
        .setDescription(`**${member.user.username}** viens de tuer **${user.user.username}** :gun:`, message.author.avatarURL)
        .setImage(kill[Math.floor(Math.random() * kill.length)])
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136")

        message.channel.send(embed)

    }
};