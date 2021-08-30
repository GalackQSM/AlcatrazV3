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
const querystring = require('querystring');
const { MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = class VoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'vote',
            usage: 'vote',
            description: 'Votez pour Alcatraz sur les site de bot liste.',
            type: client.types.GENERAL,
              })
    }

    run(message, args) {
        const embed = new MessageEmbed()
            .setTitle(""+message.author.username+" voici le lien pour voter ")
            .setDescription("Vote pour "+config.NomBot+" sur [Top.gg](https://top.gg/bot/"+config.BotID+"/vote)\nVote pour "+config.NomBot+" sur [Infinity Bot List](https://infinitybotlist.com/bots/"+config.BotID+"/vote)\nVote pour "+config.NomBot+" sur [Discord Boats](https://discord.boats/bot/"+config.BotID+"/vote)\nVote pour "+config.NomBot+" sur [VoidBots](https://voidbots.net/bot/"+config.BotID+"/vote)\nVote pour "+config.NomBot+" sur [Bots For Discord](https://botsfordiscord.com/bot/"+config.BotID+"/vote)")
            .setImage("https://i.imgur.com/XdibCd4.png")
            .setFooter(config.footer)
            .setTimestamp()
            .setColor("#2f3136");

        message.channel.send(embed)
    }
}
