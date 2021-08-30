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
const emojis = require('../../utils/emojis.json');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = class LockCommand extends Command {
    constructor(client) {
        super(client, {
      name: 'lock',
      usage: 'lock [activer/désactiver]',
      description: 'Permet de bloquée le salon.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['MANAGE_CHANNELS'],
      examples: ['lock activer']
        })
    }
    async run(message, args) {

        if (!args[0]) return message.channel.send("Choisir entre `activer` ou `désactiver`")

        if (args[0] == "activer") {
            message.channel.updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGES: false
            }).then(g => {
                g.edit({
                    name: g.name + ' 🔒'
                })
    const embed = new MessageEmbed()
      .setTitle(""+emojis.lock+" | Salon vérrouillée avec succès")
      .setDescription(""+emojis.success+" Le salon a bien été vérrouillée par "+message.author+".")
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
      g.send(embed);
            })
        } else if(args[0] == "désactiver") {
            message.channel.updateOverwrite(message.guild.roles.everyone, {
                SEND_MESSAGES: true
            }).then(g => {
                g.edit({
                    name: g.name.replace(/\s*🔒/, '')
                })
    const embed = new MessageEmbed()
      .setTitle(""+emojis.unlock+" | Salon déverrouillée avec succès")
      .setDescription(""+emojis.success+" Le salon a bien été déverrouillée.")
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
      g.send(embed);

            })
        } else message.reply("Option invalide")
    }
}
