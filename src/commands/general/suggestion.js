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
const config = require('../../../config.json');

module.exports = class SondageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'suggestion',
      usage: 'suggestion <message>',
      aliases: ['sugg'],
      description: 'Crée des suggestions.',
      type: client.types.GENERAL,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      examples: ['suggestion Vous voulez un cookie ?']
    });
  }

  async run(message, args) {
        const msg = args.join(' ');
    if (!msg) return this.sendErrorMessage(message, 0, 'Veuillez fournir un message.');

    let firstReaction, secondReaction;
    if (message.guild.id === '775902680454922271'){
        firstReaction = '776109858948120636';
        secondReaction = '776495050406101093';  
      } else {
        firstReaction = '<:alcatraz_valider:776109858948120636>';
        secondReaction = '<:alcatraz_error:776495050406101093>';
      }
      let suggestEmbed = new MessageEmbed()
      .setAuthor("Suggestion - "+message.author.tag+"")
      .addField("`Auteur`", message.author.tag, true)
      .addField("Contenu", msg)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");

      try{
        message.channel.send({embed: suggestEmbed}).then(sentEmbed => {
        message.delete();
        sentEmbed.react(firstReaction);
        sentEmbed.react(secondReaction);
      });
    } catch{
      message.channel.send("Oh oh! Une erreur s'est produite lors de la tentative de création d'un sondage!");
      return;
    }
    
      
  }
};
