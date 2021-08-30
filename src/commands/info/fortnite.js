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
const Canvas = require("discord-canvas");
const Discord = require("discord.js");
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');

module.exports = class FortniteCommand extends Command {
    constructor (client) {
        super(client, {
            name: "fortnite",
            aliases: [ "fn" ],
            usage: 'fortnite <pc/psn/xbl> <Pseudo>',
            examples: ['fortnite psn Yobe79'],
            description: 'Recherche les statistiques d\'un joueur de Fortnite.',
            type: client.types.INFO,

        });
    }
 
    async run (message, args, data) {
        const member = message.member;

        if(!config.TrackerGG || config.TrackerGG.length === ""){
            return message.channel.send("Cette commande est actuellement désactivée !");
        }

        const stats = new Canvas.FortniteStats();

        const platform = args[0];
        if(!platform || (platform !== "pc" && platform !== "xbl" && platform !== "psn")){
            return message.channel.send("Entrez une plateforme valide: `psn`, `pc` ou `xbl`!");
        }

        const user = args.slice(1).join(" ");
        if(!user){
            return message.channel.send("Entrez un nom d'utilisateur valide");
        }

        const statsImage = await stats
            .setToken(config.TrackerGG)
            .setUser(user)
            .setPlatform(platform)
            .setText("averageKills", "TUERS/MATCH")
            .setText("averageKill", "TUER/MATCH")
            .setText("wPercent", "W%")
            .setText("winPercent", "Victoire %")
            .setText("kD", "WIN%")
            .setText("wins", "Victoires")
            .setText("win", "Victoire")
            .setText("kills", "Tuers")
            .setText("kill", "Tuer")
            .setText("matches", "Matchs")
            .setText("match", "Match")
            .setText("footer", config.footer)
            .toAttachment();
        
        if(!statsImage){
            message.delete();
            const error = new Discord.MessageEmbed()
                .setDescription(""+emojis.fail+" Le joueur **"+user+"** introuvable sur la plateforme **"+platform+"** !")
                .setColor("#2f3136")
                .setFooter(config.footer);
               return message.channel.send(error);

        }

        // Send embed
        const attachment = new Discord.MessageAttachment(statsImage.toBuffer(), "alcatraz-fortnite.png"),
            embed = new Discord.MessageEmbed()
                .setDescription("**"+member.user.username+"**, voici les statistique Fortnite de **"+stats.data.username+"**")
                .attachFiles(attachment)
                .setImage("attachment://alcatraz-fortnite.png")
                .setColor("#2f3136")
                .setFooter(config.footer);
        message.channel.send(embed);
        message.delete();
    }
}
