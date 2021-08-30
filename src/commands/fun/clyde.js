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
discord = require("discord.js");
fetch = require("node-fetch");
const config = require('../../../config.json');

module.exports = class ClydeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clyde',
      usage: 'clyde <texte>',
      description: 'Génère une image \"clyde\" en utilisant l\'API Nekobot.',
      type: client.types.FUN,
      examples: ['clyde Alcatraz le meilleur bot open-source']
    });
  }

  async run (message, args) {

    const text = args.join(" ");

    if(!text){
      return message.error("Veuillez préciser un texte valide !");
    }

    try {
      const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=clyde&text=${text}`));
      const json = await res.json();
      const attachment = new Discord.MessageAttachment(json.message, "clyde.png");
      message.channel.send(attachment);
      m.delete();
    } catch(e){
      console.log(e);
      m.error("Quelque chose s'est mal passé... Merci de patienter puis réessayez!", null, {
        edit: true
      });
    }

  }

};

