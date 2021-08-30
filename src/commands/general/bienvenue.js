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
const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require('../../../config.json');

module.exports = class Bienvenue extends Command {

  constructor (client) {
    super(client, {
      name: 'bienvenue',
      usage: 'bienvenue <@membre>',
      description: 'Souhaiter la bienvenue a un membre!',
      type: client.types.GENERAL,
      examples: ['bienvenue @membre']

    });
  }

    async run (message, args, data) {
               const bienvenue = [
            `https://media2.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif`,
            `https://pa1.narvii.com/6162/e16a71a9c9369bdc54905a08dc07e934f1a2a936_hq.gif`,
            `https://i.skyrock.net/2144/96992144/pics/3274872334_1_2_FMkFCm7B.gif`
        ]

        const user = message.mentions.members.first();
        if (!user) return message.reply("Vous devez mentionner une personne !");
        const member = message.member;

        var embed = new discord.MessageEmbed()
        .setTitle(":hand_splayed: Bienvenue sur le serveur de "+ message.guild.name +"")
        .setDescription("**" + member.user.username + "** te souhaite la bienvenue **" + user.user.username + "**")
        .setImage(bienvenue[Math.floor(Math.random() * bienvenue.length)])
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");
        message.channel.send(embed);
        
  }

};