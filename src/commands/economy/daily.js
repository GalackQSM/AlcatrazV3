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
const ms = require('parse-ms')
const config = require('../../../config.json');
const emojis = require('../../utils/emojis.json');

module.exports = class BalanceCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'daily',
        usage: 'daily',
        description: 'Récupérer l\'argent du jour',
        type: client.types.ECONOMY
      });
    }
    
    async run (message, args) {
let user = message.author;

let timeout = 86400000;
let amount = `${Math.floor(Math.random() * 500) + 1}`;

let daily = await db.fetch(`daily_${user.id}`);

if (daily !== null && timeout - (Date.now() - daily) > 0) {
    let time = ms(timeout - (Date.now() - daily));

    let timeEmbed = new MessageEmbed()
        .setAuthor("Déjà réclamer!")
        .setColor("#2f3136")
        .setFooter(config.footer)
        .setDescription(`Tu as déjà demandé aujourd'hui, reviens dans: **${time.hours}heure(s), ${time.minutes}minute(s), ${time.seconds}seconde(s)**`);
    message.channel.send(timeEmbed)
} else {
    let moneyEmbed = new MessageEmbed()
        .setColor("#2f3136")
        .setFooter(config.footer)
        .setDescription(""+emojis.success+" Vous avez récupéré votre récompense quotidienne de "+amount+" AlkaCoins");
    message.channel.send(moneyEmbed)
    db.add(`money_${user.id}`, amount)
    db.set(`daily_${user.id}`, Date.now())


}
}
}