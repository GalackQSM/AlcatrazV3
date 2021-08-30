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
const Discord = require("discord.js");
const config = require('../../../config.json');
const { parse } = require("twemoji-parser");
module.exports = class AddEmojiCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addemoji',
      usage: 'addemoji [emoji] [lien] [nom]',
      description: 'Ajoutez un emoji',
      type: client.types.MOD,
      clientPermissions: ['MANAGE_EMOJIS'],
      userPermissions: ['MANAGE_EMOJIS'],
      examples: ['addemoji <:HOUSE_BRILLIANCE:761678113159512114> hypesquad brilliance']
    });
  }
async run(message, args){
  try {
      let name;
      const urlRegex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/)

      const emoji = args[0];
      if (!emoji) this.sendErrorMessage(message, 0, 'Veuillez mentionner un emoji valide.'); 
      
      let customemoji = Discord.Util.parseEmoji(emoji) //Check if it's a emoji
  
      if (customemoji.id) {
        const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
          customemoji.animated ? "gif" : "png"
        }`
        name = args.slice(1).join("_")
       const emoji = await message.guild.emojis.create(
          `${Link}`,
          `${name || `${customemoji.name}`}`
        );
        const Added = new MessageEmbed()
          .setDescription(`L'emoji a été ajouté! | Nom: ${emoji.name || `${customemoji.name}`} | Aperçu: ${emoji}`)
          .setColor(`#2f3136`)
          .setTimestamp()
          .setFooter(config.footer);
        return message.channel.send(Added);
      } else if (urlRegex.test(args[0])) { //check for image urls
        name = args.slice(1).join("_") || Math.random().toString(36).slice(2) //make the name compatible or just choose a random string
        const addedEmoji = await message.guild.emojis.create(
          `${emoji}`,
          `${name || `${customemoji.name}`}`
        );
        return message.channel.send(new MessageEmbed()
          .setDescription(`L'emoji a été ajouté! | Nom: ${emoji.name || `${customemoji.name}`} | Aperçu: ${addedEmoji}`)
          .setColor(`#2f3136`)
          .setTimestamp()
          .setFooter(config.footer));
        } else {
        let CheckEmoji = parse(emoji, { assetType: "png" });
        if (!CheckEmoji[0])
          return this.sendErrorMessage(message, 0, 'Veuillez mentionner un emoji valide.'); 
      }
    } catch (err) {
      this.client.logger.error(err)
      this.sendErrorMessage(message, 1, 'Une erreur s\'est produite lors de l\'ajout de l\'emoji. Les raisons courantes sont les suivantes: aractères non autorisés dans le nom emoji, limite de 50 emoji.', err)
    }
 }
}