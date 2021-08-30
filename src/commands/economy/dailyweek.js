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

module.exports = class WeeklyCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'dailyweek',
        usage: 'dailyweek',
        description: 'Réclamez vos AlkaCoins hebdomadaires',
        type: client.types.ECONOMY
      });
    }
    async run (message) {
        let user = message.author;
        let timeout = 604800000;
        let amount = `${Math.floor(Math.random() * 1000) + 1}`;

        let weekly = await db.fetch(`weekly_${user.id}`);

        if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
            let time = ms(timeout - (Date.now() - weekly));

            let timeEmbed = new MessageEmbed()
                .setAuthor('Déjà réclamer!')
                .setColor("#2f3136")
                .setFooter(config.footer)
                .setDescription(`Tu as déjà demandé aujourd'hui, reviens dans **${time.days}jour(s), ${time.hours}heure(s), ${time.minutes}minute(s)**`);
            message.channel.send(timeEmbed)
        } else {
            let embed = new MessageEmbed()
                .setAuthor(`Voici vos pièces hebdomadaires, ${message.member.displayName}`)
                .setColor("#2f3136")
                .setFooter(config.footer)
                .setDescription(""+emojis.success+" Vos "+amount+" AlkaCoins ont été placées dans votre portefeuille"); 
            message.channel.send(embed)
            db.add(`money_${user.id}`, amount)
            db.set(`weekly_${user.id}`, Date.now())


        }
    }
}