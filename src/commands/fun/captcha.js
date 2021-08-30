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

module.exports = class CaptchaCommand extends Command {
  constructor(client) {
    super(client, {
            name: 'captcha',
            aliases: ["cpt"],
            description: 'Une commande pour afficher l\'image Captcha de votre avatar ou de l\'avatar de l\'utilisateur mentionné!',
            examples: ["captcha @membre"],
            type: client.types.FUN,

        });
    }
    async run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const member = message.member;

        try {
            let uname = args.slice(1).join(" ");
            let men = this.client.users.cache.get(args[0]) || message.mentions.users.first();
            if (!uname) return message.channel.send(new MessageEmbed()
            .setDescription(`**Cette commande est utilisée comme ceci ${prefix}captcha @membre <texte> !**`)
            .setFooter(config.footer)               
            .setColor("#2f3136")
            .setTimestamp());
            let userurl = men.displayAvatarURL()
            let body = await fetch(`https://nekobot.xyz/api/imagegen?type=captcha&username=${uname}&url=${userurl}`).then(url => url.json());
            console.log(body);
            let captchaembed = new MessageEmbed()
            .setDescription(`**${member.user.username}** un nouveau captcha viens d'apparaître`)
            .setColor("#2f3136")
            .setImage(body.message)
            .setTimestamp()
            .setFooter(config.footer)
            message.channel.send(captchaembed);
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