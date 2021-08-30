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

module.exports = class PunchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'punch',
      usage: 'punch',
      description: 'Punch une personne.',
      type: client.types.FUN,
      examples: ['punch @GalackQSM']
    });
  }

    async run(message, args, level) {

        const user = message.mentions.members.first();
        if (!user) return message.reply("Vous devez mentionner une personne !");

        const member = message.member;


        const punch = [
            `https://thumbs.gfycat.com/EssentialSillyBobcat-max-1mb.gif`,
            `https://pa1.narvii.com/6272/cf24160e6b4e98e2e40a3b2633a3cce7c31ed4f7_hq.gif`,
            `https://thumbs.gfycat.com/PoliticalAbleFennecfox-size_restricted.gif`,
            `https://pa1.narvii.com/6724/4daa91b820e74e1ce10574cbac4772d5169f84fa_hq.gif`,
            `https://thumbs.gfycat.com/ShinyRecklessBobwhite-size_restricted.gif`,
            `https://media1.tenor.com/images/34356db15b5e28ca27307ba87325e67d/tenor.gif`,
            `https://i.pinimg.com/originals/76/0b/3f/760b3fc3deac11d2163ea305987bd9bd.gif`
        ]

         const embed = new MessageEmbed()
        .setDescription(`**${member.user.username}** viens de punch **${user.user.username}** :punch:`, message.author.avatarURL)
        .setImage(punch[Math.floor(Math.random() * punch.length)])
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136")

        message.channel.send(embed)

    }
};