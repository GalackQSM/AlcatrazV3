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
const Discord = require('discord.js');
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');

module.exports = class redtubeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'redtube',
      usage: 'redtube <recherche>',
      description: 'Trouver une vidéo sur le site RedTube.',
      type: client.types.NSFW,
      examples: ['redtube français']
    });
  }

  async run(msg) {

    const args = msg.content.split(' ').slice(1);

        const embed = new Discord.MessageEmbed().setColor(0x00FFFF);
        if (!msg.channel.nsfw) {
            embed.setTitle(''+emojis.nsfw+' NSFW')
            .setDescription("Impossible d'afficher le contenu NSFW dans un salon SFW.")
            .setFooter(config.footer)
            .setTimestamp()
            .setColor("#2f3136");

            return msg.channel.send({embed});
        }

    if (args.length === 0)
      return this.sendErrorMessage(msg, 0, 'Tu dois décider quel type de pornographie tu voudras voir'); 

    const Pornsearch = require('pornsearch');

    try {
      const Searcher = new Pornsearch(args.join(' '), 'redtube');
      const videos = await Searcher.videos();

      const result = Math.floor(Math.random() * videos.length);

      const { url } = videos[result - 1];
      const thumbnail = videos[result - 1].thumb;
      const { title } = videos[result - 1];
      const { duration } = videos[result - 1];
      const member = msg.member;

      const durationembed = (`${duration}`);
      const embed = new Discord.MessageEmbed()
        .setImage(thumbnail)
        .setDescription("**Titre de la vidéo:** "+title+"\n**Lien vers la vidéo:** [Clique ici]("+url+")\n**Durée de la vidéo:** "+durationembed+" minutes")
        .setColor("#2f3136")
        .setFooter(config.footer)
        .setAuthor(`${member.user.username}, voici votre recherche sur le site redtube`);        
      return msg.channel.send({
        embed
      });
    }
    catch (error) {
      return msg.reply("Impossible de trouver des gifs à ta demande");
    }
  }
};
