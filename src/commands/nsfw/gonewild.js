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
const emojis = require('../../utils/emojis.json');
const fetch = require("node-fetch");
const { oneLine, stripIndent } = require('common-tags');
const ror = require("@spyte-corp/discord.js-remove-on-reaction");
const config = require('../../../config.json');

module.exports = class GonewildCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gonewild',
      usage: 'gonewild',
      description: oneLine`
        Affiche une image NSFW.
      `,
      type: client.types.NSFW,
    });
  }
  run(message, args) {
        const embed = new MessageEmbed().setColor(0x00FFFF);
        if (!message.channel.nsfw) {
            embed.setTitle(''+emojis.nsfw+' NSFW')
            .setDescription("Impossible d'afficher le contenu NSFW dans un salon SFW.")
            .setFooter(config.footer)
            .setTimestamp()
            .setColor("#2f3136");

            return message.channel.send({embed});
        }
        message.channel.startTyping();
        fetch(`https://nekobot.xyz/api/image?type=gonewild`)
            .then(res => res.json())
            .then(data => {
                embed.setImage(data.message)
                embed.setTitle(''+emojis.nsfw+' '+message.author.username+' voici votre image Gonewild')
                embed.setFooter(config.footer)
                embed.setTimestamp()
                embed.setColor("#2f3136");

                message.channel.send({embed}).then(msg => { 
                    ror(message, msg, true);
                    msg.react("🗑");
                });
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);
    }
};