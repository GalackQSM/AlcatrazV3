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
const translate = require("@vitalets/google-translate-api");
const config = require('../../../config.json');

module.exports = class TraductionCommand extends Command {
  constructor(client) {
    super(client, {
            name: 'traduction',
            aliases: ["translate"],
            type: client.types.GENERAL,
            description: 'Une commande pour traduire le texte fourni dans la langue souhaitée!',
            examples: ["traduction fr hello"],
        });
    }
    async run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const member = message.member;

        try {
            const toLanguage = args[0];
            const text = args.slice(1).join(" ");
            if (!toLanguage || !text) return message.channel.send(new MessageEmbed()
                .setDescription(`**Cette commande est utilisée comme ceci ${prefix}traduction [Langue] [Texte]\`!**`)
                .setFooter(config.footer)
                .setColor("#2f3136")
                .setTimestamp());
            translate(text, { to: toLanguage }).then(res => {
                const translation = new MessageEmbed()
                    .setTitle(""+member.user.username+" Voici votre traduction !")
                    .setDescription(`**De**: ${res.from.language.iso.toUpperCase()}\n**À**: ${toLanguage.toUpperCase()}\n**Traduction**: ${res.text}`)
                    .setFooter(config.footer)
                    .setColor("#2f3136")
                    .setTimestamp()
                message.channel.send(translation);
            }).catch(error => {
                console.log(error);
                return message.channel.send(new MessageEmbed()
                    .setTitle("Une erreur s'est produite")
                    .setDescription(`**Erreur: ${error}**`)
                    .setColor("#2f3136")
                    .setFooter(config.footer)
                    .setTimestamp());
            });
        } catch (error) {
            console.log(error);
            return message.channel.send(new MessageEmbed()
                .setTitle("Une erreur s'est produite")
                .setDescription(`**Erreur: ${error}**`)
                .setColor("#2f3136")
                .setFooter(config.footer)
                .setTimestamp());
        }
    }
};
