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
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const ms = require("parse-ms");
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');
const Jwork = require('../../utils/works.json');
const JworkR = Jwork[Math.floor(Math.random() * Jwork.length)];

module.exports = class WorkCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'work',
        usage: 'work',
        description: 'travailler pour quelques pièces',
        type: client.types.ECONOMY
      });
    }
    async run (message) {

            let user = message.author;
            let author = await db.fetch(`work_${user.id}`)
    
            let timeout = 1800000;
    
            if (author !== null && timeout - (Date.now() - author) > 0) {
                let time = ms(timeout - (Date.now() - author));
    
                let timeEmbed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setFooter(config.footer)
                    .setDescription(""+emojis.error+" Vous avez déjà travaillé récemment\nRéessayez dans `"+time.minutes+"m "+time.seconds+"s` ");
                message.channel.send(timeEmbed)
            } else {
                let amount = Math.floor(Math.random() * 80) + 1;
                let embed1 = new MessageEmbed()
                    .setColor("#2f3136")
                    .setFooter(config.footer)
                    .setDescription(""+emojis.success+" **"+JworkR+"\n"+amount+"** AlkaCoins")
                message.channel.send(embed1)
    
                db.add(`works_${user.id}`, 1)
                db.add(`money_${user.id}`, amount)
                db.set(`work_${user.id}`, Date.now())
            };
        }
    }