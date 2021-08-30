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
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");
const config = require('../../../config.json');


module.exports = class Joke extends Command {

  constructor (client) {
    super(client, {
      name: 'blague',
      aliases: ['joke'],
      usage: 'blague',
      description: 'Trouver une blague au hasard',
      type: client.types.FUN
    });
  }

  async run (message, args, data) {

    {
        var headers = { Authorization: "PHKgOQejoFh7ipfmOrzji9sRJkOEDd28M0IY6-klwjFojtkMFtfirTl.d4a3.Z--" }
        fetch('https://blague.xyz/api/joke/random/', { headers: headers }  )
        .then(rep => rep.json() )
        .then(json => {
        let random = new MessageEmbed()
        .setTitle(""+message.author.username+" voici une blague pour vous.")
        .setFooter(config.footer)
        .setTimestamp()
        .setColor("#2f3136")
        .setDescription(`**__Blague:__** ${json.joke["question"]}\n**__Réponse:__** ||${json.joke["answer"]}||`)
            message.channel.send(random);

        })

    }

  }

};