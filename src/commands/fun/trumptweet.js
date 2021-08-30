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
const fetch = require('node-fetch');
const config = require('../../../config.json');

module.exports = class TrumpTweetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trumptweet',
      usage: 'trumptweet <message>',
      description: 'Afficher un tweet personnalisé de Donald Trump avec le message fourni.',
      type: client.types.FUN,
      examples: ['trumptweet Alcatraz, un bot discord super en open-source!']
    });
  }
  async run(message, args) {

    // Get message
    if (!args[0]) return this.sendErrorMessage(message, 0, 'Aucun message fourni. Veuillez fournir un message pour tweeter.');
    let tweet = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    if (tweet.length > 68) tweet = tweet.slice(0, 65) + '...';

    try {
      const res = await fetch('https://nekobot.xyz/api/imagegen?type=trumptweet&text=' + tweet);
      const img = (await res.json()).message;
      const embed = new MessageEmbed()
        .setTitle(':flag_us: Tweet de Donald Trump :flag_us: ')
        .setImage(img)
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136");
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 'Un problème est survenu. Veuillez réessayer dans quelques secondes.', err.message);
    }
  }
};
