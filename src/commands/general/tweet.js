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
const fetch = require("node-fetch");
const config = require('../../../config.json');

module.exports = class TweetCommand extends Command {
  constructor(client) {
    super(client, {
            name: 'tweet',
            description: 'Une commande pour tweeter à travers le texte fourni!',
            examples: ["tweet [Nom] [Texte]"],
            type: client.types.FUN,
        });
    }
    async run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const member = message.member;

        try {
            let text = args.slice(1).join(" ");
            let uname = args[0];
            if (!text || !uname) return message.channel.send(new MessageEmbed()
           .setDescription(`**Cette commande est utilisée comme ceci ${prefix}tweet [Nom] [Texte] !**`)
           .setFooter(config.footer)
           .setColor("#2f3136")
           .setTimestamp());
            let body = await fetch(`https://nekobot.xyz/api/imagegen?type=tweet&username=${uname}&text=${text}`).then(url => url.json());
            let tweetembed = new MessageEmbed()
           .setDescription(`**${member.user.username}** regarde **${uname}** viens de tweeter`)
           .setColor("#2f3136")
           .setImage(body.message)
           .setTimestamp()
           .setFooter(config.footer)
            message.channel.send(tweetembed);
        } catch (error) {
            console.log(error);
            message.channel.send(new MessageEmbed()
           .setDescription(`**Erreur: ${error}**`)
           .setColor("#2f3136")
           .setFooter(config.footer)
           .setTimestamp());
        }
    }
};
