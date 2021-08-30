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
const search = require('youtube-search');
const he = require('he');
const config = require('../../../config.json');

module.exports = class YoutubeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'youtube',
      aliases: ['yt'],
      usage: 'youtube <nom de vidéo>',
      description: 'Recherche sur YouTube la vidéo spécifiée.',
      type: client.types.FUN,
      examples: ['youtube Alcatraz bot discord']
    });
  }
  async run(message, args) {
    const apiKey = message.client.apiKeys.googleApi;
    const videoName = args.join(' ');
    if (!videoName) return this.sendErrorMessage(message, 0, 'Argument invalide. Veuillez fournir un nom de vidéo YouTube.');
    const searchOptions = { maxResults: 1, key: apiKey, type: 'video' };
    if (!message.channel.nsfw) searchOptions['safeSearch'] = 'strict';
    let result = await search(videoName, searchOptions)
      .catch(err => {
        message.client.logger.error(err);
        return this.sendErrorMessage(message, 'Un problème est survenu. Veuillez réessayer dans quelques secondes.', err.message);
      });
    result = result.results[0];
    if (!result) 
      return this.sendErrorMessage(message, 'Impossible de trouver la vidéo. Veuillez fournir un nom de vidéo YouTube différent.');
    const decodedTitle = he.decode(result.title);
    const embed = new MessageEmbed()
      .setTitle(decodedTitle)
      .setURL(result.link)
      .setThumbnail('https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-512.png')
      .setDescription(result.description)
      .setFooter(config.footer)
      .setTimestamp()
      .setColor("#2f3136");
    if (message.channel.nsfw) embed.setImage(result.thumbnails.high.url);
    message.channel.send(embed);
  }
};
