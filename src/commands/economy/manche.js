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
                                                                       
const Command = require('../Alcatraz.js');const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const ms = require("parse-ms");
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');

module.exports = class BegCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'manche',
        usage: 'manche',
        description: 'Faire la manche',
        type: client.types.ECONOMY
      });
    }
    async run (message) {
        let user = message.author;

        let timeout = 120000;
        let amount = `${Math.floor(Math.random() * 100) + 1}`;

        let beg = await db.fetch(`beg_${user.id}`);

        if (beg !== null && timeout - (Date.now() - beg) > 0) {
            let time = ms(timeout - (Date.now() - beg));

            let timeEmbed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setFooter(config.footer)
                .setDescription(""+emojis.error+" Vous avez déjà fais la manche récemment\nReviens dans "+time.minutes+"m "+time.seconds+"s");
            message.channel.send(timeEmbed)
        } else {
            let moneyEmbed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setFooter(config.footer)
                .setDescription(""+emojis.success+" Tu as fais la manche et tu as reçu "+amount+" AlkaCoins");
            message.channel.send(moneyEmbed)
            db.add(`money_${user.id}`, amount)
            db.add(`begs_${user.id}`, 1)
            db.set(`beg_${user.id}`, Date.now())


        }
    }
};